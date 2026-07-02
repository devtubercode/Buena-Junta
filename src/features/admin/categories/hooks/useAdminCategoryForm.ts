import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminCrudModal } from "@/features/admin/shared/hooks/useAdminCrudModal";
import { useSaveHandler } from "@/features/admin/shared/hooks/useSaveHandler";
import { useAutoSlug } from "@/features/admin/shared/hooks/useAutoSlug";
import { normalizeSlug } from "@/features/admin/shared/utils/adminForms";
import {
  categorySchema,
  type CategoryFormData,
} from "@/features/admin/schemas/categorySchema";
import { saveCategory } from "@/features/admin/categories/services/admin-categories.service";
import type { CategoryRow } from "@/features/admin/types/categories.types";

const defaultValues: CategoryFormData = {
  slug: "",
  name: "",
  description: null,
};

type UseAdminCategoryFormResult = {
  form: UseFormReturn<CategoryFormData>;
  isSaving: boolean;
  selected: CategoryRow | null;
  isOpen: boolean;
  openNew: () => void;
  openEdit: (category: CategoryRow) => void;
  close: () => void;
  onSubmit: () => Promise<void>;
};

export function useAdminCategoryForm(
  onSaved: () => Promise<void>,
): UseAdminCategoryFormResult {
  const { selected, isOpen, openNew, openEdit, close } =
    useAdminCrudModal<CategoryRow>();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues,
  });

  const { reset, handleSubmit } = form;

  const { isSaving, execute: executeSave } = useSaveHandler<CategoryRow>({
    successMessage: "Categoría guardada.",
    onSuccess: async () => {
      close();
      reset(defaultValues);
      await onSaved();
    },
  });

  useAutoSlug({
    form,
    source: "name",
    target: "slug",
    isNew: selected === null,
  });

  const handleOpenNew = () => {
    reset(defaultValues);
    openNew();
  };

  const handleOpenEdit = (category: CategoryRow) => {
    reset({
      slug: category.slug,
      name: category.name,
      description: category.description,
    });
    openEdit(category);
  };

  const onSubmit = handleSubmit(async (data) => {
    await executeSave(() =>
      saveCategory(
        {
          ...data,
          slug: normalizeSlug(data.slug),
          description: data.description?.trim() || null,
        },
        selected?.id,
      ),
    );
  });

  return {
    form,
    isSaving,
    selected,
    isOpen,
    openNew: handleOpenNew,
    openEdit: handleOpenEdit,
    close,
    onSubmit,
  };
}
