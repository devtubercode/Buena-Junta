import type { MenuPromotionRow } from "@/features/menu/types/promotion.types";
import { supabase } from "@/lib/supabase/client";
import { SUPABASE_TABLES } from "@/lib/supabase/constants";
import { throwIfSupabaseError } from "@/shared/errors/handle-supabase-error";

export const fetchPromotions = async (): Promise<MenuPromotionRow[]> => {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.PROMOTIONS)
    .select(
      `
        *,
        category:categories(*),
        product:products(id, slug, name)
      `,
    )
    .order("sort_order");

  throwIfSupabaseError(error);

  return data ?? [];
};
