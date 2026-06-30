import { Save } from "lucide-react";
import {
  AdminField,
  adminInputClass,
} from "@/features/admin/shared/components/AdminField";
import { AdminImageField } from "@/features/admin/shared/components/AdminImageField";
import { InputField } from "@/shared/components/InputField";
import { Checkbox } from "@/shared/components/Checkbox";
import { cn } from "@/shared/utils/cn";
import type { CategoryRow } from "@/features/admin/types/categories.types";
import type { ProductRow } from "@/features/admin/types/products.types";
import type { ProductFormData } from "@/features/admin/schemas/productSchema";
import type {
  Control,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

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

type ProductBaseFormProps = {
  categories: CategoryRow[];
  selected: ProductRow | null;
  control: Control<ProductFormData>;
  register: UseFormRegister<ProductFormData>;
  handleSubmit: UseFormHandleSubmit<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
  watchedName: string;
  watchedIsAvailable: boolean;
  isSaving: boolean;
  imagePreviewUrl: string | null;
  shouldRemoveImage: boolean;
  onImageFileChange: (file: File | null) => void;
  onRemoveImage: () => void;
  onSubmit: (data: ProductFormData) => void;
};

export function ProductBaseForm({
  categories,
  selected,
  control,
  register,
  handleSubmit,
  setValue,
  watchedName,
  watchedIsAvailable,
  isSaving,
  imagePreviewUrl,
  shouldRemoveImage,
  onImageFileChange,
  onRemoveImage,
  onSubmit,
}: ProductBaseFormProps) {
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
        <AvailabilityBadge isAvailable={watchedIsAvailable} />
      </div>

      <form
        className="grid min-w-0 gap-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <AdminField label="Categoría">
          <select
            className={adminInputClass}
            {...register("category_id")}
            onChange={(event) => {
              setValue("category_id", event.target.value, {
                shouldValidate: true,
              });
            }}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </AdminField>

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            name="name"
            control={control}
            label="Nombre"
            placeholder="Ej: Hamburguesa clásica"
            autoComplete="off"
          />

          <InputField
            name="slug"
            control={control}
            label="Slug"
            placeholder="Ej: hamburguesa-clasica"
            autoComplete="off"
          />
        </div>

        <AdminField label="Descripción">
          <textarea
            {...register("description")}
            placeholder="Describe el producto"
            className="min-h-28 w-full min-w-0 resize-none rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-foreground outline-none transition placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-primary/25"
          />
        </AdminField>

        <AdminImageField
          imagePreviewUrl={imagePreviewUrl}
          currentImagePath={selected?.image_path ?? null}
          shouldRemoveImage={shouldRemoveImage}
          onFileChange={onImageFileChange}
          onRemove={onRemoveImage}
          alt={watchedName || "Producto"}
        />

        <InputField
          name="price"
          control={control}
          label="Precio en pesos"
          type="number"
          min={0}
          step={1}
        />

        <InputField
          name="tags"
          control={control}
          label="Etiquetas separadas por coma"
          placeholder="Ej: picante, recomendado"
          autoComplete="off"
        />

        <Checkbox
          label="Disponible en el menú público"
          description="El producto aparecerá visible en el menú para los clientes."
          checked={watchedIsAvailable}
          onCheckedChange={(checked) => {
            setValue("is_available", checked, {
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
}
