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
  // Fetch products with basic relations
  const { data: products, error: productsError } = await supabase
    .from(SUPABASE_TABLES.PRODUCTS)
    .select(
      `
        *,
        categories(*),
        product_variants(*)
      `,
    )
    .order("sort_order");

  throwIfSupabaseError(productsError);

  if (!products || products.length === 0) {
    return [];
  }

  // Fetch option groups for all products in a single query
  const productIds = products.map((p: Record<string, unknown>) => p.id as string);
  const { data: optionGroups, error: optionGroupsError } = await supabase
    .from(SUPABASE_TABLES.PRODUCT_OPTION_GROUPS)
    .select(`
      *,
      product_option_values(*)
    `)
    .in("product_id", productIds)
    .order("sort_order");

  throwIfSupabaseError(optionGroupsError);

  // Group option groups by product_id
  const optionGroupsByProduct = new Map<string, unknown[]>();
  for (const group of (optionGroups ?? [])) {
    const productId = (group as Record<string, unknown>).product_id as string;
    if (!optionGroupsByProduct.has(productId)) {
      optionGroupsByProduct.set(productId, []);
    }
    optionGroupsByProduct.get(productId)!.push(group);
  }

  // Combine products with their option groups
  const productsWithGroups = (products ?? []).map((product: Record<string, unknown>) => ({
    ...product,
    product_option_groups: optionGroupsByProduct.get(product.id as string) ?? [],
  }));

  return productsWithGroups as MenuProductRow[];
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
