import { Save, X } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Checkbox } from "@/shared/components/Checkbox";
import { CurrencyField } from "@/shared/components/CurrencyField";
import { InputField } from "@/shared/components/InputField";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";

import { parsePrice } from "@/features/admin/shared/utils/adminForms";
import { useSaveHandler } from "@/features/admin/shared/hooks/useSaveHandler";
import { saveProductVariant } from "@/features/admin/products/variants/services/admin-product-variants.service";

import {
  productVariantSchema,
  type ProductVariantFormData,
} from "@/features/admin/schemas/productVariantSchema";
import type { ProductVariantRow } from "@/features/admin/types/products.types";

interface VariantModalProps {
  onCloseModal: () => void;
  productId: string;
  variant: ProductVariantRow | null;
  onSuccessSaved: (addition: ProductVariantRow) => void;
}

const defaultValues: ProductVariantFormData = {
  name: "",
  price: "",
  is_default: false,
  is_active: true,
};

const toVariantForm = (variant: ProductVariantRow) => ({
  name: variant.name,
  price: String(Math.round(Number(variant.price))),
  is_default: variant.is_default,
  is_active: variant.is_active,
});

export const VariantModal = ({
  onCloseModal,
  productId,
  variant,
  onSuccessSaved,
}: VariantModalProps) => {
  const form = useForm<ProductVariantFormData>({
    resolver: zodResolver(productVariantSchema),
    defaultValues,
    values: variant ? toVariantForm(variant) : defaultValues,
  });

  const watchedIsDefault = useWatch({
    control: form.control,
    name: "is_default",
  });
  const watchedIsActive = useWatch({
    control: form.control,
    name: "is_active",
  });

  const isNewVariant = variant === null;
  const titleModal = isNewVariant ? "Nueva variante" : "Editar variante";
  const descriptionModal = isNewVariant
    ? "Completa los datos para crear una nueva variante."
    : "Actualiza los datos de la variante seleccionada.";

  const savedHandler = useSaveHandler<ProductVariantRow>({
    successMessage: "Variante guardada correctamente.",
    onSuccess: onSuccessSaved,
  });

  const onSubmit = async (data: ProductVariantFormData) => {
    await savedHandler.execute(() =>
      saveProductVariant(
        {
          name: data.name.trim(),
          price: parsePrice(data.price) ?? 0,
          product_id: productId,
          is_default: data.is_default,
          is_active: data.is_active,
        },
        variant?.id,
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
          placeholder="Ej: Personal"
          autoComplete="off"
        />

        <CurrencyField
          name="price"
          control={form.control}
          label="Precio en pesos"
          placeholder="Ej: 12.500"
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Checkbox
            label="Default"
            description="Se selecciona por defecto"
            checked={watchedIsDefault}
            onCheckedChange={(checked) => {
              form.setValue("is_default", checked, {
                shouldValidate: true,
              });
            }}
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
        </div>

        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <button
            type="submit"
            disabled={savedHandler.isSaving}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 disabled:opacity-60"
          >
            <Save className="size-4" />
            {savedHandler.isSaving ? "Guardando..." : "Guardar"}
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
