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
  name: string;
  description: string | null;
  price: number;
  created_at: string;
  updated_at: string;
};

export type CategoryAdditionRow = {
  category_id: string;
  addition_id: string;
  created_at: string;
};

export type ProductOptionGroupRow = {
  product_id: string;
  option_group_id: string;
};

export type OptionGroupRow = {
  id: string;
  name: string;
  is_required: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  option_values: OptionValueRow[];
};

export type OptionValueRow = {
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
export type AdditionInput = Omit<AdditionRow, "id" | "created_at" | "updated_at">;
export type CategoryAdditionInput = Omit<CategoryAdditionRow, "created_at">;
export type OptionGroupInput = Omit<
  OptionGroupRow,
  "id" | "created_at" | "updated_at" | "option_values"
>;
export type OptionValueInput = Omit<
  OptionValueRow,
  "id" | "created_at" | "updated_at"
>;
export type PromotionInput = Omit<PromotionRow, "id">;

export type AdminProductListRow = ProductRow & {
  categories: Pick<CategoryRow, "id" | "name"> | null;
  product_variants: ProductVariantRow[];
  product_additions: {
    additions: Pick<AdditionRow, "id" | "name">;
  }[];
  product_option_groups: {
    option_groups: Pick<OptionGroupRow, "id" | "name">;
  }[];
};

export type AdminProductDetailData = {
  categories: CategoryRow[];
  product: ProductRow | null;
  product_variants: ProductVariantRow[];
  additions: AdditionRow[];
  product_addition_ids: string[];
  option_groups: Pick<
    OptionGroupRow,
    "id" | "name" | "is_active" | "sort_order" | "is_required"
  >[];
  product_option_group_ids: string[];
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

export type AdminOptionGroupsData = {
  option_groups: OptionGroupRow[];
};

export type AdminAdditionsData = {
  additions: AdditionRow[];
};

export type AdminOptionsData = {
  products: ProductRow[];
  option_groups: OptionGroupRow[];
  option_values: OptionValueRow[];
};

export type AdminDashboardData = {
  productsCount: number;
  categoriesCount: number;
  promotionsCount: number;
  optionGroupsCount: number;
};
