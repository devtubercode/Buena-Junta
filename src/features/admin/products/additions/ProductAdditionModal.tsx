import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";
import { CurrencyField } from "@/shared/components/CurrencyField";
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

          <CurrencyField
            name="price"
            control={form.control}
            label="Precio"
            placeholder="Ej: 5.000"
          />
        </div>

        <TextAreaField
          name="description"
          control={form.control}
          label="Descripción"
          placeholder="Descripción opcional de la adición"
        />

        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <Button
            type="submit"
            variant="primary"
            radius="full"
            size="lg"
            loading={saveHandler.isSaving}
            icon={<Save className="size-4" />}
          >
            {saveHandler.isSaving ? "Guardando..." : "Guardar"}
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
