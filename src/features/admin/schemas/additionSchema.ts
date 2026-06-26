import { z } from "zod";

export const additionSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre de la adición es obligatorio")
    .max(100, "El nombre no puede superar los 100 caracteres"),
  description: z
    .string()
    .max(500, "La descripción no puede superar los 500 caracteres")
    .nullable()
    .transform((value) => (value?.trim() ? value.trim() : null)),
  price: z.coerce
    .number({ message: "El precio debe ser un número" })
    .int("El precio debe ser un número entero")
    .min(0, "El precio debe ser mayor o igual a 0"),
});

export type AdditionFormData = z.infer<typeof additionSchema>;
