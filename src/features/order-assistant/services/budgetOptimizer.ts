import type { SuggestedOrder } from "@/features/order-assistant/types/order-assistant.types";
import { checkBudget } from "@/domain/ordering/budget";

export function optimizeForBudget(
  suggestion: SuggestedOrder,
): SuggestedOrder {
  const budget = suggestion.peopleCount > 0 ? suggestion.budgetMargin + suggestion.total : null;

  if (budget === null) return suggestion;

  let current = { ...suggestion, items: [...suggestion.items] };
  const budgetCheck = checkBudget(current.total, budget);

  if (budgetCheck.withinBudget) {
    return current;
  }

  const sortedByImpact = [...current.items]
    .map((item, idx) => ({ item, idx, unitImpact: item.unitPrice }))
    .sort((a, b) => b.unitImpact - a.unitImpact);

  for (const entry of sortedByImpact) {
    if (current.items.length <= 1) break;

    current = {
      ...current,
      items: current.items.filter((_, i) => i !== entry.idx),
    };

    const newTotal = current.items.reduce((sum, i) => sum + i.subtotal, 0);
    const newCheck = checkBudget(newTotal, budget);

    if (newCheck.withinBudget) {
      const incompleteCount = current.items.filter((i) => !i.isValid).length;

      return {
        ...current,
        total: newTotal,
        withinBudget: true,
        budgetMargin: newCheck.margin,
        explanation: {
          ...current.explanation,
          warnings: [
            ...current.explanation.warnings,
            `Eliminamos ${entry.item.productName} para ajustarnos al presupuesto.`,
          ],
        },
        isComplete: incompleteCount === 0,
        incompleteItemCount: incompleteCount,
      };
    }
  }

  return current;
}
