import { useEffect, useMemo } from "react";
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
import type {
  ProductOptionGroupInput,
  ProductOptionGroupRow,
} from "@/features/admin/types/products.types";

interface ProductOptionGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  group: ProductOptionGroupRow | null;
  onSaved?: () => void;
}

const defaultValues: OptionGroupFormData = {
  name: "",
  is_required: true,
  is_active: true,
};

export function ProductOptionGroupModal({
  isOpen,
  onClose,
  productId,
  group,
  onSaved = () => {},
}: ProductOptionGroupModalProps) {
  const form = useForm<OptionGroupFormData>({
    resolver: zodResolver(optionGroupSchema),
    defaultValues,
  });

  const { reset, handleSubmit, setValue, control } = form;
  const isNew = useMemo(() => group === null, [group]);

  const watchedIsRequired = useWatch({
    control,
    name: "is_required",
  });
  const watchedIsActive = useWatch({
    control,
    name: "is_active",
  });

  useEffect(() => {
    if (group) {
      reset({
        name: group.name,
        is_required: group.is_required,
        is_active: group.is_active,
      });
    } else {
      reset(defaultValues);
    }
  }, [group, reset, isOpen]);

  const { isSaving, execute: executeSave } =
    useSaveHandler<ProductOptionGroupRow>({
      successMessage: "Grupo guardado.",
      onSuccess: () => {
        onClose();
        onSaved();
      },
    });

  const onSubmit = async (data: OptionGroupFormData) => {
    await executeSave(() =>
      saveProductOptionGroup(
        {
          name: data.name.trim(),
          is_required: data.is_required,
          is_active: data.is_active,
        } satisfies ProductOptionGroupInput,
        productId,
        group?.id,
      ),
    );
  };

  return (
    <ButtonSheetModal
      isOpen={isOpen}
      title={isNew ? "Nuevo grupo" : "Editar grupo"}
      description={
        isNew
          ? "Completa los datos para crear un nuevo grupo de opciones."
          : "Actualiza los datos del grupo de opciones."
      }
      contentClassName="max-w-lg"
      onClose={onClose}
    >
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <InputField
          name="name"
          control={control}
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
              setValue("is_required", checked, {
                shouldValidate: true,
              });
            }}
          />
          <Checkbox
            label="Activo"
            description="Visible para los clientes"
            checked={watchedIsActive}
            onCheckedChange={(checked) => {
              setValue("is_active", checked, {
                shouldValidate: true,
              });
            }}
          />
        </div>

        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 disabled:opacity-60"
          >
            <Save className="size-4" />
            {isSaving ? "Guardando" : "Guardar"}
          </button>
          <button
            type="button"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-black text-muted-foreground transition hover:border-primary hover:text-primary"
            onClick={onClose}
          >
            <X className="size-4" />
            Cancelar
          </button>
        </div>
      </form>
    </ButtonSheetModal>
  );
}
