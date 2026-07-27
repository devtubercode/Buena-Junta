import { useMemo } from "react";
import { useOrderAssistantStore } from "@/features/order-assistant/store/useOrderAssistantStore";
import type { UseOrderAssistantResult } from "@/features/order-assistant/types/order-assistant.types";

export function useOrderAssistant(): UseOrderAssistantResult {
  const isOpen = useOrderAssistantStore((s) => s.isOpen);
  const step = useOrderAssistantStore((s) => s.step);
  const formData = useOrderAssistantStore((s) => s.formData);
  const suggestion = useOrderAssistantStore((s) => s.suggestion);
  const error = useOrderAssistantStore((s) => s.error);
  const regenerationCount = useOrderAssistantStore((s) => s.regenerationCount);

  const actions = useMemo(() => {
    const state = useOrderAssistantStore.getState();
    return {
      open: state.open,
      close: state.close,
      updateFormData: state.updateFormData,
      generateSuggestion: state.generateSuggestion,
      updateItemQuantity: state.updateItemQuantity,
      updateItemConfiguration: state.updateItemConfiguration,
      removeItem: state.removeItem,
      addAllToCart: state.addAllToCart,
      reset: state.reset,
    };
  }, []);

  return {
    isOpen,
    step,
    formData,
    suggestion,
    error,
    regenerationCount,
    actions,
  };
}
