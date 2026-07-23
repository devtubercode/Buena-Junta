import { Save, X } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/components/Button";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";
import { InputField } from "@/shared/components/InputField";
import { Checkbox } from "@/shared/components/Checkbox";
import { useSaveHandler } from "@/features/admin/shared/hooks/useSaveHandler";

import { saveProductOptionValue } from "@/features/admin/products/option-groups/services/admin-product-option-groups.service";
import {
  optionValueSchema,
  type OptionValueFormData,
} from "@/features/admin/schemas/optionValueSchema";
import type { ProductOptionValueRow } from "@/features/admin/types/products.types";

interface ProductOptionValueModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  optionValue: ProductOptionValueRow | null;
  onSuccessSaved: (value: ProductOptionValueRow) => void;
}

const defaultValues: OptionValueFormData = {
  name: "",
  is_active: true,
};

export const ProductOptionValueModal = ({
  isOpen,
  onClose,
  groupId,
  optionValue,
  onSuccessSaved,
}: ProductOptionValueModalProps) => {
  const form = useForm<OptionValueFormData>({
    resolver: zodResolver(optionValueSchema),
    defaultValues,
    values: optionValue ?? defaultValues,
  });

  const isNew = optionValue === null;
  const titleModal = isNew ? "Nueva opción" : "Editar opción";
  const descriptionModal = isNew
    ? "Completa los datos para crear una nueva opción."
    : "Actualiza los datos de la opción seleccionada.";

  const watchedIsActive = useWatch({
    control: form.control,
    name: "is_active",
  });

  const saveHandler = useSaveHandler<ProductOptionValueRow>({
    successMessage: "Opción guardada correctamente.",
    onSuccess: onSuccessSaved,
  });

  const onSubmit = async (data: OptionValueFormData) => {
    await saveHandler.execute(() =>
      saveProductOptionValue({
        input: {
          name: data.name.trim(),
          is_active: data.is_active,
        },
        groupId,
        optionValueId: optionValue?.id,
      }),
    );
  };

  return (
    <ButtonSheetModal
      isOpen={isOpen}
      title={titleModal}
      description={descriptionModal}
      contentClassName="max-w-lg"
      onClose={onClose}
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
          placeholder="Ej: Picante"
          autoComplete="off"
        />

        <Checkbox
          label="Activa"
          description="Visible para los clientes"
          checked={watchedIsActive}
          onCheckedChange={(checked) => {
            form.setValue("is_active", checked, {
              shouldValidate: true,
            });
          }}
        />

        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <Button
            type="submit"
            variant="primary"
            radius="full"
            size="lg"
            loading={saveHandler.isSaving}
            disabled={!groupId}
            icon={<Save className="size-4" />}
          >
            {saveHandler.isSaving ? "Guardando" : "Guardar"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            radius="full"
            size="lg"
            onClick={onClose}
            icon={<X className="size-4" />}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </ButtonSheetModal>
  );
};
