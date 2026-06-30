import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "El nombre de la categoría es obligatorio")
    .max(100, "El nombre no puede superar los 100 caracteres"),
  slug: z
    .string()
    .min(1, "El slug es obligatorio")
    .max(120, "El slug no puede superar los 120 caracteres")
    .regex(
      /^[a-z0-9-]+$/,
      "El slug solo puede contener letras minúsculas, números y guiones"
    ),
  description: z
    .string()
    .max(500, "La descripción no puede superar los 500 caracteres")
    .nullable()
    .transform((value) => (value?.trim() ? value.trim() : null)),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
