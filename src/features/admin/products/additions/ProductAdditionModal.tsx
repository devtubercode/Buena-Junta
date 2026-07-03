import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";
import { InputField } from "@/shared/components/InputField";
import { TextAreaField } from "@/shared/components/TextAreaField";
import { useSaveHandler } from "@/features/admin/shared/hooks/useSaveHandler";

import { saveAddition } from "@/features/admin/additions/services/admin-additions.service";
import {
  additionSchema,
  type AdditionFormData,
} from "@/features/admin/schemas/additionSchema";
import type { AdditionRow } from "@/features/admin/types/additions.types";

interface ProductAdditionModalProps {
  onCloseModal: () => void;
  productId: string;
  addition: AdditionRow | null;
  onSuccessSaved: (addition: AdditionRow) => void;
}

const defaultValues: AdditionFormData = {
  name: "",
  description: null,
  price: "",
};

const toAdditionForm = (addition: AdditionRow) => ({
  name: addition.name,
  description: addition.description,
  price: String(addition.price),
});

export const ProductAdditionModal = ({
  onCloseModal,
  productId,
  addition,
  onSuccessSaved,
}: ProductAdditionModalProps) => {
  const form = useForm<AdditionFormData>({
    resolver: zodResolver(additionSchema),
    values: addition ? toAdditionForm(addition) : defaultValues,
  });

  const isNewAddition = addition === null;
  const titleModal = isNewAddition ? "Nueva adición" : "Editar adición";
  const descriptionModal = isNewAddition
    ? "Completa los datos para crear una nueva adición."
    : "Actualiza los datos de la adición seleccionada.";

  const saveHandler = useSaveHandler<AdditionRow>({
    successMessage: "Adición guardada correctamente.",
    onSuccess: onSuccessSaved,
  });

  const onSubmit = async (data: AdditionFormData) => {
    await saveHandler.execute(() =>
      saveAddition(
        {
          name: data.name.trim(),
          description: data.description?.trim() || "",
          price: Math.max(0, Number(data.price) || 0),
          product_id: productId,
        },
        addition?.id,
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
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            name="name"
            control={form.control}
            label="Nombre"
            placeholder="Ej: Queso extra"
            autoComplete="off"
          />

          <InputField
            name="price"
            control={form.control}
            label="Precio"
            type="number"
            min={0}
            step={1}
          />
        </div>

        <TextAreaField
          name="description"
          control={form.control}
          label="Descripción"
          placeholder="Descripción opcional de la adición"
        />

        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <button
            type="submit"
            disabled={saveHandler.isSaving}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 disabled:opacity-60"
          >
            <Save className="size-4" />
            {saveHandler.isSaving ? "Guardando..." : "Guardar"}
          </button>
          <button
            type="button"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-black text-muted-foreground transition hover:border-primary hover:text-primary"
            onClick={onCloseModal}
          >
            <X className="size-4" />
            Cancelar
          </button>
        </div>
      </form>
    </ButtonSheetModal>
  );
};
