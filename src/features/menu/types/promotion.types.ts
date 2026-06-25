import type { Weekday } from "@/types/weekday";
import type { MenuCategory, MenuProductRow } from "./menu.types";

export type MenuPromotionRow = {
  slug: string;
  title: string;
  description: string;
  category: MenuCategory;
  product: Pick<MenuProductRow, "id" | "slug" | "name"> | null;
  is_active: boolean;
  active_weekdays: number[];
  starts_at: string | null;
  ends_at: string | null;
  image_path: string | null;
  sort_order: number;
};

export type MenuPromotion = MenuPromotionRow & {
  activeDays: Weekday[];
  imageUrl?: string;
};
