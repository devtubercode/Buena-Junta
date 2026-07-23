import { supabase } from "@/lib/supabase/client";
import { SUPABASE_TABLES } from "@/lib/supabase/constants";
import { throwIfSupabaseError as throwIfError } from "@/shared/errors/handle-supabase-error";
import type {
  AdminPromotionDetailData,
  AdminPromotionListRow,
  PromotionInput,
  PromotionRow,
} from "@/features/admin/types/promotions.types";

export const fetchAdminPromotionsList = async (): Promise<
  AdminPromotionListRow[]
> => {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.PROMOTIONS)
    .select("*")
    .order("title");

  throwIfError(error);

  return (data ?? []) as unknown as AdminPromotionListRow[];
};

export const fetchAdminPromotionDetail = async (
  promotionSlug?: string,
): Promise<AdminPromotionDetailData> => {
  const promotionResult = promotionSlug
    ? await supabase
        .from(SUPABASE_TABLES.PROMOTIONS)
        .select("*")
        .eq("slug", promotionSlug)
        .maybeSingle()
    : { data: null, error: null };

  throwIfError(promotionResult.error);

  return {
    promotion: promotionResult.data as unknown as PromotionRow | null,
  };
};

export const savePromotion = async (
  input: PromotionInput,
  promotionId?: string,
): Promise<PromotionRow> => {
  const result = promotionId
    ? await supabase
        .from(SUPABASE_TABLES.PROMOTIONS)
        .update(input)
        .eq("id", promotionId)
        .select()
        .single()
    : await supabase
        .from(SUPABASE_TABLES.PROMOTIONS)
        .insert(input)
        .select()
        .single();

  throwIfError(result.error);

  return result.data as unknown as PromotionRow;
};

export const deletePromotion = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from(SUPABASE_TABLES.PROMOTIONS)
    .delete()
    .eq("id", id);

  throwIfError(error);
};
