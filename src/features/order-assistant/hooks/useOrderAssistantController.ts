import { useCallback } from "react";
import { useOrderAssistantStore } from "@/features/order-assistant/store/useOrderAssistantStore";
import { requestAssistantSuggestion } from "@/features/order-assistant/services/assistantSuggestion.service";
import {
  mapSuggestedProducts,
  mapSuggestedPromotion,
  mapSuggestionExplanation,
} from "@/features/order-assistant/utils/aiSuggestionMappers";
import { deriveSuggestedOrder } from "@/features/order-assistant/utils/suggestedOrderDerivation";
import type {
  SuggestedOrderBase,
  SuggestedOrderDerived,
  SuggestionFormData,
} from "@/features/order-assistant/types/order-assistant.types";
import type { MenuProduct } from "@/features/menu/types/menu.types";
import type { Promotion } from "@/features/home/types/promotion.types";

const buildAssistantSuggestion = async (
  formData: SuggestionFormData,
  products: MenuProduct[],
  promotions: Promotion[],
): Promise<SuggestedOrderDerived> => {
  const data = await requestAssistantSuggestion(formData);

  const suggestedProducts = mapSuggestedProducts(data.items ?? [], products);
  const promotion = mapSuggestedPromotion(data.sharedPromotionId, promotions);
  const explanation = mapSuggestionExplanation(
    data,
    suggestedProducts,
    promotion,
  );

  const base: SuggestedOrderBase = {
    peopleCount: formData.peopleCount,
    requestedBudget: formData.maximumBudget,
    products: suggestedProducts,
    promotion,
    explanation,
  };

  return deriveSuggestedOrder(base);
};

export const useOrderAssistantController = (
  products: MenuProduct[],
  promotions: Promotion[],
) => {
  const formData = useOrderAssistantStore((s) => s.formData);
  const setSuggestion = useOrderAssistantStore((s) => s.setSuggestion);
  const setStep = useOrderAssistantStore((s) => s.setStep);
  const setError = useOrderAssistantStore((s) => s.setError);

  const generateSuggestion = useCallback(async () => {
    setStep("generating");
    setError(null);

    try {
      const suggestion = await buildAssistantSuggestion(
        formData,
        products,
        promotions,
      );
      setSuggestion(suggestion);
      setStep("review");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "No pudimos generar una sugerencia. Intenta de nuevo.";
      setError(message);
      setStep("error");
    }
  }, [formData, products, promotions, setSuggestion, setStep, setError]);

  return { generateSuggestion };
};
