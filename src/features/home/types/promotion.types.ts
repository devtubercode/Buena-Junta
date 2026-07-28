import type { Weekday } from "@/types/weekday";

export type Promotion = {
  id: string;
  slug: string;
  title: string;
  description: string;
  activeDays: Weekday[];
  isTodayPromotion: boolean;
  dayLabel: string;
  dayShortLabel: string;
  tag: string;
  image: string;
  imageAlt: string;
  promotionPrice: number;
  originalPrice: number | null;
};
