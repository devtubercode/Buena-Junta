export const SUPABASE_TABLES = {
  CATEGORIES: "categories",
  ADDITIONS: "additions",
  PRODUCTS: "products",
  PRODUCT_VARIANTS: "product_variants",
  PRODUCT_ADDITIONS: "product_additions",
  CATEGORY_ADDITIONS: "category_additions",
  OPTION_GROUPS: "option_groups",
  OPTION_VALUES: "option_values",
  PRODUCT_OPTION_GROUPS: "product_option_groups",
  PRODUCT_AVAILABLE_ADDITIONS: "product_available_additions",
  PROMOTIONS: "promotions",
} as const;

export const SUPABASE_BUCKETS = {
  MENU_IMAGES: "menu-images",
  PRODUCT_IMAGES: "menu-images",
  PROMOTION_IMAGES: "menu-images",
} as const;

export const SUPABASE_STORAGE_PATHS = {
  PRODUCTS: "products",
  PROMOTIONS: "promotions",
} as const;
