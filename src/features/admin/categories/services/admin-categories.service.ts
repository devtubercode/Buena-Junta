import { supabase } from "@/lib/supabase/client";
import { SUPABASE_TABLES } from "@/lib/supabase/constants";
import { throwIfSupabaseError as throwIfError } from "@/shared/errors/handle-supabase-error";
import type {
  CategoryInput,
  CategoryRow,
} from "@/features/admin/types/categories.types";

export const fetchAdminCategories = async (): Promise<CategoryRow[]> => {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.CATEGORIES)
    .select("*")
    .order("name");

  throwIfError(error);

  return (data ?? []) as CategoryRow[];
};

export const saveCategory = async (
  input: CategoryInput,
  categoryId?: string,
): Promise<CategoryRow> => {
  const result = categoryId
    ? await supabase
        .from(SUPABASE_TABLES.CATEGORIES)
        .update(input)
        .eq("id", categoryId)
        .select()
        .single()
    : await supabase
        .from(SUPABASE_TABLES.CATEGORIES)
        .insert(input)
        .select()
        .single();

  throwIfError(result.error);

  return result.data as CategoryRow;
};

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from(SUPABASE_TABLES.CATEGORIES)
    .delete()
    .eq("id", id);

  throwIfError(error);
}
