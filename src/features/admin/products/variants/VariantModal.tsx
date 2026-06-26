import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";
import { InputField } from "@/shared/components/InputField";
import { Checkbox } from "@/shared/components/Checkbox";
import { useAdminSaveHandler } from "@/features/admin/shared/hooks/useAdminSaveHandler";
import { normalizeAdminString, parsePrice } from "@/features/admin/shared/utils/adminForms";
import { saveProductVariant } from "@/features/admin/products/services/admin-products.service";
import {
  productVariantSchema,
  type ProductVariantFormData,
} from "@/features/admin/schemas/productVariantSchema";
import type { ProductVariantRow, ProductVariantInput } from "@/features/admin/types/products.types";

interface VariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  variant: ProductVariantRow | null;
  onSaved: () => void;
}

const defaultValues: ProductVariantFormData = {
  name: "",
  price: "",
  is_default: false,
  is_active: true,
  sort_order: 0,
};

export function VariantModal({
  isOpen,
  onClose,
  productId,
  variant,
  onSaved,
}: VariantModalProps) {
  const form = useForm<ProductVariantFormData>({
    resolver: zodResolver(productVariantSchema),
    defaultValues,
  });

  const { reset, handleSubmit, setValue } = form;

  const watchedIsDefault = useWatch({
    control: form.control,
    name: "is_default",
  });
  const watchedIsActive = useWatch({
    control: form.control,
    name: "is_active",
  });

  const isNew = useMemo(() => variant === null, [variant]);

  useEffect(() => {
    if (variant) {
      reset({
        name: variant.name,
        price: String(variant.price),
        is_default: variant.is_default,
        is_active: variant.is_active,
        sort_order: variant.sort_order,
      });
    } else {
      reset(defaultValues);
    }
  }, [variant, reset, isOpen]);

  const { isSaving, execute: executeSave } =
    useAdminSaveHandler<ProductVariantRow>({
      successMessage: "Variante guardada.",
      onSuccess: () => {
        onClose();
        onSaved();
      },
    });

  const onSubmit = async (data: ProductVariantFormData) => {
    await executeSave(() =>
      saveProductVariant(
        {
          product_id: productId,
          name: normalizeAdminString(data.name),
          price: parsePrice(data.price) ?? 0,
          is_default: data.is_default,
          is_active: data.is_active,
          sort_order: data.sort_order,
        } satisfies ProductVariantInput,
        variant?.id,
      ),
    );
  };

  return (
    <ButtonSheetModal
      isOpen={isOpen}
      title={isNew ? "Nueva variante" : "Editar variante"}
      description={
        isNew
          ? "Completa los datos para crear una nueva variante."
          : "Actualiza los datos de la variante seleccionada."
      }
      contentClassName="max-w-lg"
      onClose={onClose}
    >
      <form
        className="grid gap-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <InputField
          name="name"
          control={form.control}
          label="Nombre"
          placeholder="Ej: Personal"
          autoComplete="off"
        />

        <div className="grid gap-3 min-[1500px]:grid-cols-2">
          <InputField
            name="price"
            control={form.control}
            label="Precio en pesos"
            type="number"
            min={0}
            step={1}
          />
          <InputField
            name="sort_order"
            control={form.control}
            label="Orden"
            type="number"
            min={0}
            step={1}
          />
        </div>

        <div className="grid gap-2">
          <Checkbox
            label="Default"
            checked={watchedIsDefault}
            onCheckedChange={(checked) => {
              setValue("is_default", checked, {
                shouldValidate: true,
              });
            }}
          />
          <Checkbox
            label="Activa"
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
