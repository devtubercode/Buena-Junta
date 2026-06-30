import { supabase } from "@/lib/supabase/client";
import { SUPABASE_TABLES } from "@/lib/supabase/constants";
import { throwIfSupabaseError as throwIfError } from "@/shared/errors/handle-supabase-error";
import type {
  ProductVariantInput,
  ProductVariantRow,
} from "@/features/admin/types/products.types";

export async function fetchProductVariants(
  productId: string,
): Promise<ProductVariantRow[]> {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.PRODUCT_VARIANTS)
    .select("*")
    .eq("product_id", productId)
    .order("name");

  throwIfError(error);

  return (data ?? []) as unknown as ProductVariantRow[];
}

export async function saveProductVariant(
  input: ProductVariantInput,
  id?: string,
): Promise<ProductVariantRow> {
  const result = id
    ? await supabase
        .from(SUPABASE_TABLES.PRODUCT_VARIANTS)
        .update(input)
        .eq("id", id)
        .select()
        .single()
    : await supabase
        .from(SUPABASE_TABLES.PRODUCT_VARIANTS)
        .insert(input)
        .select()
        .single();

  throwIfError(result.error);

  return result.data as unknown as ProductVariantRow;
}

export async function deleteProductVariant(id: string) {
  const { error } = await supabase
    .from(SUPABASE_TABLES.PRODUCT_VARIANTS)
    .delete()
    .eq("id", id);

  throwIfError(error);
}
