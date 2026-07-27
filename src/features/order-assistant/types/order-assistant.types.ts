import type { ProductCustomizationOutput } from "@/shared/components/product/types";

export type SuggestionFormData = {
  peopleCount: number;
  maximumBudget: number | null;
  preferredCategorySlugs: string[];
  exclusions: string[];
  hasSharedItem: boolean;
};

export type ItemConfigurationStatus =
  | "complete"
  | "needs_variant"
  | "needs_options"
  | "needs_additions"
  | "incomplete";

export type SuggestedOrderItem = {
  lineId: string;
  productId: string;
  productName: string;
  urlImage: { src: string; alt: string } | undefined;
  variantId: string | undefined;
  variantLabel: string | undefined;
  selectedOptions: Record<string, string>;
  additionOptions: Array<{ key: string; label: string; unitPrice: number }>;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  configurationStatus: ItemConfigurationStatus;
  isValid: boolean;
};

export type SuggestedOrderExplanation = {
  summary: string;
  perItem: Record<string, string>;
  warnings: string[];
};

export type SuggestedOrder = {
  items: SuggestedOrderItem[];
  total: number;
  peopleCount: number;
  budget: number | null;
  withinBudget: boolean;
  budgetMargin: number;
  explanation: SuggestedOrderExplanation;
  isComplete: boolean;
  incompleteItemCount: number;
};

export type OrderAssistantStep = "form" | "generating" | "review" | "error";

export type OrderAssistantState = {
  isOpen: boolean;
  step: OrderAssistantStep;
  formData: SuggestionFormData;
  suggestion: SuggestedOrder | null;
  error: string | null;
  regenerationCount: number;
};

export type OrderAssistantActions = {
  open: () => void;
  close: () => void;
  updateFormData: (data: Partial<SuggestionFormData>) => void;
  generateSuggestion: (products: import("@/features/menu/types/menu.types").MenuProduct[], categories: import("@/features/menu/types/menu.types").MenuCategory[], promotions?: import("@/features/home/types/promotion.types").Promotion[]) => void;
  updateItemQuantity: (lineId: string, quantity: number) => void;
  updateItemConfiguration: (lineId: string, output: ProductCustomizationOutput) => void;
  removeItem: (lineId: string) => void;
  addAllToCart: () => void;
  reset: () => void;
};

export type UseOrderAssistantResult = OrderAssistantState & {
  actions: OrderAssistantActions;
};
