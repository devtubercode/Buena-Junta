import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { appRoutes } from "@/app/routes";
import { AdminDataState } from "@/features/admin/components/AdminDataState";
import { AdminField, adminInputClass } from "@/features/admin/components/AdminField";
import { AdminDetailShell } from "@/features/admin/components/AdminDetailShell";
import { AdminImageField } from "@/features/admin/components/AdminImageField";
import { AdminNotFoundState } from "@/features/admin/components/AdminNotFoundState";
import { useAdminImageUpload } from "@/features/admin/hooks/useAdminImageUpload";
import { useAdminSaveHandler } from "@/features/admin/hooks/useAdminSaveHandler";
import { useAutoSlug } from "@/features/admin/hooks/useAutoSlug";
import { usePromotionDetailData } from "@/features/admin/hooks/usePromotionDetailData";
import {
  fromDatetimeLocal,
  normalizeAdminNullableString,
  normalizeAdminString,
  normalizeSlug,
  toDatetimeLocal,
} from "@/features/admin/utils/adminForms";
import { savePromotion } from "@/features/admin/services/admin-promotions.service";
import {
  removeStorageImage,
  uploadStorageImage,
} from "@/shared/services/storage.service";
import {
  SUPABASE_BUCKETS,
  SUPABASE_STORAGE_PATHS,
} from "@/lib/supabase/constants";
import { InputField } from "@/shared/components/InputField";
import { TextAreaField } from "@/shared/components/TextAreaField";
import { Checkbox } from "@/shared/components/Checkbox";
import {
  promotionSchema,
  type PromotionFormData,
} from "@/features/admin/schemas/promotionSchema";
import type {
  PromotionInput,
  PromotionRow,
} from "@/features/admin/types/admin.types";

const weekdays = [
  { value: 0, label: "Dom" },
  { value: 1, label: "Lun" },
  { value: 2, label: "Mar" },
  { value: 3, label: "Mié" },
  { value: 4, label: "Jue" },
  { value: 5, label: "Vie" },
  { value: 6, label: "Sáb" },
];

const defaultValues: PromotionFormData = {
  title: "",
  slug: "",
  description: null,
  category_id: null,
  product_id: null,
  is_active: true,
  active_weekdays: [],
  starts_at: null,
  ends_at: null,
  terms: null,
  sort_order: 0,
};

function toPromotionForm(promotion: PromotionRow): PromotionFormData {
  return {
    title: promotion.title,
    slug: promotion.slug,
    description: promotion.description,
    category_id: promotion.category_id,
    product_id: promotion.product_id,
    is_active: promotion.is_active,
    active_weekdays: [...promotion.active_weekdays].sort((a, b) => a - b),
    starts_at: promotion.starts_at,
    ends_at: promotion.ends_at,
    terms: promotion.terms,
    sort_order: promotion.sort_order,
  };
}

function getPromotionDetailPath(promotion: Pick<PromotionRow, "id" | "slug">) {
  return `${appRoutes.adminPromotions}/${promotion.slug}?id=${promotion.id}`;
}

