import { Save } from "lucide-react";
import {
  AdminField,
  adminInputClass,
} from "@/features/admin/shared/components/AdminField";
import { AdminImageField } from "@/features/admin/shared/components/AdminImageField";
import { InputField } from "@/shared/components/InputField";
import { SelectField } from "@/shared/components/SelectField";
import { TextAreaField } from "@/shared/components/TextAreaField";
import { Checkbox } from "@/shared/components/Checkbox";
import { toDatetimeLocal } from "@/features/admin/shared/utils/adminForms";
import { weekdays } from "@/features/admin/promotions/utils/promotionForms";
import { cn } from "@/shared/utils/cn";
import { SUPABASE_BUCKETS } from "@/lib/supabase/constants";
import type { PromotionFormData } from "@/features/admin/schemas/promotionSchema";
import type { CategoryRow } from "@/features/admin/types/categories.types";
import type { ProductRow } from "@/features/admin/types/products.types";
import type { PromotionRow } from "@/features/admin/types/promotions.types";
import type { UseFormReturn } from "react-hook-form";
import type { ImageUploadAction } from "@/features/admin/shared/hooks/useImageUpload";

type PromotionDetailFormProps = {
  categories: CategoryRow[];
  products: ProductRow[];
  selected: PromotionRow | null;
  form: UseFormReturn<PromotionFormData>;
  isSaving: boolean;
  imagePreviewUrl: string | null;
  imageAction: ImageUploadAction;
  onImageFileChange: (file: File | null) => void;
  onRemoveImage: () => void;
  toggleWeekday: (weekday: number) => void;
  onSubmit: (data: PromotionFormData) => Promise<void>;
};

