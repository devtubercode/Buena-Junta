import { supabase } from "@/lib/supabase/client";
import { SUPABASE_TABLES } from "@/lib/supabase/constants";
import { throwIfSupabaseError as throwIfError } from "@/shared/errors/handle-supabase-error";
import type { CategoryInput, CategoryRow } from "@/features/admin/types/categories.types";

export async function fetchAdminCategories(): Promise<CategoryRow[]> {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.CATEGORIES)
    .select("*")
    .order("sort_order");

  throwIfError(error);

  return (data ?? []) as CategoryRow[];
}

export async function saveCategory(
  input: CategoryInput,
  id?: string,
): Promise<CategoryRow> {
  const result = id
    ? await supabase
        .from(SUPABASE_TABLES.CATEGORIES)
        .update(input)
        .eq("id", id)
        .select()
        .single()
    : await supabase
        .from(SUPABASE_TABLES.CATEGORIES)
        .insert(input)
        .select()
        .single();

  throwIfError(result.error);

  return result.data as CategoryRow;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase
    .from(SUPABASE_TABLES.CATEGORIES)
    .delete()
    .eq("id", id);

  throwIfError(error);
}
