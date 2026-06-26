export const SUPABASE_TABLES = {
  CATEGORIES: "categories",
  ADDITIONS: "additions",
  PRODUCTS: "products",
  PRODUCT_VARIANTS: "product_variants",
  PRODUCT_OPTION_GROUPS: "product_option_groups",
  PRODUCT_OPTION_VALUES: "product_option_values",
  PRODUCT_AVAILABLE_ADDITIONS: "product_available_additions",
  PROMOTIONS: "promotions",
} as const;

// All image aliases point to the same Supabase storage bucket.
// Folder paths (SUPABASE_STORAGE_PATHS) provide separation by resource type.
export const SUPABASE_BUCKETS = {
  MENU_IMAGES: "menu-images",
  PRODUCT_IMAGES: "menu-images",
  PROMOTION_IMAGES: "menu-images",
} as const;

export const SUPABASE_STORAGE_PATHS = {
  PRODUCTS: "products",
  PROMOTIONS: "promotions",
} as const;
