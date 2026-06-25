import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ImagePlus,
  Save,
  Trash2,
} from "lucide-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { appRoutes } from "@/app/routes";
import { AdminDataState } from "@/features/admin/components/AdminDataState";
import { AdminField, adminInputClass } from "@/features/admin/components/AdminField";
import { AdminSection } from "@/features/admin/components/AdminSection";
import { usePromotionDetailData } from "@/features/admin/hooks/usePromotionDetailData";
import {
  fromDatetimeLocal,
  normalizeSlug,
  toDatetimeLocal,
} from "@/features/admin/utils/adminForms";
import { notify } from "@/shared/notifications/notify";
import { savePromotion } from "@/features/admin/services/admin-promotions.service";
import {
  getStorageImageUrl,
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
  } = usePromotionDetailData(promotionId, slug, isNewPromotion);
  const { categories, products, promotion: selected } = promotionDetail;

  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
  } = form;

  const titleValue = watch("title");

  useEffect(() => {
    if (selected) {
      reset(toPromotionForm(selected));
      return;
    }

    if (isNewPromotion) {
      reset(defaultValues);
    }
  }, [selected, isNewPromotion, reset]);

  useEffect(() => {
    if (selected) {
      return;
    }

    const slugValue = getValues("slug");

    if (titleValue && !slugValue) {
      setValue("slug", normalizeSlug(titleValue), { shouldValidate: true });
    }
  }, [titleValue, selected, getValues, setValue]);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [shouldRemoveImage, setShouldRemoveImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(
    () => () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    },
    [imagePreviewUrl],
  );

  const setSelectedImageFile = (file: File | null) => {
    setImagePreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      return file ? URL.createObjectURL(file) : null;
    });
    setImageFile(file);
  };

  const displayImagePath = selected?.image_path ?? null;

  const toggleWeekday = (weekday: number) => {
    const currentWeekdays = getValues("active_weekdays");
    const nextWeekdays = currentWeekdays.includes(weekday)
      ? currentWeekdays.filter((value) => value !== weekday)
      : [...currentWeekdays, weekday];

    setValue("active_weekdays", nextWeekdays, { shouldValidate: true });
  };

  const onSubmit = async (data: PromotionFormData) => {
    setIsSaving(true);

    try {
      let image_path: string | null = displayImagePath;

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
          title: data.title.trim(),
          description: data.description?.trim() || null,
          is_active: data.is_active,
          active_weekdays: [...data.active_weekdays].sort((a, b) => a - b),
          starts_at: data.starts_at,
          ends_at: data.ends_at,
          image_path: shouldRemoveImage ? null : image_path?.trim() || null,
          terms: data.terms?.trim() || null,
          sort_order: Number(data.sort_order) || 0,
        } satisfies PromotionInput,
        selected?.id,
      );

      if ((imageFile || shouldRemoveImage) && selected?.image_path) {
        await removeStorageImage(
          selected.image_path,
          SUPABASE_BUCKETS.PROMOTION_IMAGES,
        );
      }

      notify.success("Promoción guardada.");
      setSelectedImageFile(null);
      setShouldRemoveImage(false);
      await reload();
      navigate(getPromotionDetailPath(savedPromotion), { replace: true });
    } catch (submitError) {
      notify.error(
        submitError instanceof Error ? submitError.message : String(submitError),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const state = <AdminDataState isLoading={isLoading} error={error} />;

  if (isLoading || error) {
    return state;
  }

  if (!isNewPromotion && !selected) {
    return (
      <AdminSection
        title="Promoción no encontrada"
        actions={
          <Link
            to={appRoutes.adminPromotions}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface-muted px-4 text-sm font-black text-foreground"
          >
            <ArrowLeft className="size-4" />
            Volver
          </Link>
        }
      >
        <p className="m-0 rounded-lg border border-border bg-surface p-4 text-sm font-bold text-muted-foreground">
          No se encontró una promoción con ese identificador.
        </p>
      </AdminSection>
    );
  }

  return (
    <AdminSection
      title={selected ? selected.title : "Nueva promoción"}
      description="Gestiona la información, imagen, vigencia y relaciones de esta promoción."
      actions={
        <Link
          to={appRoutes.adminPromotions}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-surface-muted px-3 text-sm font-black text-foreground sm:min-h-11 sm:px-4"
        >
          <ArrowLeft className="size-4" />
          Volver
        </Link>
      }
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
            <InputField
              name="starts_at"
              control={form.control}
              label="Inicio"
              type="datetime-local"
              defaultValue={toDatetimeLocal(watch("starts_at"))}
              onChange={(event) => {
                setValue(
                  "starts_at",
                  fromDatetimeLocal(event.target.value),
                  { shouldValidate: true },
                );
              }}
            />
            <InputField
              name="ends_at"
              control={form.control}
              label="Fin"
              type="datetime-local"
              defaultValue={toDatetimeLocal(watch("ends_at"))}
              onChange={(event) => {
                setValue(
                  "ends_at",
                  fromDatetimeLocal(event.target.value),
                  { shouldValidate: true },
                );
              }}
            />
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
          <AdminField label="Imagen">
            <input
              className={adminInputClass}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event) => {
                setSelectedImageFile(event.target.files?.[0] ?? null);
                setShouldRemoveImage(false);
              }}
            />
          </AdminField>
          {(imagePreviewUrl || displayImagePath) && !shouldRemoveImage ? (
            <div className="grid gap-2 rounded-lg border border-border bg-surface-muted p-3">
              <img
                src={
                  imagePreviewUrl ??
                  (displayImagePath
                    ? getStorageImageUrl(
                        displayImagePath,
                        SUPABASE_BUCKETS.PROMOTION_IMAGES,
                      )
                    : "")
                }
                alt={watch("title") || "Promoción"}
                className="aspect-video rounded-md object-cover"
              />
              <button
                type="button"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-error-border bg-error-soft px-4 text-xs font-black text-error"
                onClick={() => {
                  setShouldRemoveImage(true);
                  setSelectedImageFile(null);
                }}
              >
                <Trash2 className="size-4" />
                Quitar imagen
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-muted p-3 text-xs font-bold text-muted-foreground">
              <ImagePlus className="size-4" />
              Sin imagen seleccionada
            </div>
          )}

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
            checked={watch("is_active")}
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
    </AdminSection>
  );
}
