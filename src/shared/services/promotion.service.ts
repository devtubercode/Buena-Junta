import type { MenuPromotionRow } from "@/features/menu/types/promotion.types";
import { supabase } from "@/lib/supabase/client";
import { SUPABASE_TABLES } from "@/lib/supabase/constants";
import { throwIfSupabaseError } from "@/shared/errors/handle-supabase-error";

export const fetchPromotions = async (): Promise<MenuPromotionRow[]> => {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.PROMOTIONS)
    .select("*")
    .order("created_at");

  throwIfSupabaseError(error);

  return (data ?? []) as MenuPromotionRow[];
};
