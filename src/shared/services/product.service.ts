import { supabase } from "@/lib/supabase/client";
import { SUPABASE_TABLES } from "@/lib/supabase/constants";
import { throwIfSupabaseError } from "@/shared/errors/handle-supabase-error";
import type { AdditionRow } from "@/features/admin/types/additions.types";
import type {
  OptionGroup,
  MenuProductRow,
} from "@/features/menu/types/menu.types";

export type FetchProductsResult = {
  products: MenuProductRow[];
  optionGroups: OptionGroup[];
  availableAdditions: AdditionRow[];
};

export const fetchProducts = async (): Promise<FetchProductsResult> => {
  const { data: products, error: productsError } = await supabase
    .from(SUPABASE_TABLES.PRODUCTS)
    .select(
      `
        *,
        category:categories(*),
        variants:product_variants(*)
      `,
    )
    .order("name");

  throwIfSupabaseError(productsError);

  const productIds = products!.map((product: MenuProductRow) => product.id);
  const [optionGroups, availableAdditions] = await Promise.all([
    fetchProductOptionGroups(productIds),
    fetchProductAvailableAdditions(productIds),
  ]);

  return {
    products: products as MenuProductRow[],
    optionGroups,
    availableAdditions,
  };
};

export const fetchProductOptionGroups = async (
  productIds: string[],
): Promise<OptionGroup[]> => {
  if (productIds.length === 0) {
    return [];
  }

  const { data: optionGroups, error: optionGroupsError } = await supabase
    .from(SUPABASE_TABLES.PRODUCT_OPTION_GROUPS)
    .select(
      `
      *,
      options:product_option_values(*)
    `,
    )
    .in("product_id", productIds)
    .eq("is_active", true)
    .order("name");

  throwIfSupabaseError(optionGroupsError);

  return (optionGroups ?? []) as OptionGroup[];
};

export const fetchProductAvailableAdditions = async (
  productIds: string[],
): Promise<AdditionRow[]> => {
  if (productIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from(SUPABASE_TABLES.PRODUCT_AVAILABLE_ADDITIONS)
    .select("*")
    .in("product_id", productIds);

  throwIfSupabaseError(error);

  return (data ?? []) as AdditionRow[];
};
