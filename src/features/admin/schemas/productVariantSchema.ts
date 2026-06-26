import { z } from "zod";

export const productVariantSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre de la variante es obligatorio")
    .max(150, "El nombre no puede superar los 150 caracteres"),
  price: z
    .string()
    .min(1, "El precio es obligatorio")
    .regex(/^\d+$/, "El precio debe ser un número válido"),
  is_default: z.boolean(),
  is_active: z.boolean(),
  sort_order: z
    .number({ message: "El orden debe ser un número" })
    .int("El orden debe ser un número entero")
    .min(0, "El orden debe ser mayor o igual a 0"),
});

export type ProductVariantFormData = z.infer<typeof productVariantSchema>;
