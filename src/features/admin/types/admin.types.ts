export type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type ProductRow = {
  id: string;
  category_id: string;
  slug: string;
  name: string;
  description: string;
  price: number | null;
  image_path: string | null;
  is_available: boolean;
  sort_order: number;
  tags: string[] | null;
};

export type ProductVariantRow = {
  id: string;
  product_id: string;
  name: string;
  price: number;
  is_default: boolean;
  is_active: boolean;
  sort_order: number;
};

export type AdditionRow = {
  id: string;
  product_id: string | null;
  name: string;
  description: string | null;
  price: number;
  created_at: string;
  updated_at: string;
};

// NEW: Product-specific option groups (replaces global option_groups)
export type ProductOptionGroupRow = {
  id: string;
  product_id: string;
  name: string;
  is_required: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

// NEW: Product-specific option values (replaces global option_values)
export type ProductOptionValueRow = {
  id: string;
  product_option_group_id: string;
  name: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

// DEPRECATED: Global option groups (to be removed)
export type LegacyOptionGroupRow = {
  id: string;
  name: string;
  is_required: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  option_values: LegacyOptionValueRow[];
};

// DEPRECATED: Global option values (to be removed)
export type LegacyOptionValueRow = {
  id: string;
  option_group_id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type PromotionRow = {
  id: string;
  category_id: string | null;
  product_id: string | null;
  slug: string;
  title: string;
  description: string | null;
  is_active: boolean;
  active_weekdays: number[];
  starts_at: string | null;
  ends_at: string | null;
  image_path: string | null;
  terms: string | null;
  sort_order: number;
};

export type CategoryInput = Omit<CategoryRow, "id">;
export type ProductInput = Omit<ProductRow, "id">;
export type ProductVariantInput = Omit<ProductVariantRow, "id">;
export type AdditionInput = {
  product_id?: string | null;
  name: string;
  description: string | null;
  price: number;
};
// NEW: Input types for product-specific option groups
export type ProductOptionGroupInput = Omit<
  ProductOptionGroupRow,
  "id" | "product_id" | "created_at" | "updated_at"
>;

export type ProductOptionValueInput = Omit<
  ProductOptionValueRow,
  "id" | "product_option_group_id" | "created_at" | "updated_at"
>;

// DEPRECATED: Legacy input types (to be removed)
export type LegacyOptionGroupInput = Omit<
  LegacyOptionGroupRow,
  "id" | "created_at" | "updated_at" | "option_values"
>;
export type LegacyOptionValueInput = Omit<
  LegacyOptionValueRow,
  "id" | "created_at" | "updated_at"
>;

export type PromotionInput = Omit<PromotionRow, "id">;

export type AdminProductListRow = ProductRow & {
  categories: Pick<CategoryRow, "id" | "name"> | null;
  product_variants: ProductVariantRow[];
  // NEW: Product-specific option groups
  product_option_groups: ProductOptionGroupRow[];
};

export type AdminProductDetailData = {
  product: ProductRow | null;
  product_variants: ProductVariantRow[];
  product_additions: AdditionRow[];
  product_option_groups: (ProductOptionGroupRow & {
    product_option_values: ProductOptionValueRow[];
  })[];
};

export type AdminPromotionListRow = PromotionRow & {
  categories: Pick<CategoryRow, "id" | "name"> | null;
  products: Pick<ProductRow, "id" | "name"> | null;
};

export type AdminPromotionDetailData = {
  categories: CategoryRow[];
  products: ProductRow[];
  promotion: PromotionRow | null;
};

// DEPRECATED: Legacy option groups data (to be removed)
export type AdminOptionGroupsData = {
  option_groups: LegacyOptionGroupRow[];
};

export type AdminAdditionsData = {
  additions: AdditionRow[];
};

// DEPRECATED: Legacy options data (to be removed)
export type AdminOptionsData = {
  products: ProductRow[];
  option_groups: LegacyOptionGroupRow[];
  option_values: LegacyOptionValueRow[];
};

export type AdminDashboardData = {
  productsCount: number;
  categoriesCount: number;
  promotionsCount: number;
  optionGroupsCount: number;
};
