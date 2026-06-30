import type { PromotionFormData } from "@/features/admin/schemas/promotionSchema";
import type { PromotionRow } from "@/features/admin/types/promotions.types";

export const weekdays = [
  { value: 0, label: "Dom" },
  { value: 1, label: "Lun" },
  { value: 2, label: "Mar" },
  { value: 3, label: "Mié" },
  { value: 4, label: "Jue" },
  { value: 5, label: "Vie" },
  { value: 6, label: "Sáb" },
];

export const defaultPromotionValues: PromotionFormData = {
  title: "",
  slug: "",
  description: null,
  category_id: null,
  product_id: null,
  is_active: true,
  active_weekdays: [],
  starts_at: null,
  ends_at: null,
  terms: null,
};

export function toPromotionForm(promotion: PromotionRow): PromotionFormData {
  return {
    title: promotion.title,
    slug: promotion.slug,
    description: promotion.description,
    category_id: promotion.category_id,
    product_id: promotion.product_id,
    is_active: promotion.is_active,
    active_weekdays: [...promotion.active_weekdays].sort((a, b) => a - b),
    starts_at: promotion.starts_at,
    ends_at: promotion.ends_at,
    terms: promotion.terms,
  };
}
