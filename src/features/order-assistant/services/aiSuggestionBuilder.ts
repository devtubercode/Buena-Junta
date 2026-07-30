import { supabase } from "@/lib/supabase/client";
import type { MenuProduct } from "@/features/menu/types/menu.types";
import type { Promotion } from "@/features/home/types/promotion.types";
import type {
  ItemConfigurationStatus,
  SuggestedOrder,
  SuggestedOrderItem,
  SuggestionFormData,
} from "@/features/order-assistant/types/order-assistant.types";
import { buildLineId } from "@/features/order-assistant/services/suggestionBuilder";
import {
  calculateAdditionsTotal,
  calculateSubtotal,
  calculateUnitPrice,
  resolveBasePrice,
} from "@/domain/pricing/calculatePrice";
import { validateConfiguration } from "@/domain/product-configuration/validateConfiguration";
import { checkBudget } from "@/domain/ordering/budget";

type AIResponse = {
  items: Array<{
    productId: string;
    variantId: string | null;
    selectedOptions: Record<string, string>;
    additionKeys: string[];
    quantity: number;
  }>;
  sharedPromotionSlug: string | null;
  explanation: {
    summary: string;
    perItem: Record<string, string>;
  };
};

function buildCustomItem(
  product: MenuProduct,
  aiSelection: AIResponse["items"][number],
): SuggestedOrderItem {
  const variantId = aiSelection.variantId ?? undefined;
  const selectedVariant = variantId
    ? (product.priceVariants.find((v) => v.id === variantId) ?? null)
    : null;

  const additionOptions = product.additions
    .filter((a) => aiSelection.additionKeys.includes(a.id))
    .map((a) => ({ key: a.id, label: a.name, unitPrice: a.price }));

  const basePrice = resolveBasePrice(
    product.priceVariants,
    product.sale_price ?? product.price,
    variantId,
  );
  const additionsTotal = calculateAdditionsTotal(additionOptions);
  const unitPrice =
    calculateUnitPrice({
      basePrice,
      selectedVariant,
      variants: product.priceVariants,
      additionsTotal,
    }) ?? 0;

  const subtotal = calculateSubtotal(unitPrice, aiSelection.quantity) ?? 0;

  const validation = validateConfiguration(
    product.priceVariants,
    product.groups,
    product.additions.length > 0,
    {
      variantKey: selectedVariant?.label,
      selectedOptions: aiSelection.selectedOptions,
      additionOptions,
    },
  );

  const lineId = buildLineId(
    product.id,
    variantId,
    additionOptions,
    aiSelection.selectedOptions,
  );

  return {
    lineId,
    productId: product.id,
    productName: product.name,
    urlImage: product.urlImage,
    variantId,
    variantLabel: selectedVariant?.label,
    selectedOptions: aiSelection.selectedOptions,
    additionOptions,
    quantity: aiSelection.quantity,
    unitPrice,
    subtotal,
    configurationStatus: validation.status as ItemConfigurationStatus,
    isValid: validation.isValid,
  };
}

export async function buildAISuggestion(
  formData: SuggestionFormData,
  products: MenuProduct[],
  promotions: Promotion[],
): Promise<SuggestedOrder> {
  const { data, error } = await supabase.functions.invoke<AIResponse>(
    "assistant-suggest",
    {
      body: {
        peopleCount: formData.peopleCount,
        maximumBudget: formData.maximumBudget,
        preferredCategorySlugs: formData.preferredCategorySlugs,
        exclusions: formData.exclusions,
        hasSharedItem: formData.hasSharedItem,
      },
    },
  );

  console.log("Response from assistant-suggest:", data, error);

  if (error || !data) {
    throw new Error(
      error?.message ?? "No pudimos generar una sugerencia con IA.",
    );
  }

  const productMap = new Map(products.map((p) => [p.id, p]));
  const promoMap = new Map(promotions.map((p) => [p.slug, p]));

  const items: SuggestedOrderItem[] = [];

  for (const sel of data.items) {
    const product = productMap.get(sel.productId);
    if (!product) continue;
    items.push(buildCustomItem(product, sel));
  }

  if (data.sharedPromotionSlug) {
    const promo = promoMap.get(data.sharedPromotionSlug);
    if (promo) {
      const promoItem: SuggestedOrderItem = {
        lineId: `promo-${promo.slug}`,
        productId: `promo-${promo.slug}`,
        productName: promo.title,
        urlImage: promo.image
          ? { src: promo.image, alt: promo.imageAlt }
          : undefined,
        variantId: undefined,
        variantLabel: undefined,
        selectedOptions: {},
        additionOptions: [],
        quantity: 1,
        unitPrice: promo.promotionPrice,
        subtotal: promo.promotionPrice,
        configurationStatus: "complete",
        isValid: true,
      };
      items.push(promoItem);
    }
  }

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  const budgetCheck = checkBudget(total, formData.maximumBudget);
  const incompleteItemCount = items.filter((i) => !i.isValid).length;
  const isComplete = incompleteItemCount === 0;

  const rawPerItem = data.explanation?.perItem ?? {};
  const perItem: Record<string, string> = {};
  for (const item of items) {
    const explanation = rawPerItem[item.productId] ?? rawPerItem[item.lineId];
    if (explanation) {
      perItem[item.lineId] = explanation;
    }
  }

  return {
    items,
    total,
    peopleCount: formData.peopleCount,
    budget: formData.maximumBudget,
    withinBudget: budgetCheck.withinBudget,
    budgetMargin: budgetCheck.margin,
    explanation: {
      summary: data.explanation?.summary ?? "",
      perItem,
      warnings: [],
    },
    isComplete,
    incompleteItemCount,
  };
}
