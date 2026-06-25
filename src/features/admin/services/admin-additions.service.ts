import { supabase } from "@/lib/supabase/client";
import { SUPABASE_TABLES } from "@/lib/supabase/constants";
import { throwIfSupabaseError as throwIfError } from "@/shared/errors/handle-supabase-error";
import type {
  AdditionInput,
  AdditionRow,
  AdminAdditionsData,
} from "@/features/admin/types/admin.types";

type AdditionRelationRow = {
  addition_id: string;
};

export async function fetchAdminAdditions(): Promise<AdminAdditionsData> {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.ADDITIONS)
    .select("*")
    .order("created_at");

  throwIfError(error);

  return {
    additions: (data ?? []) as AdditionRow[],
  };
}

export async function saveAddition(input: AdditionInput, id?: string) {
  const result = id
    ? await supabase
        .from(SUPABASE_TABLES.ADDITIONS)
        .update(input)
        .eq("id", id)
        .select()
        .single()
    : await supabase
        .from(SUPABASE_TABLES.ADDITIONS)
        .insert(input)
        .select()
        .single();

  throwIfError(result.error);

  return result.data as unknown as AdditionRow;
}

export async function deleteAddition(id: string) {
  const { error } = await supabase
    .from(SUPABASE_TABLES.ADDITIONS)
    .delete()
    .eq("id", id);

  throwIfError(error);
}

export async function fetchCategoryAdditionIds(categoryId: string) {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.CATEGORY_ADDITIONS)
    .select("addition_id")
    .eq("category_id", categoryId);

  throwIfError(error);

  return (data ?? []).map((row) => (row as AdditionRelationRow).addition_id);
}

export async function syncCategoryAdditions(
  categoryId: string,
  additionIds: string[],
) {
  const uniqueIds = [...new Set(additionIds)];

  const deleteResult = await supabase
    .from(SUPABASE_TABLES.CATEGORY_ADDITIONS)
    .delete()
    .eq("category_id", categoryId);

  throwIfError(deleteResult.error);

  if (uniqueIds.length === 0) {
    return;
  }

  const insertResult = await supabase
    .from(SUPABASE_TABLES.CATEGORY_ADDITIONS)
    .insert(
      uniqueIds.map((additionId) => ({
        category_id: categoryId,
        addition_id: additionId,
      })),
    );

  throwIfError(insertResult.error);
}

export async function fetchProductAdditionIds(productId: string) {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.PRODUCT_ADDITIONS)
    .select("addition_id")
    .eq("product_id", productId);

  throwIfError(error);

  return (data ?? []).map((row) => (row as AdditionRelationRow).addition_id);
}

export async function syncProductAdditions(productId: string, additionIds: string[]) {
  const uniqueIds = [...new Set(additionIds)];

  const deleteResult = await supabase
    .from(SUPABASE_TABLES.PRODUCT_ADDITIONS)
    .delete()
    .eq("product_id", productId);

  throwIfError(deleteResult.error);

  if (uniqueIds.length === 0) {
    return;
  }

  const insertResult = await supabase
    .from(SUPABASE_TABLES.PRODUCT_ADDITIONS)
    .insert(
      uniqueIds.map((additionId) => ({
        product_id: productId,
        addition_id: additionId,
      })),
    );

  throwIfError(insertResult.error);
}
