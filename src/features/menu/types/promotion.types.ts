import type { Weekday } from "@/types/weekday";

export type MenuPromotionRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  is_active: boolean;
  active_weekdays: number[];
  starts_at: string | null;
  ends_at: string | null;
  image_path: string | null;
  promotion_price: number;
  original_price: number | null;
};

export type MenuPromotion = MenuPromotionRow & {
  activeDays: Weekday[];
  imageUrl?: string;
};
