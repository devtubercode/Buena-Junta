import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  DatabaseQueryResult,
  MenuContext,
  MenuProduct,
  MenuPromotion,
  MenuProductGroup,
  MenuProductAddition,
  ProductRecord,
  OptionGroupRecord,
  AdditionLinkRecord,
  PromotionRecord,
  CategoryRecord,
} from "./types.ts";
import { PRODUCT_DESCRIPTION_MAXIMUM_LENGTH } from "./constants.ts";

export async function fetchAllDatabaseTables(
  supabaseAdmin: SupabaseClient,
): Promise<DatabaseQueryResult> {
  const [
    productsResult,
    groupsResult,
    additionsResult,
    promotionsResult,
    categoriesResult,
  ] = await Promise.all([
    supabaseAdmin
      .from("products")
      .select(
        `id, name, description, price, sale_price, tags,
         category:categories(name, slug),
         variants:product_variants(id, name, price, is_active)`,
      )
      .eq("is_available", true),

    supabaseAdmin
      .from("product_option_groups")
      .select(
        `id, product_id, name, is_required,
         options:product_option_values(name, is_active)`,
      )
      .eq("is_active", true),

    supabaseAdmin
      .from("product_available_additions")
      .select(
        `product_id, addition_id, addition:additions!inner(id, name, price)`,
      ),

    supabaseAdmin
      .from("promotions")
      .select(
        `slug, title, description, promotion_price, original_price, active_weekdays`,
      )
      .eq("is_active", true),

    supabaseAdmin.from("categories").select(`name, slug`),
  ]);

  if (productsResult.error) {
    throw new Error(
      `Failed to fetch products: ${String(productsResult.error)}`,
    );
  }

  return {
    products: (productsResult.data ?? []) as unknown as ProductRecord[],
    optionGroups: (groupsResult.data ?? []) as unknown as OptionGroupRecord[],
    additionLinks: (additionsResult.data ??
      []) as unknown as AdditionLinkRecord[],
    promotions: (promotionsResult.data ?? []) as unknown as PromotionRecord[],
    categories: (categoriesResult.data ?? []) as unknown as CategoryRecord[],
  };
}

const filterProductsByPreferredCategories = (
  products: ProductRecord[],
  preferredCategorySlugs: string[],
): ProductRecord[] => {
  if (preferredCategorySlugs.length === 0) return products;

  const allowedSlugs = new Set(preferredCategorySlugs);
  return products.filter(
    (product) =>
      product.category !== null && allowedSlugs.has(product.category.slug),
  );
};

const mapDatabaseRecordsToMenuProducts = (
  filteredProducts: ProductRecord[],
  optionGroups: OptionGroupRecord[],
  additionLinks: AdditionLinkRecord[],
): MenuProduct[] => {
  const productIdentifiers = new Set(
    filteredProducts.map((product) => product.id),
  );

  const groupsByProductId = new Map<string, OptionGroupRecord[]>();
  for (const groupRecord of optionGroups) {
    if (!productIdentifiers.has(groupRecord.product_id)) continue;
    const existingGroups = groupsByProductId.get(groupRecord.product_id) ?? [];
    existingGroups.push(groupRecord);
    groupsByProductId.set(groupRecord.product_id, existingGroups);
  }

  const additionsByProductId = new Map<string, AdditionLinkRecord[]>();
  for (const additionLink of additionLinks) {
    if (
      !productIdentifiers.has(additionLink.product_id) ||
      additionLink.addition === null
    ) {
      continue;
    }
    const existingAdditions =
      additionsByProductId.get(additionLink.product_id) ?? [];
    existingAdditions.push(additionLink);
    additionsByProductId.set(additionLink.product_id, existingAdditions);
  }

  return filteredProducts.map((product): MenuProduct => {
    const productGroups = groupsByProductId.get(product.id) ?? [];
    const productAdditions = additionsByProductId.get(product.id) ?? [];

    return {
      id: product.id,
      name: product.name,
      description: (product.description ?? "").slice(
        0,
        PRODUCT_DESCRIPTION_MAXIMUM_LENGTH,
      ),
      price: product.sale_price ?? product.price ?? 0,
      category: product.category?.name ?? "Sin categoría",
      tags: product.tags ?? [],
      variants: (product.variants ?? [])
        .filter((variant) => variant.is_active)
        .map((variant) => ({
          id: variant.id,
          label: variant.name,
          price: variant.price,
        })),
      groups: productGroups.map(
        (groupRecord): MenuProductGroup => ({
          name: groupRecord.name,
          required: groupRecord.is_required,
          options: groupRecord.options
            .filter((optionValue) => optionValue.is_active)
            .map((optionValue) => optionValue.name),
        }),
      ),
      additions: productAdditions.map(
        (additionLink): MenuProductAddition => ({
          id: additionLink.addition!.id,
          name: additionLink.addition!.name,
          price: additionLink.addition!.price,
        }),
      ),
    };
  });
};

const mapPromotionRecords = (
  promotionRecords: PromotionRecord[],
): MenuPromotion[] => {
  return promotionRecords.map(
    (promotion): MenuPromotion => ({
      slug: promotion.slug,
      title: promotion.title,
      promotion_price: promotion.promotion_price,
      original_price: promotion.original_price,
    }),
  );
};

const getPreferredCategoryNames = (
  categories: CategoryRecord[],
  preferredCategorySlugs: string[],
): string[] => {
  if (preferredCategorySlugs.length === 0) return [];
  const slugSet = new Set(preferredCategorySlugs);
  return categories
    .filter((category) => slugSet.has(category.slug))
    .map((category) => category.name);
};

export const fetchMenuContext = async (
  supabaseAdmin: SupabaseClient,
  preferredCategorySlugs: string[],
): Promise<{ menuContext: MenuContext; preferredCategoryNames: string[] }> => {
  const databaseData = await fetchAllDatabaseTables(supabaseAdmin);

  const filteredProducts = filterProductsByPreferredCategories(
    databaseData.products,
    preferredCategorySlugs,
  );

  if (filteredProducts.length === 0) {
    throw new Error("No products match the selected categories");
  }

  const menuProducts = mapDatabaseRecordsToMenuProducts(
    filteredProducts,
    databaseData.optionGroups,
    databaseData.additionLinks,
  );

  const menuPromotions = mapPromotionRecords(databaseData.promotions);

  const categoryNames = databaseData.categories.map(
    (category) => category.name,
  );

  const menuContext: MenuContext = {
    products: menuProducts,
    promotions: menuPromotions,
    categories: categoryNames,
  };

  const preferredCategoryNames = getPreferredCategoryNames(
    databaseData.categories,
    preferredCategorySlugs,
  );

  return { menuContext, preferredCategoryNames };
};
