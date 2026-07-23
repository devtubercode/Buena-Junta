import { Button } from "@/shared/components/Button";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";
import { InputField } from "@/shared/components/InputField";
import { Save, X } from "lucide-react";
import type { CategoryRow } from "../../types/categories.types";
import { useSaveHandler } from "../../shared/hooks/useSaveHandler";
import { TextAreaField } from "@/shared/components/TextAreaField";
import { saveCategory } from "../services/admin-categories.service";
import {
  categorySchema,
  type CategoryFormData,
} from "../../schemas/categorySchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { normalizeSlug } from "../../shared/utils/adminForms";

type CategoryFormProps = {
  onCloseModal: () => void;
  category: CategoryRow | null;
  onSuccessSaved: (category: CategoryRow) => void;
};

const defaultValues: CategoryFormData = {
  slug: "",
  name: "",
  description: null,
};
export const CategoryForm = ({
  onCloseModal,
  category,
  onSuccessSaved,
}: CategoryFormProps) => {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    values: category ?? defaultValues,
  });

  const savedHandler = useSaveHandler<CategoryRow>({
    successMessage: "Categoría guardada correctamente.",
    onSuccess: onSuccessSaved,
  });

  const isNewCategory = category === null;
  const titleModal = isNewCategory ? "Nueva categoría" : "Editar categoría";
  const descriptionModal = isNewCategory
    ? "Completa los datos para crear una nueva categoría."
    : "Actualiza los datos de la categoría seleccionada.";

  const onSubmit = async (data: CategoryFormData) => {
    await savedHandler.execute(() =>
      saveCategory(
        {
          name: data.name.trim(),
          slug: normalizeSlug(data.slug),
          description: data.description?.trim() || null,
        },
        category?.id,
      ),
    );
  };

  return (
    <ButtonSheetModal
      isOpen={true}
      title={titleModal}
      description={descriptionModal}
      contentClassName="max-w-lg"
      onClose={onCloseModal}
    >
      <form
        className="grid gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <InputField
          name="name"
          control={form.control}
          label="Nombre"
          placeholder="Ej: Hamburguesas"
          autoComplete="off"
        />

        <InputField
          name="slug"
          control={form.control}
          label="Slug"
          placeholder="Ej: hamburguesas"
          autoComplete="off"
        />

        <TextAreaField
          name="description"
          control={form.control}
          label="Descripción"
          placeholder="Descripción opcional de la categoría"
        />

        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <Button
            type="submit"
            variant="primary"
            radius="full"
            size="lg"
            loading={savedHandler.isSaving}
            icon={<Save className="size-4" />}
          >
            {savedHandler.isSaving ? "Guardando..." : "Guardar"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            radius="full"
            size="lg"
            onClick={onCloseModal}
            icon={<X className="size-4" />}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </ButtonSheetModal>
  );
};
