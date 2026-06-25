import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { ArrowLeft, ImagePlus, Plus, Save, Trash2 } from "lucide-react";
import { appRoutes } from "@/app/routes";
import { AdminDataState } from "@/features/admin/components/AdminDataState";
import {
  AdminField,
  adminInputClass,
  adminTextareaClass,
} from "@/features/admin/components/AdminField";
import { AdminSection } from "@/features/admin/components/AdminSection";
import { useProductDetailData } from "@/features/admin/hooks/useProductDetailData";
import {
  inputValueToPrice,
  normalizeSlug,
  priceToInputValue,
  tagsToText,
  textToTags,
} from "@/features/admin/utils/adminForms";
import { notify } from "@/shared/notifications/notify";
import {
  syncProductAdditions,
} from "@/features/admin/services/admin-additions.service";
import {
  deleteProductVariant,
  saveProduct,
  saveProductVariant,
  syncProductOptionGroups,
} from "@/features/admin/services/admin-products.service";
import {
  getStorageImageUrl,
  removeStorageImage,
  uploadStorageImage,
} from "@/shared/services/storage.service";
import { SUPABASE_BUCKETS, SUPABASE_STORAGE_PATHS } from "@/lib/supabase/constants";
import type {
  AdditionRow,
  ProductInput,
  ProductRow,
  ProductVariantInput,
  ProductVariantRow,
} from "@/features/admin/types/admin.types";

type ProductForm = Omit<ProductInput, "price" | "tags"> & {
  price: string;
  tags: string;
};

type VariantForm = Omit<ProductVariantInput, "product_id" | "price"> & {
  price: string;
};

const emptyProductForm: ProductForm = {
  category_id: "",
  slug: "",
  name: "",
  description: "",
  price: "",
  image_path: null,
  is_available: true,
  sort_order: 0,
  tags: "",
};

const emptyVariantForm: VariantForm = {
  name: "",
  price: "",
  is_default: false,
  is_active: true,
  sort_order: 0,
};

function toProductForm(product: ProductRow): ProductForm {
  return {
    category_id: product.category_id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: priceToInputValue(product.price),
    image_path: product.image_path,
    is_available: product.is_available,
    sort_order: product.sort_order,
    tags: tagsToText(product.tags),
  };
}

function getProductDetailPath(product: Pick<ProductRow, "id" | "slug">) {
  return `${appRoutes.adminProducts}/${product.slug}?id=${product.id}`;
}

