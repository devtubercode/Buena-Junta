import { useEffect } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { normalizeSlug } from "@/features/admin/shared/utils/adminForms";

interface UseAutoSlugOptions<T extends FieldValues> {
  form: UseFormReturn<T>;
  source: Path<T>;
  target: Path<T>;
  isNew: boolean;
}

export function useAutoSlug<T extends FieldValues>({
  form,
  source,
  target,
  isNew,
}: UseAutoSlugOptions<T>) {
  const sourceValue = useWatch({
    control: form.control,
    name: source,
  }) as string | undefined;
  const targetValue = useWatch({
    control: form.control,
    name: target,
  }) as string | undefined;

  useEffect(() => {
    if (!isNew) {
      return;
    }

    if (sourceValue && !targetValue) {
      form.setValue(target, normalizeSlug(sourceValue) as T[typeof target], {
        shouldValidate: true,
      });
    }
  }, [form, source, target, sourceValue, targetValue, isNew]);
}
