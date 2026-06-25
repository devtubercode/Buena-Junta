import { supabase } from "@/lib/supabase/client";
import { SUPABASE_TABLES } from "@/lib/supabase/constants";
import { throwIfSupabaseError } from "@/shared/errors/handle-supabase-error";
import type { MenuProductRow } from "@/features/menu/types/menu.types";

export type ProductAvailableAdditionRow = {
  product_id: string;
  addition_id: string;
  name: string;
  description: string | null;
  price: number;
  source: "category" | "product";
  created_at: string;
};

export async function fetchProducts(): Promise<MenuProductRow[]> {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.PRODUCTS)
    .select(
      `
        *,
        categories(*),
        product_variants(*),
        product_option_groups(
          option_groups(
            *,
            option_values(*)
          )
        )
      `,
    )
    .order("sort_order");

  throwIfSupabaseError(error);

  return (data ?? []) as MenuProductRow[];
}

export async function fetchProductAvailableAdditions(): Promise<
  ProductAvailableAdditionRow[]
> {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.PRODUCT_AVAILABLE_ADDITIONS)
    .select("*");

  throwIfSupabaseError(error);

  return (data ?? []) as ProductAvailableAdditionRow[];
}
