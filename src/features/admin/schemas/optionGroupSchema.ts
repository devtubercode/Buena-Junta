import { z } from "zod";

export const optionGroupSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre del grupo es obligatorio")
    .max(150, "El nombre no puede superar los 150 caracteres"),
  is_required: z.boolean(),
  is_active: z.boolean(),
  sort_order: z
    .number({ message: "El orden debe ser un número" })
    .int("El orden debe ser un número entero")
    .min(0, "El orden debe ser mayor o igual a 0"),
});

export type OptionGroupFormData = z.infer<typeof optionGroupSchema>;
