import type { Promotion } from "@/features/home/types/promotion.types";
import type { Weekday } from "@/types/weekday";

const weekdaysByDateIndex: Weekday[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const weekdayLabels: Record<Weekday, string> = {
  sunday: "Domingo",
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
};

export function getCurrentWeekday(date = new Date()): Weekday {
  return weekdaysByDateIndex[date.getDay()];
}

export function getWeekdayLabel(weekday: Weekday) {
  return weekdayLabels[weekday];
}

export function buildActiveDaysLabel(activeDays: Weekday[]) {
  const labels = activeDays.map(getWeekdayLabel);

  return labels.length === 1 ? labels[0] : labels.join(" y ");
}

export function getPromotionsByDay(promotions: Promotion[], weekday: Weekday) {
  return promotions.filter((promotion) =>
    promotion.activeDays.includes(weekday),
  );
}

export function hasPromotionToday(promotions: Promotion[], date = new Date()) {
  return getPromotionsByDay(promotions, getCurrentWeekday(date)).length > 0;
}

export function sortPromotionsForWeekday(
  promotions: Promotion[],
  weekday: Weekday,
) {
  return [...promotions].sort((a, b) => {
    const aIsToday = a.activeDays.includes(weekday);
    const bIsToday = b.activeDays.includes(weekday);

    if (aIsToday === bIsToday) {
      return 0;
    }

    return aIsToday ? -1 : 1;
  });
}
