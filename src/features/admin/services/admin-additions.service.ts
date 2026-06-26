import { supabase } from "@/lib/supabase/client";
import { SUPABASE_TABLES } from "@/lib/supabase/constants";
import { throwIfSupabaseError as throwIfError } from "@/shared/errors/handle-supabase-error";
import type {
  AdditionInput,
  AdditionRow,
  AdminAdditionsData,
} from "@/features/admin/types/admin.types";

export async function fetchAdminAdditions(): Promise<AdminAdditionsData> {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.ADDITIONS)
    .select("*")
    .is("product_id", null)
    .order("created_at");

  throwIfError(error);

  return {
    additions: (data ?? []) as AdditionRow[],
  };
}

export async function fetchProductAdditions(
  productId: string,
): Promise<AdditionRow[]> {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.ADDITIONS)
    .select("*")
    .eq("product_id", productId)
    .order("created_at");

  throwIfError(error);

  return (data ?? []) as AdditionRow[];
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
