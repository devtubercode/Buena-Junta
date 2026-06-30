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
});

export type ProductVariantFormData = z.infer<typeof productVariantSchema>;
