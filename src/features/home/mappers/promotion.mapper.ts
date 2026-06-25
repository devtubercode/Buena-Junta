import type { Promotion } from "@/features/home/types/promotion.types";
import { SUPABASE_BUCKETS } from "@/lib/supabase/constants";
import { getStorageImageUrl } from "@/shared/services/storage.service";

import {
  buildActiveDaysLabel,
  getCurrentWeekday,
  getWeekdayLabel,
} from "../utils";
import type { MenuPromotionRow } from "@/features/menu/types/promotion.types";
import type { Weekday } from "@/types/weekday";

const weekdaysByIndex = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

const mapWeekdays = (activeWeekdays: number[]): Weekday[] => {
  return activeWeekdays
    .map((weekday) => weekdaysByIndex[weekday])
    .filter((weekday): weekday is Weekday => Boolean(weekday));
};

export function buildPromotions(promotions: MenuPromotionRow[]): Promotion[] {
  const today = getCurrentWeekday();

  const activePromotions = promotions.filter(
    (promotion) => promotion.is_active,
  );

  return activePromotions.map((promotion) => {
    const category = promotion.category;
    const imagePath = promotion.image_path;
    const activeDays = mapWeekdays(promotion.active_weekdays);
    const dayLabel = buildActiveDaysLabel(activeDays);
    const isTodayPromotion = activeDays.includes(today);
    const urlImg = imagePath
      ? getStorageImageUrl(imagePath, SUPABASE_BUCKETS.MENU_IMAGES)
      : "";

    return {
      slug: `${promotion.slug}-${category.slug}`,
      title: promotion.title,
      description: promotion.description,
      activeDays,
      isTodayPromotion,
      dayLabel,
      dayShortLabel: getWeekdayLabel(activeDays[0]).slice(0, 3),
      tag: isTodayPromotion ? "Hoy" : `Promoción del ${dayLabel.toLowerCase()}`,
      categoryName: category.name,
      categorySlug: category.slug,
      image: urlImg,
      imageAlt: category.name,
    };
  });
}
