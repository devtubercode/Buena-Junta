import { supabase } from "@/lib/supabase/client";
import { SUPABASE_TABLES } from "@/lib/supabase/constants";
import { throwIfSupabaseError as throwIfError } from "@/shared/errors/handle-supabase-error";
import type {
  ProductOptionGroupInput,
  ProductOptionGroupRow,
  ProductOptionValueInput,
  ProductOptionValueRow,
} from "@/features/admin/types/products.types";

// SRP: Single Responsibility - This service only handles product-specific option groups

export async function fetchProductOptionGroups(
  productId: string,
): Promise<
  (ProductOptionGroupRow & { product_option_values: ProductOptionValueRow[] })[]
> {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.PRODUCT_OPTION_GROUPS)
    .select(
      `
      *,
      product_option_values(*)
    `,
    )
    .eq("product_id", productId)
    .order("name");

  throwIfError(error);

  return (data ?? []) as unknown as (ProductOptionGroupRow & {
    product_option_values: ProductOptionValueRow[];
  })[];
}

export async function saveProductOptionGroup(
  input: ProductOptionGroupInput,
  productId: string,
  id?: string,
) {
  const dataWithProductId = { ...input, product_id: productId };

  const result = id
    ? await supabase
        .from(SUPABASE_TABLES.PRODUCT_OPTION_GROUPS)
        .update(dataWithProductId)
        .eq("id", id)
        .select()
        .single()
    : await supabase
        .from(SUPABASE_TABLES.PRODUCT_OPTION_GROUPS)
        .insert(dataWithProductId)
        .select()
        .single();

  throwIfError(result.error);

  return result.data as unknown as ProductOptionGroupRow;
}

export async function deleteProductOptionGroup(id: string) {
  const { error } = await supabase
    .from(SUPABASE_TABLES.PRODUCT_OPTION_GROUPS)
    .delete()
    .eq("id", id);

  throwIfError(error);
}

export async function saveProductOptionValue(
  input: ProductOptionValueInput,
  groupId: string,
  id?: string,
) {
  const dataWithGroupId = { ...input, product_option_group_id: groupId };

  const result = id
    ? await supabase
        .from(SUPABASE_TABLES.PRODUCT_OPTION_VALUES as "product_option_values")
        .update(dataWithGroupId)
        .eq("id", id)
        .select()
        .single()
    : await supabase
        .from(SUPABASE_TABLES.PRODUCT_OPTION_VALUES as "product_option_values")
        .insert(dataWithGroupId)
        .select()
        .single();

  throwIfError(result.error);

  return result.data as unknown as ProductOptionValueRow;
}

export async function deleteProductOptionValue(id: string) {
  const { error } = await supabase
    .from(SUPABASE_TABLES.PRODUCT_OPTION_VALUES as "product_option_values")
    .delete()
    .eq("id", id);

  throwIfError(error);
}
