export type BudgetCheck = {
  withinBudget: boolean;
  total: number;
  budget: number;
  margin: number;
  overBy: number;
};

export function checkBudget(total: number, budget: number | null): BudgetCheck {
  if (budget === null) {
    return {
      withinBudget: true,
      total,
      budget: 0,
      margin: 0,
      overBy: 0,
    };
  }

  const margin = budget - total;
  const overBy = Math.max(0, total - budget);

  return {
    withinBudget: margin >= 0,
    total,
    budget,
    margin,
    overBy,
  };
}

export function estimateMaxItemsPerProduct(
  unitPrice: number,
  budget: number,
): number {
  if (unitPrice <= 0) return 0;

  return Math.floor(budget / unitPrice);
}
