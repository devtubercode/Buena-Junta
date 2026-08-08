import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  CategoryRecord,
  FetchMenuContextParams,
  MenuContext,
  MenuProduct,
  MenuPromotion,
  ProductRecord,
  PromotionRecord,
} from "./types.ts";

const fetchCategories = async (
  supabaseAdmin: SupabaseClient,
  preferredCategorySlugs: string[],
): Promise<CategoryRecord[]> => {
  const categoriesResult = await supabaseAdmin
    .from("categories")
    .select(`id, name, slug`)
    .in("slug", preferredCategorySlugs);

  if (categoriesResult.error) {
    throw new Error(
      `Failed to fetch categories: ${String(categoriesResult.error)}`,
    );
  }

  return (categoriesResult.data ?? []) as unknown as CategoryRecord[];
};

// Colombia usa UTC-5 fijo (sin horario de verano). Los filtros de la
// función deben evaluarse en hora local de Colombia, no en UTC del servidor.
const COLOMBIA_UTC_OFFSET_MS = -5 * 60 * 60 * 1000;

const getColombiaWeekday = (date = new Date()): number => {
  const colombiaTime = new Date(date.getTime() + COLOMBIA_UTC_OFFSET_MS);
  return colombiaTime.getUTCDay();
};

// Timestamp local de Colombia en ISO sin zona (compatible con el formato
// datetime-local que guarda el admin y con columnas timestamp sin timezone).
const getColombiaLocalIso = (date = new Date()): string => {
  const colombiaTime = new Date(date.getTime() + COLOMBIA_UTC_OFFSET_MS);
  return colombiaTime.toISOString().replace("Z", "");
};

const fetchProducts = async (
  supabaseAdmin: SupabaseClient,
  categoryIds: string[],
  hasExclusions: boolean,
): Promise<ProductRecord[]> => {
  const productsSelect = hasExclusions
    ? `id, name, description, price, sale_price, category:categories(name)`
    : `id, name, price, sale_price, category:categories(name)`;

  const productsResult = await supabaseAdmin
    .from("products")
    .select(productsSelect)
    .eq("is_available", true)
    .in("category_id", categoryIds);

  if (productsResult.error) {
    throw new Error(
      `Failed to fetch products: ${String(productsResult.error)}`,
    );
  }

  return (productsResult.data ?? []) as unknown as ProductRecord[];
};

const fetchPromotions = async (
  supabaseAdmin: SupabaseClient,
  hasExclusions: boolean,
  includePromotions: boolean,
): Promise<PromotionRecord[]> => {
  if (!includePromotions) {
    return [];
  }
  const currentWeekday = getColombiaWeekday();
  const nowIso = getColombiaLocalIso();

  const promotionsSelect = hasExclusions
    ? `id, title, description, promotion_price`
    : `id, title, promotion_price`;

  const promotionsResult = await supabaseAdmin
    .from("promotions")
    .select(promotionsSelect)
    .eq("is_active", true)
    .contains("active_weekdays", [currentWeekday])
    .or(`starts_at.is.null,starts_at.lte.${nowIso}`)
    .or(`ends_at.is.null,ends_at.gte.${nowIso}`);

  if (promotionsResult.error) {
    throw new Error(
      `Failed to fetch promotions: ${String(promotionsResult.error)}`,
    );
  }

  return (promotionsResult.data ?? []) as unknown as PromotionRecord[];
};

export const fetchMenuContext = async (
  params: FetchMenuContextParams,
): Promise<MenuContext> => {
  const {
    supabaseAdmin,
    preferredCategorySlugs,
    hasSharedItem,
    hasExclusions,
  } = params;

  const categoriesData = await fetchCategories(
    supabaseAdmin,
    preferredCategorySlugs,
  );

  const categoryIds = categoriesData.map((category) => category.id);

  const productsResult = await fetchProducts(
    supabaseAdmin,
    categoryIds,
    hasExclusions,
  );

  const promotionsResult = await fetchPromotions(
    supabaseAdmin,
    hasExclusions,
    hasSharedItem,
  );

  if (productsResult.length === 0) {
    throw new Error("No products match the selected categories");
  }

  const mapProducts = productsResult.map(
    (product): MenuProduct => ({
      id: product.id,
      name: product.name,
      description: product.description ?? undefined,
      price: product.sale_price ?? product.price ?? 0,
      category: product.category?.name ?? "Sin categoría",
    }),
  );

  const mapPromotions = promotionsResult.map(
    (promotion): MenuPromotion => ({
      id: promotion.id,
      title: promotion.title,
      description: promotion.description ?? "",
      promotion_price: promotion.promotion_price,
    }),
  );

  return {
    products: mapProducts,
    promotions: mapPromotions,
  };
};
