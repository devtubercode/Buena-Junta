import { z } from "zod";

export const optionGroupSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre del grupo es obligatorio")
    .max(150, "El nombre no puede superar los 150 caracteres"),
  is_required: z.boolean(),
  is_active: z.boolean(),
});

export type OptionGroupFormData = z.infer<typeof optionGroupSchema>;
