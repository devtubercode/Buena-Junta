import type { SuggestedOrder } from "@/features/order-assistant/types/order-assistant.types";

export function canAddToCart(suggestion: SuggestedOrder): boolean {
  return suggestion.isComplete && suggestion.items.length > 0;
}

export function getIncompleteItems(suggestion: SuggestedOrder) {
  return suggestion.items.filter((item) => !item.isValid);
}
