import { z } from "zod";

const weekdaysSchema = z
  .array(z.number().int().min(0).max(6))
  .transform((value) => [...new Set(value)].sort((a, b) => a - b));

export const promotionSchema = z.object({
  title: z
    .string()
    .min(1, "El título de la promoción es obligatorio")
    .max(150, "El título no puede superar los 150 caracteres"),
  slug: z
    .string()
    .min(1, "El slug es obligatorio")
    .max(150, "El slug no puede superar los 150 caracteres")
    .regex(
      /^[a-z0-9-]+$/,
      "El slug solo puede contener letras minúsculas, números y guiones",
    ),
  description: z
    .string()
    .max(1000, "La descripción no puede superar los 1000 caracteres")
    .nullable()
    .transform((value) => (value?.trim() ? value.trim() : null)),
  category_id: z.string().nullable(),
  product_id: z.string().nullable(),
  is_active: z.boolean(),
  active_weekdays: weekdaysSchema,
  starts_at: z.string().nullable(),
  ends_at: z.string().nullable(),
  terms: z
    .string()
    .max(1000, "Los términos no pueden superar los 1000 caracteres")
    .nullable()
    .transform((value) => (value?.trim() ? value.trim() : null)),
  sort_order: z.coerce
    .number({ message: "El orden debe ser un número" })
    .int("El orden debe ser un número entero")
    .min(0, "El orden debe ser mayor o igual a 0"),
});

export type PromotionFormData = z.infer<typeof promotionSchema>;
