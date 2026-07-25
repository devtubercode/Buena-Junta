import type { MenuProduct } from "@/features/menu/types/menu.types";
import type { Promotion } from "@/features/home/types/promotion.types";
import type {
  ItemConfigurationStatus,
  SuggestedOrder,
  SuggestedOrderItem,
  SuggestionFormData,
} from "@/features/order-assistant/types/order-assistant.types";
import {
  calculateAdditionsTotal,
  calculateSubtotal,
  calculateUnitPrice,
  resolveBasePrice,
} from "@/domain/pricing/calculatePrice";
import { validateConfiguration } from "@/domain/product-configuration/validateConfiguration";
import { checkBudget } from "@/domain/ordering/budget";

function normalizeAdditionKeys(
  additionOptions: Array<{ key: string }>,
): string {
  return [...additionOptions]
    .map((o) => o.key)
    .sort()
    .join("|");
}

function normalizeSelectedOptions(
  selectedOptions: Record<string, string>,
): string {
  return Object.entries(selectedOptions)
    .map(([key, value]) => [
      key.trim().toLowerCase(),
      value.trim().toLowerCase(),
    ])
    .filter(([, value]) => value.length > 0)
    .sort(([a], [b]) => String(a).localeCompare(String(b)))
    .map(([key, value]) => `${key}=${value}`)
    .join("|");
}

export function buildLineId(
  productId: string,
  variantKey: string | undefined,
  additionOptions: Array<{ key: string }>,
  selectedOptions: Record<string, string>,
): string {
  return [
    productId,
    variantKey ?? "base",
    normalizeAdditionKeys(additionOptions),
    normalizeSelectedOptions(selectedOptions),
  ].join("::");
}

function getEffectivePrice(product: MenuProduct): number {
  if (product.priceVariants.length > 0) {
    const defaultVariant = product.priceVariants[0];
    return defaultVariant?.price ?? 0;
  }
  return product.sale_price ?? product.price ?? 0;
}

type ProductSelection = {
  product: MenuProduct;
  quantity: number;
  isShared: boolean;
};

function getFirstAvailableVariantKey(product: MenuProduct): string | undefined {
  const firstVariant = product.priceVariants[0];
  return firstVariant?.label;
}

function getDefaultOptions(
  product: MenuProduct,
  exclusions: string[],
): Record<string, string> {
  const options: Record<string, string> = {};
  for (const group of product.groups) {
    if (!group.is_active || !group.is_required) continue;
    const firstOption = group.options.find(
      (o) =>
        o.is_active &&
        !exclusions.some((term) => o.name.toLowerCase().includes(term)),
    );
    if (firstOption) {
      options[group.name] = firstOption.name;
    }
  }
  return options;
}

function buildPromotionItem(
  promotion: Promotion,
): SuggestedOrderItem {
  const lineId = `promo-${promotion.slug}`;
  return {
    lineId,
    productId: lineId,
    productName: promotion.title,
    urlImage: promotion.image
      ? { src: promotion.image, alt: promotion.imageAlt }
      : undefined,
    variantKey: undefined,
    selectedOptions: {},
    additionOptions: [],
    quantity: 1,
    unitPrice: promotion.promotionPrice,
    subtotal: promotion.promotionPrice,
    configurationStatus: "complete" as ItemConfigurationStatus,
    isValid: true,
  };
}

function buildSuggestedItem(
  product: MenuProduct,
  quantity: number,
  exclusions: string[],
): SuggestedOrderItem {
  const variantKey = getFirstAvailableVariantKey(product);
  const selectedOptions = getDefaultOptions(product, exclusions);
  const additionOptions: SuggestedOrderItem["additionOptions"] = [];

  const basePrice = resolveBasePrice(
    product.priceVariants,
    product.sale_price ?? product.price,
    variantKey,
  );
  const additionsTotal = calculateAdditionsTotal(additionOptions);
  const unitPrice =
    calculateUnitPrice({
      basePrice,
      selectedVariant: variantKey
        ? (product.priceVariants.find((v) => v.label === variantKey) ?? null)
        : null,
      variants: product.priceVariants,
      additionsTotal,
    }) ?? 0;

  const subtotal = calculateSubtotal(unitPrice, quantity) ?? 0;

  const validation = validateConfiguration(
    product.priceVariants,
    product.groups,
    product.additions.length > 0,
    { variantKey, selectedOptions, additionOptions },
  );

  const lineId = buildLineId(
    product.id,
    variantKey,
    additionOptions,
    selectedOptions,
  );

  return {
    lineId,
    productId: product.id,
    productName: product.name,
    urlImage: product.urlImage,
    variantKey,
    selectedOptions,
    additionOptions,
    quantity,
    unitPrice,
    subtotal,
    configurationStatus: validation.status as ItemConfigurationStatus,
    isValid: validation.isValid,
  };
}

