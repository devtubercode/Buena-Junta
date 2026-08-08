import { formatCOP } from "@/features/cart/utils/money";
import type {
  SuggestedOrderProduct,
  SuggestedOrderPromotion,
  SuggestedOrderBase,
  SuggestedOrderDerived,
} from "@/features/order-assistant/types/order-assistant.types";

const BUDGET_WARNING_PREFIX = "El total de";

export const isSuggestedProductValid = (
  product: SuggestedOrderProduct,
): boolean => product.configurationStatus === "complete";

export const calculateSuggestedOrderTotal = (
  products: SuggestedOrderProduct[],
  promotion: SuggestedOrderPromotion | null,
): number => {
  const productsTotal = products.reduce(
    (sum, product) => sum + product.subtotal,
    0,
  );
  return productsTotal + (promotion?.subtotal ?? 0);
};

const countIncompleteProducts = (products: SuggestedOrderProduct[]): number =>
  products.filter((product) => !isSuggestedProductValid(product)).length;

const resolveBudget = (total: number, requestedBudget: number | null) => {
  if (requestedBudget === null) {
    return { withinBudget: true, budgetMargin: 0 };
  }

  const budgetMargin = requestedBudget - total;
  return { withinBudget: total <= requestedBudget, budgetMargin };
};

const resolveWarnings = (
  baseWarnings: string[],
  total: number,
  requestedBudget: number | null,
): string[] => {
  const warnings = baseWarnings.filter(
    (warning) => !warning.startsWith(BUDGET_WARNING_PREFIX),
  );

  if (requestedBudget !== null && total > requestedBudget) {
    warnings.push(
      `El total de ${formatCOP(total)} excede el presupuesto de ${formatCOP(requestedBudget)}. Puedes ajustar cantidades o quitar productos.`,
    );
  }

  return warnings;
};

export const deriveSuggestedOrder = (
  base: SuggestedOrderBase,
): SuggestedOrderDerived => {
  const total = calculateSuggestedOrderTotal(base.products, base.promotion);
  const incompleteProductCount = countIncompleteProducts(base.products);
  const { withinBudget, budgetMargin } = resolveBudget(
    total,
    base.requestedBudget,
  );
  const warnings = resolveWarnings(
    base.explanation.warnings,
    total,
    base.requestedBudget,
  );

  return {
    ...base,
    total,
    withinBudget,
    budgetMargin,
    isComplete: incompleteProductCount === 0,
    incompleteProductCount,
    explanation: { ...base.explanation, warnings },
  };
};