export function PromotionDetailForm({
  categories,
  products,
  selected,
  form,
  isSaving,
  imagePreviewUrl,
  imageAction,
  onImageFileChange,
  onRemoveImage,
  toggleWeekday,
  onSubmit,
}: PromotionDetailFormProps) {
  const { setValue, watch, handleSubmit } = form;

  const watchedIsActive = watch("is_active");
  const watchedStartsAt = watch("starts_at");
  const watchedEndsAt = watch("ends_at");
  const watchedWeekdays = watch("active_weekdays");

  return (
    <form
      className="grid min-w-0 max-w-full gap-4 xl:grid-cols-[minmax(0,1fr)_420px] xl:gap-5"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div className="grid min-w-0 content-start gap-4">
        <section className="grid min-w-0 content-start gap-4 rounded-xl border border-border bg-surface p-3 shadow-elevated sm:p-5">
          <div className="border-b border-border pb-3">
            <h2 className="m-0 font-heading text-xl font-black text-foreground sm:text-2xl">
              Datos generales
            </h2>
            <p className="mt-1 text-xs font-bold text-muted-foreground">
              Información principal que se mostrará en la promoción pública.
            </p>
          </div>

          <InputField
            name="title"
            control={form.control}
            label="Título"
            placeholder="Ej: Promo del fin de semana"
            autoComplete="off"
          />

          <InputField
            name="slug"
            control={form.control}
            label="Slug"
            placeholder="Ej: promo-fin-de-semana"
            autoComplete="off"
          />

          <TextAreaField
            name="description"
            control={form.control}
            label="Descripción"
            placeholder="Descripción opcional de la promoción"
          />
        </section>

        <section className="grid min-w-0 content-start gap-4 rounded-xl border border-border bg-surface p-3 shadow-elevated sm:p-5">
          <div className="border-b border-border pb-3">
            <h2 className="m-0 font-heading text-xl font-black text-foreground sm:text-2xl">
              Vigencia
            </h2>
            <p className="mt-1 text-xs font-bold text-muted-foreground">
              Define cuándo estará visible la promoción y qué días aplica.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField label="Inicio">
              <input
                className={adminInputClass}
                type="datetime-local"
                value={toDatetimeLocal(watchedStartsAt)}
                onChange={(event) => {
                  setValue("starts_at", event.target.value, {
                    shouldValidate: true,
                  });
                }}
              />
            </AdminField>
            <AdminField label="Fin">
              <input
                className={adminInputClass}
                type="datetime-local"
                value={toDatetimeLocal(watchedEndsAt)}
                onChange={(event) => {
                  setValue("ends_at", event.target.value, {
                    shouldValidate: true,
                  });
                }}
              />
            </AdminField>
          </div>

          <AdminField label="Días activos">
            <div className="flex flex-wrap gap-2">
              {weekdays.map((weekday) => {
                const isActive = watchedWeekdays.includes(weekday.value);

                return (
                  <button
                    key={weekday.value}
                    type="button"
                    aria-pressed={isActive}
                    className={cn(
                      "min-h-10 min-w-10 rounded-full px-3 text-xs font-black transition",
                      isActive
                        ? "border border-primary bg-primary text-primary-foreground shadow-elevated"
                        : "border border-border bg-surface-muted text-muted-foreground hover:border-primary hover:text-primary",
                    )}
                    onClick={() => toggleWeekday(weekday.value)}
                  >
                    {weekday.label}
                  </button>
                );
              })}
            </div>
          </AdminField>
        </section>

        <section className="grid min-w-0 content-start gap-4 rounded-xl border border-border bg-surface p-3 shadow-elevated sm:p-5">
          <div className="border-b border-border pb-3">
            <h2 className="m-0 font-heading text-xl font-black text-foreground sm:text-2xl">
              Relaciones
            </h2>
            <p className="mt-1 text-xs font-bold text-muted-foreground">
              Vincula la promoción con una categoría o producto específico.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              name="category_id"
              control={form.control}
              label="Categoría relacionada"
              placeholder="Sin categoría"
              nullable
              options={categories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
            />
            <SelectField
              name="product_id"
              control={form.control}
              label="Producto relacionado"
              placeholder="Sin producto"
              nullable
              options={products.map((product) => ({
                value: product.id,
                label: product.name,
              }))}
            />
          </div>
        </section>

        <section className="grid min-w-0 content-start gap-4 rounded-xl border border-border bg-surface p-3 shadow-elevated sm:p-5">
          <div className="border-b border-border pb-3">
            <h2 className="m-0 font-heading text-xl font-black text-foreground sm:text-2xl">
              Términos
            </h2>
            <p className="mt-1 text-xs font-bold text-muted-foreground">
              Condiciones y restricciones que aplican a la promoción.
            </p>
          </div>

          <TextAreaField
            name="terms"
            control={form.control}
            label="Términos y condiciones"
            placeholder="Términos y condiciones de la promoción"
          />
        </section>
      </div>

      <div className="grid min-w-0 content-start gap-4">
        <section className="grid min-w-0 content-start gap-4 rounded-xl border border-border bg-surface p-3 shadow-elevated sm:p-5">
          <div className="border-b border-border pb-3">
            <h2 className="m-0 font-heading text-xl font-black text-foreground sm:text-2xl">
              Imagen y estado
            </h2>
            <p className="mt-1 text-xs font-bold text-muted-foreground">
              Visual de la promoción y visibilidad actual.
            </p>
          </div>

          <AdminImageField
            imagePreviewUrl={imagePreviewUrl}
            currentImagePath={selected?.image_path ?? null}
            imageAction={imageAction}
            onFileChange={onImageFileChange}
            onRemove={onRemoveImage}
            bucket={SUPABASE_BUCKETS.PROMOTION_IMAGES}
            label="Imagen de la promoción"
          />

          <div className="rounded-xl border border-border bg-surface-muted p-3">
            <Checkbox
              label="Promoción activa"
              description="La promoción será visible para los clientes cuando cumpla la vigencia."
              checked={watchedIsActive}
              onCheckedChange={(checked) => {
                setValue("is_active", checked, {
                  shouldValidate: true,
                });
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 disabled:opacity-60"
          >
            <Save className="size-4" />
            {isSaving ? "Guardando" : "Guardar promoción"}
          </button>
        </section>
      </div>
    </form>
  );
}
