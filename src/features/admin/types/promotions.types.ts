export type PromotionRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  is_active: boolean;
  active_weekdays: number[];
  starts_at: string | null;
  ends_at: string | null;
  image_path: string | null;
  terms: string | null;
  promotion_price: number;
  original_price: number | null;
};

export type PromotionInput = Omit<PromotionRow, "id">;

export type AdminPromotionListRow = PromotionRow;

export type AdminPromotionDetailData = {
  promotion: PromotionRow | null;
};
