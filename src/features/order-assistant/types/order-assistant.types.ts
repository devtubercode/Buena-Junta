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

export type OrderAssistantStep = "form" | "generating" | "review" | "error";

export type OrderAssistantState = {
  isOpen: boolean;
  step: OrderAssistantStep;
  formData: SuggestionFormData;
  suggestion: SuggestedOrderDerived | null;
  error: string | null;
};

export type OrderAssistantActions = {
  open: () => void;
  close: () => void;
  reset: () => void;
  updateFormData: (data: Partial<SuggestionFormData>) => void;
  setSuggestion: (suggestion: SuggestedOrderDerived | null) => void;
  setStep: (step: OrderAssistantStep) => void;
  setError: (error: string | null) => void;
  updateSuggestedProductQuantity: (lineId: string, quantity: number) => void;
  updateSuggestedProductConfiguration: (
    lineId: string,
    output: ProductCustomizationOutput,
  ) => void;
  removeSuggestedProduct: (lineId: string) => void;
  setSuggestedPromotionQuantity: (quantity: number) => void;
  removeSuggestedPromotion: () => void;
  addSuggestionToCart: () => void;
};

export type UseOrderAssistantResult = OrderAssistantState & {
  actions: OrderAssistantActions;
};

/* -------------------------------------------------------------------------- */
/* Bloque A - modelo derivado                                                  */
/* Tipos nuevos para el refactor: separan productos vs promoción y derivan     */
/* métricas (total, presupuesto, completitud) en lugar de persistirlas.        */
/* -------------------------------------------------------------------------- */

export type SuggestedOrderProduct = {
  lineId: string;
  productId: string;
  productName: string;
  urlImage?: { src: string; alt: string };
  variantId?: string;
  variantLabel?: string;
  selectedOptions: Record<string, string>;
  additionOptions: Array<{ key: string; label: string; unitPrice: number }>;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  configurationStatus: ItemConfigurationStatus;
};

export type SuggestedOrderPromotion = {
  id: string;
  title: string;
  urlImage?: { src: string; alt: string };
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type SuggestedOrderExplanationDerived = {
  summary: string;
  perProduct: Record<string, string>;
  promotion?: string;
  warnings: string[];
};

export type SuggestedOrderBase = {
  peopleCount: number;
  requestedBudget: number | null;
  products: SuggestedOrderProduct[];
  promotion: SuggestedOrderPromotion | null;
  explanation: SuggestedOrderExplanationDerived;
};

export type SuggestedOrderComputed = {
  total: number;
  withinBudget: boolean;
  budgetMargin: number;
  isComplete: boolean;
  incompleteProductCount: number;
};

export type SuggestedOrderDerived = SuggestedOrderBase & SuggestedOrderComputed;

/* -------------------------------------------------------------------------- */
/* Contrato con la edge function assistant-suggest                             */
/* -------------------------------------------------------------------------- */

export type AISuggestionItem = {
  productId: string;
  quantity: number;
};

export type AISuggestionResponse = {
  items: AISuggestionItem[];
  sharedPromotionId: string | null;
  explanation: {
    summary: string;
    itemReasons: Record<string, string>;
  };
};
