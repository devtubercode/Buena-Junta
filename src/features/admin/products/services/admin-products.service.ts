import { supabase } from "@/lib/supabase/client";
import { SUPABASE_TABLES } from "@/lib/supabase/constants";
import { throwIfSupabaseError as throwIfError } from "@/shared/errors/handle-supabase-error";
import type {
  AdminProductDetailData,
  AdminProductListRow,
  ProductInput,
  ProductOptionGroupRow,
  ProductOptionValueRow,
  ProductRow,
  ProductVariantInput,
  ProductVariantRow,
} from "@/features/admin/types/products.types";

// ==========================================
// Product List
// ==========================================

export async function fetchAdminProductsList(): Promise<AdminProductListRow[]> {
  const { data: products, error } = await supabase
    .from(SUPABASE_TABLES.PRODUCTS)
    .select(
      `
        *,
        categories(id, name),
        product_variants(*)
      `,
    )
    .order("sort_order");

  throwIfError(error);

  return (products ?? []) as unknown as AdminProductListRow[];
}

// ==========================================
// Product Detail
// ==========================================

export async function fetchAdminProductDetail(
  productId: string,
): Promise<AdminProductDetailData> {
  const [product, variants, additions, optionGroups] = await Promise.all([
    fetchProductById(productId),
    fetchProductVariants(productId),
    fetchProductAdditions(productId),
    fetchProductOptionGroupsWithValues(productId),
  ]);

  return {
    product,
    product_variants: variants,
    product_additions: additions,
    product_option_groups: optionGroups,
  };
}

// ==========================================
// Data Fetchers
// ==========================================

async function fetchProductById(
  productId: string,
): Promise<ProductRow | null> {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.PRODUCTS)
    .select("*")
    .eq("id", productId)
    .maybeSingle();

  throwIfError(error);

  return data as unknown as ProductRow | null;
}

async function fetchProductVariants(
  productId: string,
): Promise<ProductVariantRow[]> {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.PRODUCT_VARIANTS)
    .select("*")
    .eq("product_id", productId)
    .order("sort_order");

  throwIfError(error);

  return (data ?? []) as unknown as ProductVariantRow[];
}

async function fetchProductAdditions(productId: string) {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.ADDITIONS)
    .select("*")
    .eq("product_id", productId)
    .order("created_at");

  throwIfError(error);

  return (data ?? []) as unknown as AdminProductDetailData["product_additions"];
}

async function fetchProductOptionGroupsWithValues(
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
    .order("sort_order");

  throwIfError(error);

  return (data ?? []) as unknown as (ProductOptionGroupRow & {
    product_option_values: ProductOptionValueRow[];
  })[];
}

// ==========================================
// Mutations
// ==========================================

export async function saveProduct(input: ProductInput, id?: string) {
  const result = id
    ? await supabase
        .from(SUPABASE_TABLES.PRODUCTS)
        .update(input)
        .eq("id", id)
        .select()
        .single()
    : await supabase
        .from(SUPABASE_TABLES.PRODUCTS)
        .insert(input)
        .select()
        .single();

  throwIfError(result.error);

  return result.data as unknown as ProductRow;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from(SUPABASE_TABLES.PRODUCTS)
    .delete()
    .eq("id", id);

  throwIfError(error);
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
