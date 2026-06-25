import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { ArrowLeft, ImagePlus, Save, Trash2 } from "lucide-react";
import { appRoutes } from "@/app/routes";
import { AdminDataState } from "@/features/admin/components/AdminDataState";
import {
  AdminField,
  adminInputClass,
  adminTextareaClass,
} from "@/features/admin/components/AdminField";
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
import type {
  PromotionInput,
  PromotionRow,
} from "@/features/admin/types/admin.types";

type PromotionForm = Omit<PromotionInput, "active_weekdays"> & {
  active_weekdays: Set<number>;
};

const emptyPromotionForm: PromotionForm = {
  category_id: null,
  product_id: null,
  slug: "",
  title: "",
  description: null,
  is_active: true,
  active_weekdays: new Set<number>(),
  starts_at: null,
  ends_at: null,
  image_path: null,
  terms: null,
  sort_order: 0,
};

const weekdays = [
  { value: 0, label: "Dom" },
  { value: 1, label: "Lun" },
  { value: 2, label: "Mar" },
  { value: 3, label: "Mié" },
  { value: 4, label: "Jue" },
  { value: 5, label: "Vie" },
  { value: 6, label: "Sáb" },
];

function toPromotionForm(promotion: PromotionRow): PromotionForm {
  return {
    category_id: promotion.category_id,
    product_id: promotion.product_id,
    slug: promotion.slug,
    title: promotion.title,
    description: promotion.description,
    is_active: promotion.is_active,
    active_weekdays: new Set(promotion.active_weekdays),
    starts_at: promotion.starts_at,
    ends_at: promotion.ends_at,
    image_path: promotion.image_path,
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
  const formKey = selected?.id ?? (isNewPromotion ? "new" : "missing");
  const baseForm = selected ? toPromotionForm(selected) : emptyPromotionForm;
  const [formDraft, setFormDraft] = useState<{
    key: string;
    value: PromotionForm;
  } | null>(null);
  const form = formDraft?.key === formKey ? formDraft.value : baseForm;
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

  const setForm = (
    updater: PromotionForm | ((current: PromotionForm) => PromotionForm),
  ) => {
    const nextForm = typeof updater === "function" ? updater(form) : updater;
    setFormDraft({ key: formKey, value: nextForm });
  };

  const setSelectedImageFile = (file: File | null) => {
    setImagePreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      return file ? URL.createObjectURL(file) : null;
    });
    setImageFile(file);
  };

  const toggleWeekday = (weekday: number) => {
    setForm((current) => {
      const active_weekdays = new Set(current.active_weekdays);

      if (active_weekdays.has(weekday)) {
        active_weekdays.delete(weekday);
      } else {
        active_weekdays.add(weekday);
      }

      return {
        ...current,
        active_weekdays,
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      let image_path = form.image_path;

      if (imageFile) {
        image_path = await uploadStorageImage(
          imageFile,
          SUPABASE_BUCKETS.PROMOTION_IMAGES,
          SUPABASE_STORAGE_PATHS.PROMOTIONS,
        );
      }

      const savedPromotion = await savePromotion(
        {
          category_id: form.category_id,
          product_id: form.product_id,
          slug: normalizeSlug(form.slug),
          title: form.title.trim(),
          description: form.description?.trim() || null,
          is_active: form.is_active,
          active_weekdays: [...form.active_weekdays].sort(),
          starts_at: form.starts_at,
          ends_at: form.ends_at,
          image_path: shouldRemoveImage ? null : image_path?.trim() || null,
          terms: form.terms?.trim() || null,
          sort_order: Number(form.sort_order) || 0,
        },
        selected?.id,
      );

      if ((imageFile || shouldRemoveImage) && selected?.image_path) {
        await removeStorageImage(
          selected.image_path,
          SUPABASE_BUCKETS.PROMOTION_IMAGES,
        );
      }

      notify.success("Promoción guardada.");
      setFormDraft({
        key: savedPromotion.id,
        value: toPromotionForm(savedPromotion),
      });
      setSelectedImageFile(null);
      setShouldRemoveImage(false);
      await reload();
      navigate(getPromotionDetailPath(savedPromotion), { replace: true });
    } catch (error) {
      notify.error(error instanceof Error ? error.message : String(error));
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
        onSubmit={handleSubmit}
      >
        <div className="grid min-w-0 content-start gap-4">
          <h2 className="m-0 font-heading text-2xl font-black text-foreground">
            Datos de la promoción
          </h2>
          <AdminField label="Título">
            <input
              className={adminInputClass}
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  title: event.target.value,
                  slug: current.slug || normalizeSlug(event.target.value),
                }))
              }
              required
            />
          </AdminField>
          <AdminField label="Slug">
            <input
              className={adminInputClass}
              value={form.slug}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  slug: normalizeSlug(event.target.value),
                }))
              }
              required
            />
          </AdminField>
          <AdminField label="Descripción">
            <textarea
              className={adminTextareaClass}
              value={form.description ?? ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
            />
          </AdminField>
          <div className="grid gap-3 sm:grid-cols-2">
            <AdminField label="Categoría relacionada">
              <select
                className={adminInputClass}
                value={form.category_id ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    category_id: event.target.value || null,
                  }))
                }
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
                value={form.product_id ?? ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    product_id: event.target.value || null,
                  }))
                }
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
                value={toDatetimeLocal(form.starts_at)}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    starts_at: fromDatetimeLocal(event.target.value),
                  }))
                }
              />
            </AdminField>
            <AdminField label="Fin">
              <input
                className={adminInputClass}
                type="datetime-local"
                value={toDatetimeLocal(form.ends_at)}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    ends_at: fromDatetimeLocal(event.target.value),
                  }))
                }
              />
            </AdminField>
          </div>
          <AdminField label="Días activos">
            <div className="flex flex-wrap gap-2">
              {weekdays.map((weekday) => (
                <button
                  key={weekday.value}
                  type="button"
                  className="min-h-10 rounded-full border px-3 text-xs font-black data-[active=true]:border-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=false]:border-border data-[active=false]:bg-surface-muted"
                  data-active={form.active_weekdays.has(weekday.value)}
                  onClick={() => toggleWeekday(weekday.value)}
                >
                  {weekday.label}
                </button>
              ))}
            </div>
          </AdminField>
          <AdminField label="Términos">
            <textarea
              className={adminTextareaClass}
              value={form.terms ?? ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  terms: event.target.value,
                }))
              }
            />
          </AdminField>
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
          {(imagePreviewUrl || form.image_path) && !shouldRemoveImage ? (
            <div className="grid gap-2 rounded-lg border border-border bg-surface-muted p-3">
              <img
                src={
                  imagePreviewUrl ??
                  (form.image_path
                    ? getStorageImageUrl(
                        form.image_path,
                        SUPABASE_BUCKETS.PROMOTION_IMAGES,
                      )
                    : "")
                }
                alt={form.title || "Promoción"}
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
          <AdminField label="Orden">
            <input
              className={adminInputClass}
              type="number"
              value={form.sort_order}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  sort_order: Number(event.target.value),
                }))
              }
            />
          </AdminField>
          <label className="flex items-center gap-2 text-sm font-black text-foreground">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  is_active: event.target.checked,
                }))
              }
            />
            Activa
          </label>
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
