import {
  categories,
  menuImages,
  promotions as menuPromotions,
} from "@/features/menu/data/menu";
import type { Promotion } from "@/features/home/components/promotions/types";
import {
  buildActiveDaysLabel,
  getCurrentWeekday,
  getWeekdayLabel,
} from "@/features/home/components/promotions/promotionSchedule";

const categoryById = new Map(
  categories.map((category) => [category.id, category]),
);
const imageById = new Map(menuImages.map((image) => [image.id, image]));
const today = getCurrentWeekday();

export const promotions: Promotion[] = menuPromotions
  .filter((promotion) => promotion.active)
  .flatMap((promotion) =>
    promotion.categoryIds.flatMap((categoryId) => {
      const category = categoryById.get(categoryId);

      if (!category) {
        return [];
      }

      const image = category.defaultImageIds
        .map((imageId) => imageById.get(imageId))
        .find(Boolean);
      const dayLabel = buildActiveDaysLabel(promotion.activeDays);
      const isTodayPromotion = promotion.activeDays.includes(today);

      return [
        {
          id: `${promotion.id}-${category.id}`,
          title: promotion.title,
          description:
            promotion.description ??
            `Disfruta una promo especial de ${category.name.toLowerCase()}.`,
          activeDays: promotion.activeDays,
          isTodayPromotion,
          dayLabel,
          dayShortLabel: getWeekdayLabel(promotion.activeDays[0]).slice(0, 3),
          tag: isTodayPromotion ? "Hoy" : `Promoción del ${dayLabel.toLowerCase()}`,
          categoryId: category.id,
          categoryName: category.name,
          categorySlug: category.slug,
          image: image?.src ?? "",
          imageAlt: image?.alt ?? category.name,
        },
      ];
    }),
  );
