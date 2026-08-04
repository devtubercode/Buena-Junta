import { create } from "zustand";
import type {
  OrderAssistantActions,
  OrderAssistantState,
  SuggestionFormData,
  SuggestedOrder,
  SuggestedOrderItem,
} from "@/features/order-assistant/types/order-assistant.types";
import type { AddMenuOrderItemInput } from "@/store/menu-order/types/menu-order.types";
import { buildLineId } from "@/features/order-assistant/services/suggestionBuilder";
import { buildAISuggestion } from "@/features/order-assistant/services/aiSuggestionBuilder";
import { useMenuOrderStore } from "@/store/menu-order/useMenuOrderStore";
import { notify } from "@/shared/notifications/notify";
import { formatCOP } from "@/features/cart/utils/money";

const emptyFormData: SuggestionFormData = {
  peopleCount: 1,
  maximumBudget: null,
  preferredCategorySlugs: [],
  exclusions: [],
  hasSharedItem: false,
};

type OrderAssistantStore = OrderAssistantState & OrderAssistantActions;

export const useOrderAssistantStore = create<OrderAssistantStore>(
  (set, get) => ({
    isOpen: false,
    step: "form",
    formData: { ...emptyFormData },
    suggestion: null,
    error: null,
    regenerationCount: 0,

    open: () => {
      set({ isOpen: true, step: "form", regenerationCount: 0 });
    },

    close: () => {
      set({ isOpen: false });
    },

    updateFormData: (data) => {
      set((state) => ({
        formData: { ...state.formData, ...data },
      }));
    },

    generateSuggestion: async (
      products,
      _categories,
      promotions,
    ) => {
      const { formData, regenerationCount } = get();
      set({ step: "generating", error: null });

      try {
        const suggestion = await buildAISuggestion(
          formData,
          products,
          promotions ?? [],
        );
        set({
          suggestion,
          step: "review",
          error: null,
          regenerationCount: regenerationCount + 1,
        });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "No pudimos generar una sugerencia. Intenta de nuevo.";
        set({ error: message, step: "error" });
      }
    },

    updateItemQuantity: (lineId, quantity) => {
      set((state) => {
        if (!state.suggestion) return state;

        if (quantity <= 0) {
          const updatedItems = state.suggestion.items.filter(
            (item) => item.lineId !== lineId,
          );
          return {
            suggestion: recalculateSuggestion(state.suggestion, updatedItems),
          };
        }

        const updatedItems = state.suggestion.items.map((item) => {
          if (item.lineId !== lineId) return item;
          const subtotal = item.unitPrice * quantity;
          return { ...item, quantity, subtotal };
        });

        return {
          suggestion: recalculateSuggestion(state.suggestion, updatedItems),
        };
      });
    },

    updateItemConfiguration: (lineId, output) => {
      set((state) => {
        if (!state.suggestion) return state;

        const updatedItems = state.suggestion.items.map((item) => {
          if (item.lineId !== lineId) return item;
          const newLineId = buildLineId(
            output.id,
            output.variantId,
            output.additionOptions,
            output.selectedOptions,
          );
          return {
            ...item,
            lineId: newLineId,
            productName: output.name,
            variantId: output.variantId,
            variantLabel: output.variantLabel,
            selectedOptions: output.selectedOptions,
            additionOptions: output.additionOptions,
            quantity: output.quantity,
            unitPrice: output.price,
            subtotal: output.price * output.quantity,
            configurationStatus: "complete" as const,
            isValid: true,
          } satisfies SuggestedOrderItem;
        });

        return {
          suggestion: recalculateSuggestion(state.suggestion, updatedItems),
        };
      });
    },

    removeItem: (lineId) => {
      set((state) => {
        if (!state.suggestion) return state;

        const updatedItems = state.suggestion.items.filter(
          (item) => item.lineId !== lineId,
        );
        return {
          suggestion: recalculateSuggestion(state.suggestion, updatedItems),
        };
      });
    },

    addAllToCart: () => {
      const { suggestion } = get();
      if (!suggestion || !suggestion.isComplete) return;

      const validItems = suggestion.items.filter((item) => item.isValid);
      const orderStore = useMenuOrderStore.getState();

      for (const item of validItems) {
        const input: AddMenuOrderItemInput = {
          id: item.productId,
          name: item.variantLabel
            ? `${item.productName} (${item.variantLabel})`
            : item.productName,
          price: item.unitPrice,
          quantity: item.quantity,
          urlImage: item.urlImage,
          variantId: item.variantId,
          selectedOptions: item.selectedOptions,
          additionOptions: item.additionOptions,
        };

        orderStore.addItem(input);
      }

      notify.success(
        `Agregamos ${validItems.length} producto${validItems.length !== 1 ? "s" : ""} al pedido.`,
      );

      set({
        isOpen: false,
        step: "form",
        formData: { ...emptyFormData },
        suggestion: null,
        error: null,
        regenerationCount: 0,
      });
    },

    reset: () => {
      set({
        step: "form",
        formData: { ...emptyFormData },
        suggestion: null,
        error: null,
        regenerationCount: 0,
      });
    },
  }),
);

function recalculateSuggestion(
  prev: SuggestedOrder,
  items: SuggestedOrder["items"],
): SuggestedOrder {
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);
  const incompleteItemCount = items.filter((i) => !i.isValid).length;
  const isComplete = incompleteItemCount === 0;

  const warnings = prev.explanation.warnings.filter(
    (w) => !w.startsWith("El total de"),
  );

  if (prev.budget !== null) {
    const margin = prev.budget - total;
    if (margin < 0) {
      warnings.push(
        `El total de ${formatCOP(total)} excede el presupuesto de ${formatCOP(prev.budget)}. Puedes ajustar cantidades o quitar productos.`,
      );
    }

    return {
      ...prev,
      items,
      total,
      withinBudget: margin >= 0,
      budgetMargin: margin,
      isComplete,
      incompleteItemCount,
      explanation: { ...prev.explanation, warnings },
    };
  }

  return {
    ...prev,
    items,
    total,
    withinBudget: true,
    budgetMargin: 0,
    isComplete,
    incompleteItemCount,
    explanation: { ...prev.explanation, warnings },
  };
}
