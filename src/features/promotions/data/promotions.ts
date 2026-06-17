import {
  categories,
  menuImages,
  products,
  promotions as menuPromotions,
} from "@/features/menu/data/menu";
import type { Promotion } from "@/features/promotions/types";

const categoryById = new Map(
  categories.map((category) => [category.id, category]),
);
const imageById = new Map(menuImages.map((image) => [image.id, image]));

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
      const weekdayLabel = promotion.weekdayRules
        .map((rule) => rule.label)
        .join(", ");
      const productCount = products.filter(
        (product) => product.categoryId === categoryId && product.isAvailable,
      ).length;

      return [
        {
          id: `${promotion.id}-${category.id}`,
          title: category.name,
          description: `${promotion.title} disponible ${weekdayLabel.toLowerCase()} para disfrutar ${category.name.toLowerCase()}.`,
          tag: promotion.title,
          categoryName: category.name,
          categorySlug: category.slug,
          weekdayLabel,
          productCount,
          image: image?.src ?? "",
          imageAlt: image?.alt ?? category.name,
        },
      ];
    }),
  );
