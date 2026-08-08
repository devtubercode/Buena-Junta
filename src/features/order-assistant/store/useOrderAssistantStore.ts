import { create } from "zustand";
import type {
  OrderAssistantActions,
  OrderAssistantState,
  SuggestionFormData,
  SuggestedOrderDerived,
  SuggestedOrderProduct,
  SuggestedOrderPromotion,
} from "@/features/order-assistant/types/order-assistant.types";
import type { AddMenuOrderItemInput } from "@/store/menu-order/types/menu-order.types";
import { buildLineId } from "@/features/order-assistant/utils/suggestionBuilder";
import {
  deriveSuggestedOrder,
  isSuggestedProductValid,
} from "@/features/order-assistant/utils/suggestedOrderDerivation";
import { useMenuOrderStore } from "@/store/menu-order/useMenuOrderStore";
import { notify } from "@/shared/notifications/notify";

const emptyFormData: SuggestionFormData = {
  peopleCount: 1,
  maximumBudget: null,
  preferredCategorySlugs: [],
  exclusions: [],
  hasSharedItem: false,
};

type OrderAssistantStore = OrderAssistantState & OrderAssistantActions;

function rebuildSuggestion(
  current: SuggestedOrderDerived,
  patch: {
    products?: SuggestedOrderProduct[];
    promotion?: SuggestedOrderPromotion | null;
  },
): SuggestedOrderDerived {
  return deriveSuggestedOrder({
    peopleCount: current.peopleCount,
    requestedBudget: current.requestedBudget,
    products: patch.products ?? current.products,
    promotion:
      patch.promotion !== undefined ? patch.promotion : current.promotion,
    explanation: current.explanation,
  });
}

export const useOrderAssistantStore = create<OrderAssistantStore>(
  (set, get) => ({
    isOpen: false,
    step: "form",
    formData: { ...emptyFormData },
    suggestion: null,
    error: null,

    open: () => {
      set({ isOpen: true, step: "form" });
    },

    close: () => {
      set({ isOpen: false });
    },

    reset: () => {
      set({
        step: "form",
        formData: { ...emptyFormData },
        suggestion: null,
        error: null,
      });
    },

    updateFormData: (data) => {
      set((state) => ({
        formData: { ...state.formData, ...data },
      }));
    },

    setSuggestion: (suggestion) => {
      set({ suggestion });
    },

    setStep: (step) => {
      set({ step });
    },

    setError: (error) => {
      set({ error });
    },

    updateSuggestedProductQuantity: (lineId, quantity) => {
      set((state) => {
        if (!state.suggestion) return state;

        if (quantity <= 0) {
          return {
            suggestion: rebuildSuggestion(state.suggestion, {
              products: state.suggestion.products.filter(
                (product) => product.lineId !== lineId,
              ),
            }),
          };
        }

        const products = state.suggestion.products.map((product) =>
          product.lineId === lineId
            ? { ...product, quantity, subtotal: product.unitPrice * quantity }
            : product,
        );

        return {
          suggestion: rebuildSuggestion(state.suggestion, { products }),
        };
      });
    },

    updateSuggestedProductConfiguration: (lineId, output) => {
      set((state) => {
        if (!state.suggestion) return state;

        const products = state.suggestion.products.map((product) => {
          if (product.lineId !== lineId) return product;

          return {
            ...product,
            lineId: buildLineId(
              output.id,
              output.variantId,
              output.additionOptions,
              output.selectedOptions,
            ),
            productName: output.name,
            variantId: output.variantId,
            variantLabel: output.variantLabel,
            selectedOptions: output.selectedOptions,
            additionOptions: output.additionOptions,
            quantity: output.quantity,
            unitPrice: output.price,
            subtotal: output.price * output.quantity,
            configurationStatus: "complete" as const,
          } satisfies SuggestedOrderProduct;
        });

        return {
          suggestion: rebuildSuggestion(state.suggestion, { products }),
        };
      });
    },

    removeSuggestedProduct: (lineId) => {
      set((state) => {
        if (!state.suggestion) return state;

        return {
          suggestion: rebuildSuggestion(state.suggestion, {
            products: state.suggestion.products.filter(
              (product) => product.lineId !== lineId,
            ),
          }),
        };
      });
    },

    setSuggestedPromotionQuantity: (quantity) => {
      set((state) => {
        const promotion = state.suggestion?.promotion;
        if (!state.suggestion || !promotion) return state;

        if (quantity <= 0) {
          return {
            suggestion: rebuildSuggestion(state.suggestion, {
              promotion: null,
            }),
          };
        }

        return {
          suggestion: rebuildSuggestion(state.suggestion, {
            promotion: {
              ...promotion,
              quantity,
              subtotal: promotion.unitPrice * quantity,
            },
          }),
        };
      });
    },

    removeSuggestedPromotion: () => {
      set((state) => {
        if (!state.suggestion) return state;

        return {
          suggestion: rebuildSuggestion(state.suggestion, { promotion: null }),
        };
      });
    },

    addSuggestionToCart: () => {
      const { suggestion } = get();
      if (!suggestion || !suggestion.isComplete) return;

      const orderStore = useMenuOrderStore.getState();
      let count = 0;

      for (const product of suggestion.products) {
        if (!isSuggestedProductValid(product)) continue;

        const input: AddMenuOrderItemInput = {
          id: product.productId,
          name: product.variantLabel
            ? `${product.productName} (${product.variantLabel})`
            : product.productName,
          price: product.unitPrice,
          quantity: product.quantity,
          urlImage: product.urlImage,
          variantId: product.variantId,
          selectedOptions: product.selectedOptions,
          additionOptions: product.additionOptions,
        };

        orderStore.addItem(input);
        count += 1;
      }

      if (suggestion.promotion) {
        orderStore.addPromotion({
          id: suggestion.promotion.id,
          name: suggestion.promotion.title,
          price: suggestion.promotion.unitPrice,
          quantity: suggestion.promotion.quantity,
          urlImage: suggestion.promotion.urlImage,
        });
        count += 1;
      }

      notify.success(
        `Agregamos ${count} producto${count !== 1 ? "s" : ""} al pedido.`,
      );

      set({
        isOpen: false,
        step: "form",
        formData: { ...emptyFormData },
        suggestion: null,
        error: null,
      });
    },
  }),
);
