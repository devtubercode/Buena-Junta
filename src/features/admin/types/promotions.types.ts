import type { CategoryRow } from "@/features/admin/types/categories.types";
import type { ProductRow } from "@/features/admin/types/products.types";

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

export type PromotionInput = Omit<PromotionRow, "id">;

export type AdminPromotionListRow = PromotionRow & {
  categories: Pick<CategoryRow, "id" | "name"> | null;
  products: Pick<ProductRow, "id" | "name"> | null;
};

export type AdminPromotionDetailData = {
  categories: CategoryRow[];
  products: ProductRow[];
  promotion: PromotionRow | null;
};
