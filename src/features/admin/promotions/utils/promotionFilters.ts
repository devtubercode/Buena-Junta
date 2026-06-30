import type { AdminPromotionListRow } from "@/features/admin/types/promotions.types";

export type PromotionStatusFilter =
  | "all"
  | "active"
  | "scheduled"
  | "expired"
  | "inactive";

export type PromotionVisualStatus =
  | "active"
  | "scheduled"
  | "expired"
  | "inactive";

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function getPromotionStatus(
  promotion: AdminPromotionListRow,
): PromotionVisualStatus {
  if (!promotion.is_active) {
    return "inactive";
  }

  const now = Date.now();

  if (promotion.starts_at && new Date(promotion.starts_at).getTime() > now) {
    return "scheduled";
  }

  if (promotion.ends_at && new Date(promotion.ends_at).getTime() < now) {
    return "expired";
  }

  return "active";
}

export function formatPromotionDate(value: string | null): string | null {
  if (!value) {
    return null;
  }

  return dateFormatter.format(new Date(value));
}