export function PromotionDetailPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const promotionId = searchParams.get("id");
  const isNewPromotion = !slug || slug === "nueva";
  const {
    data: promotionDetail,
    isLoading,
    error,
    reload,
  } = usePromotionDetailData(promotionId, isNewPromotion);
  const { categories, products, promotion: selected } = promotionDetail;

  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
  } = form;

  const watchedTitle = useWatch({ control: form.control, name: "title" });
  const watchedStartsAt = useWatch({
    control: form.control,
    name: "starts_at",
  });
  const watchedEndsAt = useWatch({ control: form.control, name: "ends_at" });
  const watchedIsActive = useWatch({
    control: form.control,
    name: "is_active",
  });

  useEffect(() => {
    if (selected) {
      reset(toPromotionForm(selected));
      return;
    }

    if (isNewPromotion) {
      reset(defaultValues);
    }
  }, [selected, isNewPromotion, reset]);

  useAutoSlug({
    form,
    source: "title",
    target: "slug",
    isNew: isNewPromotion,
  });

  const {
    imageFile,
    imagePreviewUrl,
    shouldRemoveImage,
    setSelectedImageFile,
    removeImage,
    resetImageState,
  } = useAdminImageUpload();

  const { isSaving, execute: executeSave } = useAdminSaveHandler<PromotionRow>({
    successMessage: "Promoción guardada.",
    onSuccess: async (savedPromotion) => {
      resetImageState();
      await reload();
      navigate(getPromotionDetailPath(savedPromotion), { replace: true });
    },
  });

  const toggleWeekday = (weekday: number) => {
    const currentWeekdays = getValues("active_weekdays");
    const nextWeekdays = currentWeekdays.includes(weekday)
      ? currentWeekdays.filter((value) => value !== weekday)
      : [...currentWeekdays, weekday];

    setValue("active_weekdays", nextWeekdays, { shouldValidate: true });
  };

  const onSubmit = async (data: PromotionFormData) => {
    await executeSave(async () => {
      let image_path: string | null = selected?.image_path ?? null;

      if (imageFile) {
        image_path = await uploadStorageImage(
          imageFile,
          SUPABASE_BUCKETS.PROMOTION_IMAGES,
          SUPABASE_STORAGE_PATHS.PROMOTIONS,
        );
      }

      const savedPromotion = await savePromotion(
        {
          category_id: data.category_id,
          product_id: data.product_id,
          slug: normalizeSlug(data.slug),
          title: normalizeAdminString(data.title),
          description: normalizeAdminNullableString(data.description),
          is_active: data.is_active,
          active_weekdays: data.active_weekdays,
          starts_at: data.starts_at,
          ends_at: data.ends_at,
          image_path: shouldRemoveImage ? null : image_path,
          terms: normalizeAdminNullableString(data.terms),
          sort_order: data.sort_order,
        } satisfies PromotionInput,
        selected?.id,
      );

      if ((imageFile || shouldRemoveImage) && selected?.image_path) {
        await removeStorageImage(
          selected.image_path,
          SUPABASE_BUCKETS.PROMOTION_IMAGES,
        );
      }

      return savedPromotion;
    });
  };

  const state = <AdminDataState isLoading={isLoading} error={error} />;

  if (isLoading || error) {
    return state;
  }

  if (!isNewPromotion && !selected) {
    return (
      <AdminNotFoundState
        title="Promoción no encontrada"
        description="No se encontró una promoción con ese identificador."
        backTo={appRoutes.adminPromotions}
      />
    );
  }

  return (
    <AdminDetailShell
      title={selected ? selected.title : "Nueva promoción"}
      description="Gestiona la información, imagen, vigencia y relaciones de esta promoción."
      backTo={appRoutes.adminPromotions}
    >
      <form
        className="grid min-w-0 max-w-full gap-4 rounded-lg border border-border bg-surface p-3 shadow-elevated sm:p-4 xl:grid-cols-[minmax(0,1fr)_420px] xl:gap-5"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="grid min-w-0 content-start gap-4">
          <h2 className="m-0 font-heading text-2xl font-black text-foreground">
            Datos de la promoción
          </h2>

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
            form={form}
            label="Descripción"
            placeholder="Descripción opcional de la promoción"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <AdminField label="Categoría relacionada">
              <select
                className={adminInputClass}
                {...register("category_id")}
                onChange={(event) => {
                  setValue("category_id", event.target.value || null, {
                    shouldValidate: true,
                  });
                }}
              >
                <option value="">Sin categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </AdminField>
            <AdminField label="Producto relacionado">
              <select
                className={adminInputClass}
                {...register("product_id")}
                onChange={(event) => {
                  setValue("product_id", event.target.value || null, {
                    shouldValidate: true,
                  });
                }}
              >
                <option value="">Sin producto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </AdminField>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <AdminField label="Inicio">
              <input
                className={adminInputClass}
                type="datetime-local"
                value={toDatetimeLocal(watchedStartsAt)}
                onChange={(event) => {
                  setValue(
                    "starts_at",
                    fromDatetimeLocal(event.target.value),
                    { shouldValidate: true },
                  );
                }}
              />
            </AdminField>
            <AdminField label="Fin">
              <input
                className={adminInputClass}
                type="datetime-local"
                value={toDatetimeLocal(watchedEndsAt)}
                onChange={(event) => {
                  setValue(
                    "ends_at",
                    fromDatetimeLocal(event.target.value),
                    { shouldValidate: true },
                  );
                }}
              />
            </AdminField>
          </div>

          <AdminField label="Días activos">
            <div className="flex flex-wrap gap-2">
              {weekdays.map((weekday) => {
                const activeWeekdays = getValues("active_weekdays");
                const isActive = activeWeekdays.includes(weekday.value);

                return (
                  <button
                    key={weekday.value}
                    type="button"
                    className="min-h-10 rounded-full border px-3 text-xs font-black data-[active=true]:border-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=false]:border-border data-[active=false]:bg-surface-muted"
                    data-active={isActive}
                    onClick={() => toggleWeekday(weekday.value)}
                  >
                    {weekday.label}
                  </button>
                );
              })}
            </div>
          </AdminField>

          <TextAreaField
            name="terms"
            form={form}
            label="Términos"
            placeholder="Términos y condiciones de la promoción"
          />
        </div>

        <div className="grid min-w-0 content-start gap-4">
          <h2 className="m-0 font-heading text-2xl font-black text-foreground">
            Imagen y estado
          </h2>
          <AdminImageField
            imagePreviewUrl={imagePreviewUrl}
            currentImagePath={selected?.image_path ?? null}
            shouldRemoveImage={shouldRemoveImage}
            onFileChange={setSelectedImageFile}
            onRemove={removeImage}
            alt={watchedTitle || "Promoción"}
            bucket={SUPABASE_BUCKETS.PROMOTION_IMAGES}
          />

          <InputField
            name="sort_order"
            control={form.control}
            label="Orden"
            type="number"
            min={0}
            step={1}
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

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-primary-foreground disabled:opacity-60"
          >
            <Save className="size-4" />
            {isSaving ? "Guardando" : "Guardar promoción"}
          </button>
        </div>
      </form>
    </AdminDetailShell>
  );
}
