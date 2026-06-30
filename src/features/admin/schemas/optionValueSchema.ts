import { z } from "zod";

export const optionValueSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre de la opción es obligatorio")
    .max(150, "El nombre no puede superar los 150 caracteres"),
  is_active: z.boolean(),
});

export type OptionValueFormData = z.infer<typeof optionValueSchema>;
