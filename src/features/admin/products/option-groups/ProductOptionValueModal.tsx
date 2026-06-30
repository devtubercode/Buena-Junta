import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";
import { InputField } from "@/shared/components/InputField";
import { Checkbox } from "@/shared/components/Checkbox";
import { useAdminSaveHandler } from "@/features/admin/shared/hooks/useAdminSaveHandler";
import { normalizeAdminString } from "@/features/admin/shared/utils/adminForms";
import { saveProductOptionValue } from "@/features/admin/products/option-groups/services/admin-product-option-groups.service";
import {
  optionValueSchema,
  type OptionValueFormData,
} from "@/features/admin/schemas/optionValueSchema";
import type {
  ProductOptionValueInput,
  ProductOptionValueRow,
} from "@/features/admin/types/products.types";

interface ProductOptionValueModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string | null;
  value: ProductOptionValueRow | null;
  onSaved: () => void;
}

const defaultValues: OptionValueFormData = {
  name: "",
  is_active: true,
};

export function ProductOptionValueModal({
  isOpen,
  onClose,
  groupId,
  value,
  onSaved,
}: ProductOptionValueModalProps) {
  const form = useForm<OptionValueFormData>({
    resolver: zodResolver(optionValueSchema),
    defaultValues,
  });

  const { reset, handleSubmit, setValue, control } = form;
  const isNew = useMemo(() => value === null, [value]);

  const watchedIsActive = useWatch({
    control,
    name: "is_active",
  });

  useEffect(() => {
    if (value) {
      reset({
        name: value.name,
        is_active: value.is_active,
      });
    } else {
      reset(defaultValues);
    }
  }, [value, reset, isOpen]);

  const { isSaving, execute: executeSave } =
    useAdminSaveHandler<ProductOptionValueRow>({
      successMessage: "Opción guardada.",
      onSuccess: () => {
        onClose();
        onSaved();
      },
    });

  const onSubmit = async (data: OptionValueFormData) => {
    if (!groupId) {
      return;
    }

    await executeSave(() =>
      saveProductOptionValue(
        {
          name: normalizeAdminString(data.name),
          is_active: data.is_active,
        } satisfies ProductOptionValueInput,
        groupId,
        value?.id,
      ),
    );
  };

  return (
    <ButtonSheetModal
      isOpen={isOpen}
      title={isNew ? "Nueva opción" : "Editar opción"}
      description={
        isNew
          ? "Completa los datos para crear una nueva opción."
          : "Actualiza los datos de la opción seleccionada."
      }
      contentClassName="max-w-lg"
      onClose={onClose}
    >
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <InputField
          name="name"
          control={control}
          label="Nombre"
          placeholder="Ej: Picante"
          autoComplete="off"
        />

        <Checkbox
          label="Activa"
          description="Visible para los clientes"
          checked={watchedIsActive}
          onCheckedChange={(checked) => {
            setValue("is_active", checked, {
              shouldValidate: true,
            });
          }}
        />

        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <button
            type="submit"
            disabled={isSaving || !groupId}
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
