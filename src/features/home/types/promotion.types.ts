import type { Weekday } from "@/types/weekday";

export type Promotion = {
  slug: string;
  title: string;
  description: string;
  activeDays: Weekday[];
  isTodayPromotion: boolean;
  dayLabel: string;
  dayShortLabel: string;
  tag: string;
  categoryName: string;
  categorySlug: string;
  image: string;
  imageAlt: string;
};
