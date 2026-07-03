import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";
import { InputField } from "@/shared/components/InputField";
import { Checkbox } from "@/shared/components/Checkbox";
import { useSaveHandler } from "@/features/admin/shared/hooks/useSaveHandler";

import { saveProductOptionGroup } from "@/features/admin/products/option-groups/services/admin-product-option-groups.service";
import {
  optionGroupSchema,
  type OptionGroupFormData,
} from "@/features/admin/schemas/optionGroupSchema";
import type { ProductOptionGroupRow } from "@/features/admin/types/products.types";

interface ProductOptionGroupModalProps {
  onCloseModal: () => void;
  productId: string;
  group: ProductOptionGroupRow | null;
  onSuccessSaved: (group: ProductOptionGroupRow) => void;
}

const defaultValues: OptionGroupFormData = {
  name: "",
  is_required: true,
  is_active: true,
};

export function ProductOptionGroupModal({
  onCloseModal,
  productId,
  group,
  onSuccessSaved,
}: ProductOptionGroupModalProps) {
  const form = useForm<OptionGroupFormData>({
    resolver: zodResolver(optionGroupSchema),
    defaultValues,
    values: group ?? defaultValues,
  });

  const isNewGroup = group === null;

  const titleModal = isNewGroup ? "Nuevo grupo" : "Editar grupo";
  const descriptionModal = isNewGroup
    ? "Completa los datos para crear un nuevo grupo de opciones."
    : "Actualiza los datos del grupo de opciones.";

  const watchedIsRequired = useWatch({
    control: form.control,
    name: "is_required",
  });
  const watchedIsActive = useWatch({
    control: form.control,
    name: "is_active",
  });

  const saveHandler = useSaveHandler<ProductOptionGroupRow>({
    successMessage: "Grupo guardado correctamente",
    onSuccess: onSuccessSaved,
  });

  const onSubmit = async (data: OptionGroupFormData) => {
    await saveHandler.execute(() =>
      saveProductOptionGroup({
        input: {
          name: data.name.trim(),
          is_required: data.is_required,
          is_active: data.is_active,
        },
        productId,
        groupId: group?.id,
      }),
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
          placeholder="Ej: Salsas"
          autoComplete="off"
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Checkbox
            label="Requerido"
            description="El cliente debe elegir una opción"
            checked={watchedIsRequired}
            onCheckedChange={(checked) => {
              form.setValue("is_required", checked, {
                shouldValidate: true,
              });
            }}
          />
          <Checkbox
            label="Activo"
            description="Visible para los clientes"
            checked={watchedIsActive}
            onCheckedChange={(checked) => {
              form.setValue("is_active", checked, {
                shouldValidate: true,
              });
            }}
          />
        </div>

        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <button
            type="submit"
            disabled={saveHandler.isSaving}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 disabled:opacity-60"
          >
            <Save className="size-4" />
            {saveHandler.isSaving ? "Guardando" : "Guardar"}
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
}
