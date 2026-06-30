import type { CategoryRow } from "@/features/admin/types/categories.types";
import type { AdditionRow } from "@/features/admin/types/additions.types";

export type ProductRow = {
  id: string;
  category_id: string;
  slug: string;
  name: string;
  description: string;
  price: number | null;
  image_path: string | null;
  is_available: boolean;
  tags: string[] | null;
};

export type ProductVariantRow = {
  id: string;
  product_id: string;
  name: string;
  price: number;
  is_default: boolean;
  is_active: boolean;
};

export type ProductOptionGroupRow = {
  id: string;
  product_id: string;
  name: string;
  is_required: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductOptionValueRow = {
  id: string;
  product_option_group_id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductInput = Omit<ProductRow, "id">;
export type ProductVariantInput = Omit<ProductVariantRow, "id">;

export type ProductOptionGroupInput = Omit<
  ProductOptionGroupRow,
  "id" | "product_id" | "created_at" | "updated_at"
>;

export type ProductOptionValueInput = Omit<
  ProductOptionValueRow,
  "id" | "product_option_group_id" | "created_at" | "updated_at"
>;

export type AdminProductListRow = ProductRow & {
  categories: Pick<CategoryRow, "id" | "name"> | null;
  product_variants: ProductVariantRow[];
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