export function ProductDetailPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get("id");
  const isNewProduct = !slug || slug === "nuevo";
  const {
    data: productDetail,
    isLoading,
    error,
    reload,
  } = useProductDetailData(productId, slug, isNewProduct);
  const {
    categories,
    additions,
    option_groups,
    product: selected,
    product_addition_ids,
    product_option_group_ids,
    product_variants,
  } = productDetail;
  const selectedProductVariants = useMemo(
    () =>
      selected
        ? product_variants
            .filter((variant) => variant.product_id === selected.id)
            .sort((a, b) => a.sort_order - b.sort_order)
        : [],
    [product_variants, selected],
  );
  const formKey = selected?.id ?? (isNewProduct ? "new" : "missing");
  const baseForm = useMemo(
    () =>
      selected
        ? toProductForm(selected)
        : {
            ...emptyProductForm,
            category_id: categories[0]?.id ?? "",
          },
    [categories, selected],
  );
  const [formDraft, setFormDraft] = useState<{
    key: string;
    value: ProductForm;
  } | null>(null);
  const form = formDraft?.key === formKey ? formDraft.value : baseForm;
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantRow | null>(null);
  const [groupDraft, setGroupDraft] = useState<{
    key: string;
    value: string[];
  } | null>(null);
  const selectedGroupIds =
    groupDraft?.key === formKey ? groupDraft.value : product_option_group_ids;
  const [additionDraft, setAdditionDraft] = useState<{
    key: string;
    value: string[];
  } | null>(null);
  const selectedAdditionIds =
    additionDraft?.key === formKey ? additionDraft.value : product_addition_ids;
  const [variantForm, setVariantForm] = useState<VariantForm>(emptyVariantForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [shouldRemoveImage, setShouldRemoveImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingVariant, setIsSavingVariant] = useState(false);
  const [isSavingAdditions, setIsSavingAdditions] = useState(false);

  useEffect(
    () => () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    },
    [imagePreviewUrl],
  );

  const setForm = (
    updater: ProductForm | ((current: ProductForm) => ProductForm),
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

  const selectVariant = (variant: ProductVariantRow) => {
    setSelectedVariant(variant);
    setVariantForm({
      name: variant.name,
      price: String(variant.price),
      is_default: variant.is_default,
      is_active: variant.is_active,
      sort_order: variant.sort_order,
    });
  };

  const startNewVariant = () => {
    setSelectedVariant(null);
    setVariantForm(emptyVariantForm);
  };

  const toggleGroupSelection = (groupId: string) => {
    const currentIds = selectedGroupIds;

    setGroupDraft({
      key: formKey,
      value: currentIds.includes(groupId)
        ? currentIds.filter((currentId) => currentId !== groupId)
        : [...currentIds, groupId],
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
          SUPABASE_BUCKETS.PRODUCT_IMAGES,
          SUPABASE_STORAGE_PATHS.PRODUCTS,
        );
      }

      const savedProduct = await saveProduct(
        {
          category_id: form.category_id,
          slug: normalizeSlug(form.slug),
          name: form.name.trim(),
          description: form.description.trim(),
          price: inputValueToPrice(form.price),
          image_path: shouldRemoveImage ? null : image_path,
          is_available: form.is_available,
          sort_order: Number(form.sort_order) || 0,
          tags: textToTags(form.tags),
        },
        selected?.id,
      );

      if ((imageFile || shouldRemoveImage) && selected?.image_path) {
        await removeStorageImage(
          selected.image_path,
          SUPABASE_BUCKETS.PRODUCT_IMAGES,
        );
      }

      await syncProductOptionGroups(savedProduct.id, selectedGroupIds);
      await syncProductAdditions(savedProduct.id, selectedAdditionIds);

      notify.success("Producto guardado.");
      setFormDraft({
        key: savedProduct.id,
        value: toProductForm(savedProduct),
      });
      setGroupDraft(null);
      setAdditionDraft(null);
      setSelectedImageFile(null);
      setShouldRemoveImage(false);
      await reload();
      navigate(getProductDetailPath(savedProduct), { replace: true });
    } catch (error) {
      notify.error(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleVariantSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selected) {
      notify.warning("Guarda el producto antes de agregar variantes.");
      return;
    }

    setIsSavingVariant(true);

    try {
      await saveProductVariant(
        {
          product_id: selected.id,
          name: variantForm.name.trim(),
          price: Math.max(0, Number(variantForm.price) || 0),
          is_default: variantForm.is_default,
          is_active: variantForm.is_active,
          sort_order: Number(variantForm.sort_order) || 0,
        },
        selectedVariant?.id,
      );
      notify.success("Variante guardada.");
      startNewVariant();
      await reload();
    } catch (error) {
      notify.error(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSavingVariant(false);
    }
  };

  const handleVariantDelete = async (variant: ProductVariantRow) => {
    if (!window.confirm(`Eliminar ${variant.name}?`)) {
      return;
    }

    try {
      await deleteProductVariant(variant.id);
      notify.success("Variante eliminada.");
      if (selectedVariant?.id === variant.id) {
        startNewVariant();
      }
      await reload();
    } catch (error) {
      notify.error(error instanceof Error ? error.message : String(error));
    }
  };

  const toggleAdditionSelection = (additionId: string) => {
    setAdditionDraft({
      key: formKey,
      value: selectedAdditionIds.includes(additionId)
        ? selectedAdditionIds.filter((currentId) => currentId !== additionId)
        : [...selectedAdditionIds, additionId],
    });
  };

  const handleSaveProductAdditions = async () => {
    if (!selected) {
      notify.warning("Guarda el producto antes de asignar adiciones.");
      return;
    }

    setIsSavingAdditions(true);

    try {
      await syncProductAdditions(selected.id, selectedAdditionIds);
      setAdditionDraft(null);
      notify.success("Adiciones guardadas.");
      await reload();
    } catch (error) {
      notify.error(error instanceof Error ? error.message : String(error));
    } finally {
      setIsSavingAdditions(false);
    }
  };

  const state = <AdminDataState isLoading={isLoading} error={error} />;

  if (isLoading || error) {
    return state;
  }

  if (!isNewProduct && !selected) {
    return (
      <AdminSection
        title="Producto no encontrado"
        actions={
          <Link
            to={appRoutes.adminProducts}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface-muted px-4 text-sm font-black text-foreground"
          >
            <ArrowLeft className="size-4" />
            Volver
          </Link>
        }
      >
        <p className="m-0 rounded-lg border border-border bg-surface p-4 text-sm font-bold text-muted-foreground">
          No se encontró un producto con ese identificador.
        </p>
      </AdminSection>
    );
  }

  return (
    <AdminSection
      title={selected ? selected.name : "Nuevo producto"}
      description="Gestiona la información, imagen, acompañantes y variantes de este producto."
      actions={
        <Link
          to={appRoutes.adminProducts}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-surface-muted px-3 text-sm font-black text-foreground sm:min-h-11 sm:px-4"
        >
          <ArrowLeft className="size-4" />
          Volver
        </Link>
      }
    >
      <div className="grid min-w-0 max-w-full gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(500px,0.56fr)]">
        <form
          className="grid min-w-0 content-start gap-4 rounded-lg border border-border bg-surface p-3 shadow-elevated sm:p-4"
          onSubmit={handleSubmit}
        >
          <h2 className="m-0 font-heading text-2xl font-black text-foreground">
            Datos del producto
          </h2>
          <AdminField label="Categoría">
            <select
              className={adminInputClass}
              value={form.category_id}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  category_id: event.target.value,
                }))
              }
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField label="Nombre">
            <input
              className={adminInputClass}
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
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
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              required
            />
          </AdminField>
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
                        SUPABASE_BUCKETS.PRODUCT_IMAGES,
                      )
                    : "")
                }
                alt={form.name || "Producto"}
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
          <div className="grid gap-3 sm:grid-cols-2">
            <AdminField label="Precio en pesos">
              <input
                className={adminInputClass}
                type="number"
                min="0"
                value={form.price}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    price: event.target.value,
                  }))
                }
              />
            </AdminField>
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
          </div>
          <AdminField label="Etiquetas separadas por coma">
            <input
              className={adminInputClass}
              value={form.tags}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  tags: event.target.value,
                }))
              }
            />
          </AdminField>
          <label className="flex items-center gap-2 text-sm font-black text-foreground">
            <input
              type="checkbox"
              checked={form.is_available}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  is_available: event.target.checked,
                }))
              }
            />
            Disponible en el menú público
          </label>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-primary-foreground disabled:opacity-60 sm:w-auto"
          >
            <Save className="size-4" />
            {isSaving ? "Guardando" : "Guardar producto"}
          </button>
        </form>

        <section className="grid min-w-0 content-start gap-4 rounded-lg border border-border bg-surface p-3 shadow-elevated sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="m-0 font-heading text-2xl font-black text-foreground">
                Grupos de opciones
              </h2>
              <p className="mt-1 text-xs font-bold text-muted-foreground">
                {selectedGroupIds.length} seleccionados
              </p>
            </div>
          </div>

          {option_groups.length > 0 ? (
            <div className="grid gap-2">
              {option_groups.map((group) => {
                const isSelected = selectedGroupIds.includes(group.id);

                return (
                  <label
                    key={group.id}
                    className="flex items-start gap-3 rounded-lg border border-border bg-surface-muted p-3"
                  >
                    <input
                      className="mt-1 size-4"
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleGroupSelection(group.id)}
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-black text-foreground">
                        {group.name}
                      </span>
                      <span className="mt-1 block text-xs font-bold text-muted-foreground">
                        {group.is_required ? "Requerido" : "Opcional"} ·{" "}
                        {group.is_active ? "Activo" : "Inactivo"}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          ) : (
            <p className="m-0 rounded-lg border border-border bg-surface-muted p-3 text-sm font-bold text-muted-foreground">
              No hay grupos creados todavía.
            </p>
          )}
        </section>

        <section className="grid min-w-0 content-start gap-4 rounded-lg border border-border bg-surface p-3 shadow-elevated sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="m-0 font-heading text-2xl font-black text-foreground">
                Adiciones
              </h2>
              <p className="mt-1 text-xs font-bold text-muted-foreground">
                {selectedAdditionIds.length} seleccionadas
              </p>
            </div>
            {selected ? (
              <button
                type="button"
                disabled={isSavingAdditions}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-primary bg-primary px-3 text-xs font-black text-primary-foreground sm:px-4"
                onClick={() => void handleSaveProductAdditions()}
              >
                <Save className="size-4" />
                {isSavingAdditions ? "Guardando" : "Guardar"}
              </button>
            ) : null}
          </div>

          {selected ? (
            <>
              {additions.length > 0 ? (
                <div className="grid gap-2">
                  {additions.map((addition: AdditionRow) => {
                    const isSelected = selectedAdditionIds.includes(addition.id);

                    return (
                      <label
                        key={addition.id}
                        className="flex items-start gap-3 rounded-lg border border-border bg-surface-muted p-3"
                      >
                        <input
                          className="mt-1 size-4"
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleAdditionSelection(addition.id)}
                        />
                        <span className="min-w-0">
                          <span className="block text-sm font-black text-foreground">
                            {addition.name}
                          </span>
                          <span className="mt-1 block text-xs font-bold text-muted-foreground">
                            ${addition.price}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                <p className="m-0 rounded-lg border border-border bg-surface-muted p-3 text-sm font-bold text-muted-foreground">
                  No hay adiciones creadas todavía.
                </p>
              )}
            </>
          ) : (
            <p className="m-0 rounded-lg border border-border bg-surface-muted p-3 text-sm font-bold text-muted-foreground">
              Guarda el producto para asignarle adiciones.
            </p>
          )}
        </section>

        <section className="grid min-w-0 content-start gap-4 rounded-lg border border-border bg-surface p-3 shadow-elevated sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="m-0 font-heading text-2xl font-black text-foreground">
              Variantes
            </h2>
            {selected ? (
              <button
                type="button"
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-primary bg-primary px-3 text-xs font-black text-primary-foreground sm:px-4"
                onClick={startNewVariant}
              >
                <Plus className="size-4" />
                Nueva
              </button>
            ) : null}
          </div>

          {selected ? (
            <>
              <div className="grid gap-2">
                {selectedProductVariants.length > 0 ? (
                  selectedProductVariants.map((variant) => (
                    <article
                      key={variant.id}
                      className="grid gap-2 rounded-lg border border-border bg-surface-muted p-3 sm:grid-cols-[1fr_auto]"
                    >
                      <button
                        type="button"
                        className="text-left"
                        onClick={() => selectVariant(variant)}
                      >
                        <span className="block text-sm font-black text-foreground">
                          {variant.name}
                        </span>
                        <span className="mt-1 block text-xs font-bold text-muted-foreground">
                          ${variant.price} ·{" "}
                          {variant.is_default ? "Default" : "Opcional"} ·{" "}
                          {variant.is_active ? "Activa" : "Inactiva"}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="inline-flex size-9 items-center justify-center rounded-full border border-error-border bg-error-soft text-error"
                        onClick={() => void handleVariantDelete(variant)}
                        aria-label={`Eliminar ${variant.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </article>
                  ))
                ) : (
                  <p className="m-0 rounded-lg border border-border bg-surface-muted p-3 text-sm font-bold text-muted-foreground">
                    Este producto no tiene variantes.
                  </p>
                )}
              </div>

              <form className="grid gap-3" onSubmit={handleVariantSubmit}>
                <h3 className="m-0 text-sm font-black text-foreground">
                  {selectedVariant ? "Editar variante" : "Nueva variante"}
                </h3>
                <AdminField label="Nombre">
                  <input
                    className={adminInputClass}
                    value={variantForm.name}
                    onChange={(event) =>
                      setVariantForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    required
                  />
                </AdminField>
                <div className="grid gap-3 min-[1500px]:grid-cols-2">
                  <AdminField label="Precio en pesos">
                    <input
                      className={adminInputClass}
                      type="number"
                      min="0"
                      value={variantForm.price}
                      onChange={(event) =>
                        setVariantForm((current) => ({
                          ...current,
                          price: event.target.value,
                        }))
                      }
                      required
                    />
                  </AdminField>
                  <AdminField label="Orden">
                    <input
                      className={adminInputClass}
                      type="number"
                      value={variantForm.sort_order}
                      onChange={(event) =>
                        setVariantForm((current) => ({
                          ...current,
                          sort_order: Number(event.target.value),
                        }))
                      }
                    />
                  </AdminField>
                </div>
                <div className="grid gap-2">
                  <label className="flex items-center gap-2 text-sm font-black text-foreground">
                    <input
                      type="checkbox"
                      checked={variantForm.is_default}
                      onChange={(event) =>
                        setVariantForm((current) => ({
                          ...current,
                          is_default: event.target.checked,
                        }))
                      }
                    />
                    Default
                  </label>
                  <label className="flex items-center gap-2 text-sm font-black text-foreground">
                    <input
                      type="checkbox"
                      checked={variantForm.is_active}
                      onChange={(event) =>
                        setVariantForm((current) => ({
                          ...current,
                          is_active: event.target.checked,
                        }))
                      }
                    />
                    Activa
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={isSavingVariant}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-primary-foreground disabled:opacity-60"
                >
                  <Save className="size-4" />
                  {isSavingVariant ? "Guardando" : "Guardar variante"}
                </button>
              </form>
            </>
          ) : (
            <p className="m-0 rounded-lg border border-border bg-surface-muted p-3 text-sm font-bold text-muted-foreground">
              Guarda el producto para activar la gestión de variantes.
            </p>
          )}
        </section>
      </div>
    </AdminSection>
  );
}
