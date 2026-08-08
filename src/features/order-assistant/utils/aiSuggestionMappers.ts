import type { MenuProduct } from "@/features/menu/types/menu.types";
import type { Promotion } from "@/features/home/types/promotion.types";
import type {
  AISuggestionResponse,
  SuggestedOrderExplanationDerived,
  SuggestedOrderProduct,
  SuggestedOrderPromotion,
} from "@/features/order-assistant/types/order-assistant.types";
import { buildLineId } from "@/features/order-assistant/utils/suggestionBuilder";
import {
  calculateAdditionsTotal,
  calculateSubtotal,
  calculateUnitPrice,
  resolveBasePrice,
} from "@/domain/pricing/calculatePrice";
import { validateConfiguration } from "@/domain/product-configuration/validateConfiguration";

export const mapSuggestedProducts = (
  aiItems: AISuggestionResponse["items"],
  products: MenuProduct[],
): SuggestedOrderProduct[] => {
  const productMap = new Map(products.map((p) => [p.id, p]));

  const suggestedProducts: SuggestedOrderProduct[] = [];

  for (const aiSelection of aiItems) {
    const product = productMap.get(aiSelection.productId);
    if (!product) continue;

    const variantId = undefined;
    const variantLabel = undefined;
    const additionOptions: SuggestedOrderProduct["additionOptions"] = [];
    const selectedOptions: Record<string, string> = {};
    const quantity = aiSelection.quantity ?? 1;

    const basePrice = resolveBasePrice(
      product.priceVariants,
      product.sale_price ?? product.price,
      variantId,
    );
    const additionsTotal = calculateAdditionsTotal(additionOptions);
    const unitPrice =
      calculateUnitPrice({
        basePrice,
        selectedVariant: null,
        variants: product.priceVariants,
        additionsTotal,
      }) ?? 0;

    const subtotal = calculateSubtotal(unitPrice, quantity) ?? 0;

    const validation = validateConfiguration(
      product.priceVariants,
      product.groups,
      product.additions.length > 0,
      { variantKey: undefined, selectedOptions, additionOptions },
    );

    const lineId = buildLineId(
      product.id,
      variantId,
      additionOptions,
      selectedOptions,
    );

    suggestedProducts.push({
      lineId,
      productId: product.id,
      productName: product.name,
      urlImage: product.urlImage,
      variantId,
      variantLabel,
      selectedOptions,
      additionOptions,
      quantity,
      unitPrice,
      subtotal,
      configurationStatus: validation.status,
    });
  }

  return suggestedProducts;
};

export const mapSuggestedPromotion = (
  sharedPromotionId: string | null,
  promotions: Promotion[],
): SuggestedOrderPromotion | null => {
  if (!sharedPromotionId) return null;

  const promo = promotions.find((p) => p.id === sharedPromotionId);
  if (!promo) return null;

  return {
    id: promo.id,
    title: promo.title,
    urlImage: promo.image
      ? { src: promo.image, alt: promo.imageAlt }
      : undefined,
    quantity: 1,
    unitPrice: promo.promotionPrice,
    subtotal: promo.promotionPrice,
  };
};

export const mapSuggestionExplanation = (
  response: AISuggestionResponse,
  products: SuggestedOrderProduct[],
  promotion: SuggestedOrderPromotion | null,
): SuggestedOrderExplanationDerived => {
  const summary = response.explanation?.summary ?? "";

  const perProduct: Record<string, string> = {};
  for (const product of products) {
    const explanation =
      response.explanation?.itemReasons?.[product.productId] ??
      response.explanation?.itemReasons?.[product.lineId];
    if (explanation !== undefined) {
      perProduct[product.lineId] = explanation;
    }
  }

  const promotionExplanation = promotion
    ? response.explanation?.itemReasons?.[`promo-${promotion.id}`]
    : undefined;

  return {
    summary,
    perProduct,
    promotion: promotionExplanation,
    warnings: [],
  };
};
