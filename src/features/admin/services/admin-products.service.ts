import { fetchAdminCategories } from "@/features/admin/services/admin-categories.service";
import { supabase } from "@/lib/supabase/client";
import { SUPABASE_TABLES } from "@/lib/supabase/constants";
import { throwIfSupabaseError as throwIfError } from "@/shared/errors/handle-supabase-error";
import type {
  AdditionRow,
  AdminProductDetailData,
  AdminProductListRow,
  OptionGroupRow,
  ProductInput,
  ProductOptionGroupRow,
  ProductRow,
  ProductVariantInput,
  ProductVariantRow,
} from "@/features/admin/types/admin.types";

type AdditionRelationRow = {
  addition_id: string;
};

export async function fetchAdminProductsList(): Promise<AdminProductListRow[]> {
  const { data, error } = await supabase
    .from(SUPABASE_TABLES.PRODUCTS)
    .select(
      `
        *,
        categories(id, name),
        product_variants(*),
        product_additions(
          additions(id, name)
        ),
        product_option_groups(
          option_groups(id, name)
        )
      `,
    )
    .order("sort_order");

  throwIfError(error);

  return (data ?? []) as unknown as AdminProductListRow[];
}

export async function fetchAdminProductDetail(
  productId: string | null,
  slug: string | undefined,
): Promise<AdminProductDetailData> {
  const [categories, additions, optionGroups, productResult] = await Promise.all([
    fetchAdminCategories(),
    supabase
      .from(SUPABASE_TABLES.ADDITIONS)
      .select("*")
      .order("name"),
    supabase
      .from(SUPABASE_TABLES.OPTION_GROUPS)
      .select("id, name, is_active, is_required, sort_order")
      .order("sort_order"),
    productId
      ? supabase
          .from(SUPABASE_TABLES.PRODUCTS)
          .select("*")
          .eq("id", productId)
          .maybeSingle()
      : slug
        ? supabase
            .from(SUPABASE_TABLES.PRODUCTS)
            .select("*")
            .eq("slug", slug)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
  ]);

  throwIfError(optionGroups.error);
  throwIfError(additions.error);
  throwIfError(productResult.error);

  const product = productResult.data as unknown as ProductRow | null;

  if (!product) {
    return {
      categories,
      product: null,
      product_variants: [],
      additions: (additions.data ?? []) as AdditionRow[],
      product_addition_ids: [],
      option_groups: (optionGroups.data ?? []) as Pick<
        OptionGroupRow,
        "id" | "name" | "is_active" | "is_required" | "sort_order"
      >[],
      product_option_group_ids: [],
    };
  }

  const [productVariants, productAdditions, productOptionGroups] = await Promise.all([
    supabase
      .from(SUPABASE_TABLES.PRODUCT_VARIANTS)
      .select("*")
      .eq("product_id", product.id)
      .order("sort_order"),
    supabase
      .from(SUPABASE_TABLES.PRODUCT_ADDITIONS)
      .select("addition_id")
      .eq("product_id", product.id)
      .order("created_at"),
    supabase
      .from(SUPABASE_TABLES.PRODUCT_OPTION_GROUPS)
      .select("option_group_id")
      .eq("product_id", product.id),
  ]);

  throwIfError(productVariants.error);
  throwIfError(productAdditions.error);
  throwIfError(productOptionGroups.error);

  return {
    categories,
    product,
    product_variants: (productVariants.data ?? []) as unknown as ProductVariantRow[],
    additions: (additions.data ?? []) as AdditionRow[],
    product_addition_ids: (productAdditions.data ?? []).map(
      (row) => (row as AdditionRelationRow).addition_id,
    ),
    option_groups: (optionGroups.data ?? []) as Pick<
      OptionGroupRow,
      "id" | "name" | "is_active" | "is_required" | "sort_order"
    >[],
    product_option_group_ids: (productOptionGroups.data ?? []).map(
      (row) => (row as ProductOptionGroupRow).option_group_id,
    ),
  };
}

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

export async function syncProductOptionGroups(
  productId: string,
  optionGroupIds: string[],
) {
  const uniqueIds = [...new Set(optionGroupIds)];

  const deleteResult = await supabase
    .from(SUPABASE_TABLES.PRODUCT_OPTION_GROUPS)
    .delete()
    .eq("product_id", productId);

  throwIfError(deleteResult.error);

  if (uniqueIds.length === 0) {
    return;
  }

  const insertResult = await supabase
    .from(SUPABASE_TABLES.PRODUCT_OPTION_GROUPS)
    .insert(
      uniqueIds.map((optionGroupId) => ({
        product_id: productId,
        option_group_id: optionGroupId,
      })),
    );

  throwIfError(insertResult.error);
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
) {
  const result = id
    ? await supabase
        .from(SUPABASE_TABLES.PRODUCT_VARIANTS)
        .update(input)
        .eq("id", id)
    : await supabase.from(SUPABASE_TABLES.PRODUCT_VARIANTS).insert(input);

  throwIfError(result.error);
}

export async function deleteProductVariant(id: string) {
  const { error } = await supabase
    .from(SUPABASE_TABLES.PRODUCT_VARIANTS)
    .delete()
    .eq("id", id);

  throwIfError(error);
}
