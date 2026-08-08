import { supabase } from "@/lib/supabase/client";
import type {
  AISuggestionResponse,
  SuggestionFormData,
} from "@/features/order-assistant/types/order-assistant.types";

export const requestAssistantSuggestion = async (
  formData: SuggestionFormData,
): Promise<AISuggestionResponse> => {
  const { data, error } = await supabase.functions.invoke<AISuggestionResponse>(
    "assistant-suggest",
    {
      body: {
        peopleCount: formData.peopleCount,
        maximumBudget: formData.maximumBudget,
        preferredCategorySlugs: formData.preferredCategorySlugs,
        exclusions: formData.exclusions,
        hasSharedItem: formData.hasSharedItem,
      },
    },
  );

  if (error || !data) {
    throw new Error(
      error?.message ?? "No pudimos generar una sugerencia con IA.",
    );
  }

  return data;
};
