import type { Weekday } from "@/features/menu/types";

export type Promotion = {
  id: string;
  title: string;
  description: string;
  activeDays: Weekday[];
  isTodayPromotion: boolean;
  dayLabel: string;
  dayShortLabel: string;
  tag: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  image: string;
  imageAlt: string;
};
