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

type saveProductOptionGroupArguments = {
  input: ProductOptionGroupInput;
  productId: string;
  groupId?: string;
};

type saveProductOptionValueArguments = {
  input: ProductOptionValueInput;
  groupId: string;
  optionValueId?: string;
};

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

export const saveProductOptionGroup = async ({
  input,
  productId,
  groupId,
}: saveProductOptionGroupArguments) => {
  const dataWithProductId = { ...input, product_id: productId };

  const result = groupId
    ? await supabase
        .from(SUPABASE_TABLES.PRODUCT_OPTION_GROUPS)
        .update(dataWithProductId)
        .eq("id", groupId)
        .select()
        .single()
    : await supabase
        .from(SUPABASE_TABLES.PRODUCT_OPTION_GROUPS)
        .insert(dataWithProductId)
        .select()
        .single();

  throwIfError(result.error);

  return result.data as unknown as ProductOptionGroupRow;
};

export const deleteProductOptionGroup = async (id: string) => {
  const { error } = await supabase
    .from(SUPABASE_TABLES.PRODUCT_OPTION_GROUPS)
    .delete()
    .eq("id", id);

  throwIfError(error);
};

export const saveProductOptionValue = async ({
  input,
  groupId,
  optionValueId,
}: saveProductOptionValueArguments) => {
  const dataWithGroupId = { ...input, product_option_group_id: groupId };

  const result = optionValueId
    ? await supabase
        .from(SUPABASE_TABLES.PRODUCT_OPTION_VALUES as "product_option_values")
        .update(dataWithGroupId)
        .eq("id", optionValueId)
        .select()
        .single()
    : await supabase
        .from(SUPABASE_TABLES.PRODUCT_OPTION_VALUES as "product_option_values")
        .insert(dataWithGroupId)
        .select()
        .single();

  throwIfError(result.error);

  return result.data as unknown as ProductOptionValueRow;
};

export async function deleteProductOptionValue(id: string) {
  const { error } = await supabase
    .from(SUPABASE_TABLES.PRODUCT_OPTION_VALUES as "product_option_values")
    .delete()
    .eq("id", id);

  throwIfError(error);
}
