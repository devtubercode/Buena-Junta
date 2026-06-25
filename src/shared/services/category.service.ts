import { supabase } from "@/lib/supabase/client";
import { SUPABASE_TABLES } from "@/lib/supabase/constants";
import { throwIfSupabaseError } from "@/shared/errors/handle-supabase-error";
import type { MenuCategory } from "@/features/menu/types/menu.types";

export async function fetchCategories(): Promise<MenuCategory[]> {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.CATEGORIES)
    .select("*")
    .order("sort_order");

  throwIfSupabaseError(error);

  return (data ?? []) as MenuCategory[];
}
