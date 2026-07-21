import type { Weekday } from "@/types/weekday";
import type { MenuCategory, MenuImage, MenuProductRow } from "./menu.types";

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
};

export type MenuPromotion = MenuPromotionRow & {
  activeDays: Weekday[];
  imageUrl?: string;
};

/**
 * Versión normalizada de una promoción lista para mostrar en el menú público.
 */
export type Promotion = {
  slug: string;
  title: string;
  description: string;
  activeDays: Weekday[];
  isTodayPromotion: boolean;
  dayLabel: string;
  image?: MenuImage;
  categoryName?: string;
};
