import { useOrderAssistantStore } from "@/features/order-assistant/store/useOrderAssistantStore";
import type { UseOrderAssistantResult } from "@/features/order-assistant/types/order-assistant.types";

export function useOrderAssistant(): UseOrderAssistantResult {
  const isOpen = useOrderAssistantStore((s) => s.isOpen);
  const step = useOrderAssistantStore((s) => s.step);
  const formData = useOrderAssistantStore((s) => s.formData);
  const suggestion = useOrderAssistantStore((s) => s.suggestion);
  const error = useOrderAssistantStore((s) => s.error);
  const open = useOrderAssistantStore((s) => s.open);
  const close = useOrderAssistantStore((s) => s.close);
  const reset = useOrderAssistantStore((s) => s.reset);
  const updateFormData = useOrderAssistantStore((s) => s.updateFormData);
  const setSuggestion = useOrderAssistantStore((s) => s.setSuggestion);
  const setStep = useOrderAssistantStore((s) => s.setStep);
  const setError = useOrderAssistantStore((s) => s.setError);
  const updateSuggestedProductQuantity = useOrderAssistantStore(
    (s) => s.updateSuggestedProductQuantity,
  );
  const updateSuggestedProductConfiguration = useOrderAssistantStore(
    (s) => s.updateSuggestedProductConfiguration,
  );
  const removeSuggestedProduct = useOrderAssistantStore(
    (s) => s.removeSuggestedProduct,
  );
  const setSuggestedPromotionQuantity = useOrderAssistantStore(
    (s) => s.setSuggestedPromotionQuantity,
  );
  const removeSuggestedPromotion = useOrderAssistantStore(
    (s) => s.removeSuggestedPromotion,
  );
  const addSuggestionToCart = useOrderAssistantStore(
    (s) => s.addSuggestionToCart,
  );

  return {
    isOpen,
    step,
    formData,
    suggestion,
    error,
    actions: {
      open,
      close,
      reset,
      updateFormData,
      setSuggestion,
      setStep,
      setError,
      updateSuggestedProductQuantity,
      updateSuggestedProductConfiguration,
      removeSuggestedProduct,
      setSuggestedPromotionQuantity,
      removeSuggestedPromotion,
      addSuggestionToCart,
    },
  };
}
