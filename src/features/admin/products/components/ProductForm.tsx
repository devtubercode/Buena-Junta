import { Save } from "lucide-react";
import { AdminImageField } from "@/features/admin/shared/components/AdminImageField";
import { InputField } from "@/shared/components/InputField";
import { SelectField } from "@/shared/components/SelectField";
import { TextAreaField } from "@/shared/components/TextAreaField";
import { Checkbox } from "@/shared/components/Checkbox";
import { cn } from "@/shared/utils/cn";
import type { CategoryRow } from "@/features/admin/types/categories.types";
import type { ProductRow } from "@/features/admin/types/products.types";

import useProductForm from "../hooks/useProductForm";

function AvailabilityBadge({ isAvailable }: { isAvailable: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-wide",
        isAvailable
          ? "border-success-border bg-success-soft text-success"
          : "border-border bg-surface-muted text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          isAvailable ? "bg-success" : "bg-muted-foreground",
        )}
        aria-hidden="true"
      />
      {isAvailable ? "Disponible" : "Oculto"}
    </span>
  );
}

type ProductFormProps = {
  categories: CategoryRow[];
  selectedProduct: ProductRow | null;
};

export const ProductForm = ({
  categories,
  selectedProduct,
}: ProductFormProps) => {
  const {
    form,
    isSaving,
    imageAction,
    watchedProductIsAvailable,
    imagePreviewUrl,
    onSubmitProduct,
    removeImage,
    setSelectedImageFile,
  } = useProductForm({
    selectedProduct: selectedProduct,
  });

  console.log("form errors:", form.formState.errors);

  return (
    <section className="grid min-w-0 content-start gap-4 rounded-xl border border-border bg-surface p-3 shadow-elevated sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-3">
        <div>
          <h2 className="m-0 font-heading text-2xl font-black text-foreground">
            Información del producto
          </h2>
          <p className="mt-1 text-xs font-bold text-muted-foreground">
            Datos principales que se muestran en el menú público.
          </p>
        </div>
        <AvailabilityBadge isAvailable={watchedProductIsAvailable} />
      </div>

      <form
        className="grid min-w-0 gap-4"
        onSubmit={form.handleSubmit(onSubmitProduct)}
      >
        <SelectField
          name="category_id"
          control={form.control}
          label="Categoría"
          placeholder="Selecciona una categoría"
          options={categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
        />

        <div className="grid gap-4 sm:grid-cols-2 items-start">
          <InputField
            name="name"
            control={form.control}
            label="Nombre"
            placeholder="Ej: Hamburguesa clásica"
            autoComplete="off"
          />

          <InputField
            name="slug"
            control={form.control}
            label="Slug"
            placeholder="Ej: hamburguesa-clasica"
            autoComplete="off"
            description="El slug es la parte de la URL que identifica al producto. Debe ser único y no contener espacios ni caracteres especiales."
          />
        </div>

        <TextAreaField
          name="description"
          control={form.control}
          label="Descripción"
          placeholder="Describe el producto"
          className="min-h-28"
        />

        <AdminImageField
          imagePreviewUrl={imagePreviewUrl}
          currentImagePath={selectedProduct?.image_path ?? null}
          imageAction={imageAction}
          onFileChange={(file) => setSelectedImageFile(file)}
          onRemove={removeImage}
        />

        <InputField
          name="price"
          control={form.control}
          label="Precio en pesos"
          type="number"
          min={0}
          step={1}
        />

        <InputField
          name="tags"
          control={form.control}
          label="Etiquetas separadas por coma"
          placeholder="Ej: picante, recomendado"
          autoComplete="off"
        />

        <Checkbox
          label="Disponible en el menú público"
          description="El producto aparecerá visible en el menú para los clientes."
          checked={watchedProductIsAvailable}
          onCheckedChange={(checked) => {
            form.setValue("is_available", checked, {
              shouldValidate: true,
            });
          }}
        />

        <div className="pt-1">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 disabled:opacity-60 sm:w-auto"
          >
            <Save className="size-4" />
            {isSaving ? "Guardando" : "Guardar producto"}
          </button>
        </div>
      </form>
    </section>
  );
};