function isLikelyShared(product: MenuProduct): boolean {
  const hints = [
    product.name,
    product.description,
    ...(product.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return /compartir|familiar|grande|para\s*dos|porción|comparte|family/i.test(
    hints,
  );
}

function seededShuffle<T>(array: T[], seed: number): T[] {
  const result = [...array];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function selectProducts(
  available: MenuProduct[],
  peopleCount: number,
  hasSharedItem: boolean,
  iteration: number = 0,
): ProductSelection[] {
  if (available.length === 0) return [];

  const sorted = [...available].sort(
    (a, b) => getEffectivePrice(a) - getEffectivePrice(b),
  );

  const candidates = seededShuffle(sorted, iteration);

  const itemsPerPerson = 2;
  let totalItems = Math.max(2, peopleCount * itemsPerPerson);
  const maxItems = available.length * 2;
  totalItems = Math.min(totalItems, maxItems);

  if (hasSharedItem && candidates.length > 0) {
    const shareCandidate =
      candidates.find((p) => isLikelyShared(p)) ??
      [...candidates].sort(
        (a, b) => getEffectivePrice(b) - getEffectivePrice(a),
      )[0];

    const pool = candidates.filter((p) => p.id !== shareCandidate.id);
    const remaining = Math.max(0, totalItems - 1);
    const distribution = distributeItems(pool, remaining);

    return [
      { product: shareCandidate, quantity: 1, isShared: true },
      ...distribution,
    ];
  }

  return distributeItems(candidates, totalItems);
}

function distributeItems(
  products: MenuProduct[],
  count: number,
): ProductSelection[] {
  if (products.length === 0 || count <= 0) return [];

  const byCategory = new Map<string, MenuProduct[]>();
  for (const p of products) {
    const key = p.category?.slug ?? "__uncategorized__";
    if (!byCategory.has(key)) byCategory.set(key, []);
    byCategory.get(key)!.push(p);
  }

  const categoryKeys = [...byCategory.keys()];
  const cursor: Record<string, number> = {};
  for (const key of categoryKeys) cursor[key] = 0;

  const result: ProductSelection[] = [];
  let allocated = 0;

  while (allocated < count) {
    for (const key of categoryKeys) {
      if (allocated >= count) break;
      const pool = byCategory.get(key)!;
      const idx = cursor[key] % pool.length;
      cursor[key] = idx + 1;
      const product = pool[idx];

      const existing = result.find((r) => r.product.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        result.push({ product, quantity: 1, isShared: false });
      }
      allocated++;
    }
  }

  return result;
}

function formatCOP(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price);
}

function buildExplanation(
  items: SuggestedOrderItem[],
  selections: ProductSelection[],
  formData: SuggestionFormData,
): SuggestedOrder["explanation"] {
  const warnings: string[] = [];
  const perItem: Record<string, string> = {};

  for (const item of items) {
    const isPromo = item.productId.startsWith("promo-");
    if (isPromo) {
      perItem[item.lineId] = `Incluye la promoción ${item.productName}.`;
      continue;
    }
    const parts: string[] = [];
    if (item.variantKey) {
      parts.push(`presentación ${item.variantKey}`);
    }
    const optionValues = Object.values(item.selectedOptions);
    if (optionValues.length > 0) {
      parts.push(`con ${optionValues.join(", ")}`);
    }
    perItem[item.lineId] =
      parts.length > 0
        ? `Sugerimos ${item.productName} ${parts.join(" ")}.`
        : "";
  }

  const total = items.reduce((sum, i) => sum + i.subtotal, 0);

  if (formData.maximumBudget !== null && total > formData.maximumBudget) {
    warnings.push(
      `El total de ${formatCOP(total)} excede el presupuesto de ${formatCOP(formData.maximumBudget)}. Puedes ajustar cantidades o quitar productos.`,
    );
  }

  const sharedSelections = selections.filter((s) => s.isShared);
  const sharedPromo = items.find((i) => i.productId.startsWith("promo-"));
  const itemCount = items.length;

  let summary: string;
  if (sharedPromo) {
    summary = `Seleccionamos ${itemCount} producto${itemCount !== 1 ? "s" : ""} para ${formData.peopleCount} persona${formData.peopleCount !== 1 ? "s" : ""}, incluyendo la promoción ${sharedPromo.productName} para compartir.`;
  } else if (sharedSelections.length > 0) {
    summary = `Seleccionamos ${itemCount} producto${itemCount !== 1 ? "s" : ""} para ${formData.peopleCount} persona${formData.peopleCount !== 1 ? "s" : ""}, incluyendo ${sharedSelections[0].product.name} para compartir. Buscamos variedad y equilibrio de precios.`;
  } else {
    summary = `Seleccionamos ${itemCount} producto${itemCount !== 1 ? "s" : ""} para ${formData.peopleCount} persona${formData.peopleCount !== 1 ? "s" : ""}, priorizando variedad y relación calidad-precio.`;
  }

  const incompleteItems = items.filter((i) => !i.isValid);
  if (incompleteItems.length > 0) {
    warnings.push(
      `${incompleteItems.length} producto${incompleteItems.length !== 1 ? "s" : ""} necesita${incompleteItems.length !== 1 ? "n" : ""} que elijas presentación u opciones antes de agregarlo al carrito.`,
    );
  }

  return { summary, perItem, warnings };
}

function isPromotionActiveNow(promotion: Promotion): boolean {
  return promotion.isTodayPromotion;
}

export function buildSuggestion(
  formData: SuggestionFormData,
  products: MenuProduct[],
  promotions: Promotion[] = [],
  iteration: number = 0,
): SuggestedOrder {
  let available = products.filter((p) => p.is_available);

  if (formData.preferredCategorySlugs.length > 0) {
    const preferred = new Set(formData.preferredCategorySlugs);
    available = available.filter(
      (p) => p.category && preferred.has(p.category.slug),
    );
  }

  if (formData.exclusions.length > 0) {
    const terms = formData.exclusions.map((e) => e.toLowerCase().trim());

    available = available.filter((p) => {
      const searchableText = [
        p.name,
        p.description,
        ...(p.tags ?? []),
        p.category?.name ?? "",
        ...p.groups.flatMap((g) => [g.name, ...g.options.map((o) => o.name)]),
        ...p.additions.map((a) => a.name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return !terms.some((term) => searchableText.includes(term));
    });
  }

  if (available.length === 0) {
    throw new Error(
      "No hay productos disponibles con los filtros seleccionados.",
    );
  }

  const activePromotions = promotions.filter(isPromotionActiveNow);
  const usePromoAsShared =
    formData.hasSharedItem && activePromotions.length > 0;

  const selections = selectProducts(
    available,
    formData.peopleCount,
    formData.hasSharedItem && !usePromoAsShared,
    iteration,
  );

  const items: SuggestedOrderItem[] = selections.map((sel) =>
    buildSuggestedItem(sel.product, sel.quantity, formData.exclusions),
  );

  if (usePromoAsShared) {
    const bestPromo = [...activePromotions].sort(
      (a, b) => b.promotionPrice - a.promotionPrice,
    )[0];
    items.push(buildPromotionItem(bestPromo));
  }

  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  const budgetCheck = checkBudget(total, formData.maximumBudget);

  const incompleteItemCount = items.filter((i) => !i.isValid).length;
  const isComplete = incompleteItemCount === 0;

  const explanation = buildExplanation(items, selections, formData);

  return {
    items,
    total,
    peopleCount: formData.peopleCount,
    withinBudget: budgetCheck.withinBudget,
    budgetMargin: budgetCheck.margin,
    explanation,
    isComplete,
    incompleteItemCount,
  };
}
