import { z } from "zod";

export const productSchema = z.object({
  category_id: z.string().min(1, "Selecciona una categoría"),
  slug: z
    .string()
    .min(1, "El slug es obligatorio")
    .max(150, "El slug no puede superar los 150 caracteres")
    .regex(
      /^[a-z0-9-]+$/,
      "El slug solo puede contener letras minúsculas, números y guiones",
    ),
  name: z
    .string()
    .min(1, "El nombre del producto es obligatorio")
    .max(150, "El nombre no puede superar los 150 caracteres"),
  description: z
    .string()
    .min(1, "La descripción es obligatoria")
    .max(1000, "La descripción no puede superar los 1000 caracteres"),
  price: z.string().regex(/^\d*$/, "El precio debe ser un número válido"),
  is_available: z.boolean(),
  tags: z.string(),
});

export type ProductFormData = z.infer<typeof productSchema>;
