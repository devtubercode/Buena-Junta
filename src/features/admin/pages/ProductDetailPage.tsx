import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ImagePlus,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { appRoutes } from "@/app/routes";
import { AdminDataState } from "@/features/admin/components/AdminDataState";
import { AdminField, adminInputClass } from "@/features/admin/components/AdminField";
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
import { cn } from "@/shared/utils/cn";
import { syncProductAdditions } from "@/features/admin/services/admin-additions.service";
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
import { InputField } from "@/shared/components/InputField";
import { TextAreaField } from "@/shared/components/TextAreaField";
import { Checkbox } from "@/shared/components/Checkbox";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";
import {
  productSchema,
  type ProductFormData,
} from "@/features/admin/schemas/productSchema";
import {
  productVariantSchema,
  type ProductVariantFormData,
} from "@/features/admin/schemas/productVariantSchema";
import type {
  AdditionRow,
  ProductInput,
  ProductRow,
  ProductVariantInput,
  ProductVariantRow,
} from "@/features/admin/types/admin.types";

const defaultProductValues: ProductFormData = {
  category_id: "",
  slug: "",
  name: "",
  description: "",
  price: "",
  is_available: true,
  sort_order: 0,
  tags: "",
};

const defaultVariantValues: ProductVariantFormData = {
  name: "",
  price: "",
  is_default: false,
  is_active: true,
  sort_order: 0,
};

function toProductForm(product: ProductRow): ProductFormData {
  return {
    category_id: product.category_id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: priceToInputValue(product.price),
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

  const productForm = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultProductValues,
  });

  const {
    register: registerProduct,
    handleSubmit: handleSubmitProduct,
    reset: resetProduct,
    watch: watchProduct,
    setValue: setProductValue,
    getValues: getProductValues,
  } = productForm;

  const nameValue = watchProduct("name");

  useEffect(() => {
    if (selected) {
      resetProduct(toProductForm(selected));
      return;
    }

    if (isNewProduct) {
      resetProduct({
        ...defaultProductValues,
        category_id: categories[0]?.id ?? "",
      });
    }
  }, [selected, isNewProduct, categories, resetProduct]);

  useEffect(() => {
    if (selected) {
      return;
    }

    const slugValue = getProductValues("slug");

    if (nameValue && !slugValue) {
      setProductValue("slug", normalizeSlug(nameValue), { shouldValidate: true });
    }
  }, [nameValue, selected, getProductValues, setProductValue]);

  const variantForm = useForm<ProductVariantFormData>({
    resolver: zodResolver(productVariantSchema),
    defaultValues: defaultVariantValues,
  });

  const {
    reset: resetVariant,
    handleSubmit: handleSubmitVariant,
    setValue: setVariantValue,
    watch: watchVariant,
  } = variantForm;

  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantRow | null>(null);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
  const [groupDraft, setGroupDraft] = useState<{
    key: string;
    value: string[];
  } | null>(null);
  const selectedGroupIds =
    groupDraft?.key === (selected?.id ?? "new")
      ? groupDraft.value
      : product_option_group_ids;
  const [additionDraft, setAdditionDraft] = useState<{
    key: string;
    value: string[];
  } | null>(null);
  const selectedAdditionIds =
    additionDraft?.key === (selected?.id ?? "new")
      ? additionDraft.value
      : product_addition_ids;
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

  const setSelectedImageFile = (file: File | null) => {
    setImagePreviewUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      return file ? URL.createObjectURL(file) : null;
    });
    setImageFile(file);
  };

  const currentImagePath = selected?.image_path ?? null;

  const selectVariant = (variant: ProductVariantRow) => {
    setSelectedVariant(variant);
    resetVariant({
      name: variant.name,
      price: String(variant.price),
      is_default: variant.is_default,
      is_active: variant.is_active,
      sort_order: variant.sort_order,
    });
    setIsVariantModalOpen(true);
  };

  const startNewVariant = () => {
    setSelectedVariant(null);
    resetVariant(defaultVariantValues);
    setIsVariantModalOpen(true);
  };

  const closeVariantModal = () => {
    setIsVariantModalOpen(false);
  };

  const toggleGroupSelection = (groupId: string) => {
    const currentIds = selectedGroupIds;
    const formKey = selected?.id ?? "new";

    setGroupDraft({
      key: formKey,
      value: currentIds.includes(groupId)
        ? currentIds.filter((currentId) => currentId !== groupId)
        : [...currentIds, groupId],
    });
  };

  const onSubmitProduct = async (data: ProductFormData) => {
    setIsSaving(true);

    try {
      let image_path: string | null = currentImagePath;

      if (imageFile) {
        image_path = await uploadStorageImage(
          imageFile,
          SUPABASE_BUCKETS.PRODUCT_IMAGES,
          SUPABASE_STORAGE_PATHS.PRODUCTS,
        );
      }

      const savedProduct = await saveProduct(
        {
          category_id: data.category_id,
          slug: normalizeSlug(data.slug),
          name: data.name.trim(),
          description: data.description.trim(),
          price: inputValueToPrice(data.price),
          image_path: shouldRemoveImage ? null : image_path,
          is_available: data.is_available,
          sort_order: Number(data.sort_order) || 0,
          tags: textToTags(data.tags),
        } satisfies ProductInput,
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
      setGroupDraft(null);
      setAdditionDraft(null);
      setSelectedImageFile(null);
      setShouldRemoveImage(false);
      await reload();
      navigate(getProductDetailPath(savedProduct), { replace: true });
    } catch (submitError) {
      notify.error(
        submitError instanceof Error ? submitError.message : String(submitError),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmitVariant = async (data: ProductVariantFormData) => {
    if (!selected) {
      notify.warning("Guarda el producto antes de agregar variantes.");
      return;
    }

    setIsSavingVariant(true);

    try {
      await saveProductVariant(
        {
          product_id: selected.id,
          name: data.name.trim(),
          price: Math.max(0, Number(data.price) || 0),
          is_default: data.is_default,
          is_active: data.is_active,
          sort_order: Number(data.sort_order) || 0,
        } satisfies ProductVariantInput,
        selectedVariant?.id,
      );
      notify.success("Variante guardada.");
      startNewVariant();
      closeVariantModal();
      await reload();
    } catch (submitError) {
      notify.error(
        submitError instanceof Error ? submitError.message : String(submitError),
      );
    } finally {
      setIsSavingVariant(false);
    }
  };

  const handleVariantDelete = async (variant: ProductVariantRow) => {
    if (!window.confirm(`¿Eliminar ${variant.name}?`)) {
      return;
    }

    try {
      await deleteProductVariant(variant.id);
      notify.success("Variante eliminada.");
      if (selectedVariant?.id === variant.id) {
        startNewVariant();
      }
      await reload();
    } catch (deleteError) {
      notify.error(
        deleteError instanceof Error ? deleteError.message : String(deleteError),
      );
    }
  };

  const toggleAdditionSelection = (additionId: string) => {
    const formKey = selected?.id ?? "new";

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
    } catch (additionsError) {
      notify.error(
        additionsError instanceof Error
          ? additionsError.message
          : String(additionsError),
      );
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
      <div className="grid min-w-0 max-w-full gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.44fr)]">
        <form
          className="grid min-w-0 content-start gap-4 rounded-lg border border-border bg-surface p-3 shadow-elevated sm:p-4"
          onSubmit={handleSubmitProduct(onSubmitProduct)}
          noValidate
        >
          <h2 className="m-0 font-heading text-2xl font-black text-foreground">
            Datos del producto
          </h2>

          <AdminField label="Categoría">
            <select
              className={adminInputClass}
              {...registerProduct("category_id")}
              onChange={(event) => {
                setProductValue("category_id", event.target.value, {
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

          <InputField
            name="name"
            control={productForm.control}
            label="Nombre"
            placeholder="Ej: Hamburguesa clásica"
            autoComplete="off"
          />

          <InputField
            name="slug"
            control={productForm.control}
            label="Slug"
            placeholder="Ej: hamburguesa-clasica"
            autoComplete="off"
          />

          <TextAreaField
            name="description"
            form={productForm}
            label="Descripción"
            placeholder="Describe el producto"
          />

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
          {(imagePreviewUrl || currentImagePath) && !shouldRemoveImage ? (
            <div className="grid gap-2 rounded-lg border border-border bg-surface-muted p-3">
              <img
                src={
                  imagePreviewUrl ??
                  (currentImagePath
                    ? getStorageImageUrl(
                        currentImagePath,
                        SUPABASE_BUCKETS.PRODUCT_IMAGES,
                      )
                    : "")
                }
                alt={watchProduct("name") || "Producto"}
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
            <InputField
              name="price"
              control={productForm.control}
              label="Precio en pesos"
              type="number"
              min={0}
              step={1}
            />
            <InputField
              name="sort_order"
              control={productForm.control}
              label="Orden"
              type="number"
              min={0}
              step={1}
            />
          </div>

          <InputField
            name="tags"
            control={productForm.control}
            label="Etiquetas separadas por coma"
            placeholder="Ej: picante, recomendado"
            autoComplete="off"
          />

          <Checkbox
            label="Disponible en el menú público"
            checked={watchProduct("is_available")}
            onCheckedChange={(checked) => {
              setProductValue("is_available", checked, {
                shouldValidate: true,
              });
            }}
          />

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-primary-foreground disabled:opacity-60 sm:w-auto"
          >
            <Save className="size-4" />
            {isSaving ? "Guardando" : "Guardar producto"}
          </button>
        </form>

        <section className="grid h-fit min-w-0 content-start gap-4 rounded-lg border border-border bg-surface p-3 shadow-elevated sm:p-4">
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
                  <button
                    key={group.id}
                    type="button"
                    className={cn(
                      "flex items-start gap-3 rounded-lg border p-3 text-left transition",
                      isSelected
                        ? "border-primary bg-primary-soft"
                        : "border-border bg-surface-muted hover:border-primary/50"
                    )}
                    onClick={() => toggleGroupSelection(group.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleGroupSelection(group.id)}
                      containerClassName="pointer-events-none"
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
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="m-0 rounded-lg border border-border bg-surface-muted p-3 text-sm font-bold text-muted-foreground">
              No hay grupos creados todavía.
            </p>
          )}
        </section>

        <section className="grid h-fit min-w-0 content-start gap-4 rounded-lg border border-border bg-surface p-3 shadow-elevated sm:p-4">
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
                      <button
                        key={addition.id}
                        type="button"
                        className={cn(
                          "flex items-start gap-3 rounded-lg border p-3 text-left transition",
                          isSelected
                            ? "border-primary bg-primary-soft"
                          : "border-border bg-surface-muted hover:border-primary/50"
                        )}
                        onClick={() => toggleAdditionSelection(addition.id)}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleAdditionSelection(addition.id)}
                          containerClassName="pointer-events-none"
                        />
                        <span className="min-w-0">
                          <span className="block text-sm font-black text-foreground">
                            {addition.name}
                          </span>
                          <span className="mt-1 block text-xs font-bold text-muted-foreground">
                            ${addition.price}
                          </span>
                        </span>
                      </button>
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

        <section className="grid h-fit min-w-0 content-start gap-4 rounded-lg border border-border bg-surface p-3 shadow-elevated sm:p-4">
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
          ) : (
            <p className="m-0 rounded-lg border border-border bg-surface-muted p-3 text-sm font-bold text-muted-foreground">
              Guarda el producto para activar la gestión de variantes.
            </p>
          )}
        </section>
      </div>

      <ButtonSheetModal
        isOpen={isVariantModalOpen}
        title={selectedVariant ? "Editar variante" : "Nueva variante"}
        description={
          selectedVariant
            ? "Actualiza los datos de la variante seleccionada."
            : "Completa los datos para crear una nueva variante."
        }
        contentClassName="max-w-lg"
        onClose={closeVariantModal}
      >
        <form
          className="grid gap-4"
          onSubmit={handleSubmitVariant(onSubmitVariant)}
          noValidate
        >
          <InputField
            name="name"
            control={variantForm.control}
            label="Nombre"
            placeholder="Ej: Personal"
            autoComplete="off"
          />

          <div className="grid gap-3 min-[1500px]:grid-cols-2">
            <InputField
              name="price"
              control={variantForm.control}
              label="Precio en pesos"
              type="number"
              min={0}
              step={1}
            />
            <InputField
              name="sort_order"
              control={variantForm.control}
              label="Orden"
              type="number"
              min={0}
              step={1}
            />
          </div>

          <div className="grid gap-2">
            <Checkbox
              label="Default"
              checked={watchVariant("is_default")}
              onCheckedChange={(checked) => {
                setVariantValue("is_default", checked, {
                  shouldValidate: true,
                });
              }}
            />
            <Checkbox
              label="Activa"
              checked={watchVariant("is_active")}
              onCheckedChange={(checked) => {
                setVariantValue("is_active", checked, {
                  shouldValidate: true,
                });
              }}
            />
          </div>

          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <button
              type="submit"
              disabled={isSavingVariant}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 disabled:opacity-60"
            >
              <Save className="size-4" />
              {isSavingVariant ? "Guardando" : "Guardar"}
            </button>
            <button
              type="button"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-black text-muted-foreground transition hover:border-primary hover:text-primary"
              onClick={closeVariantModal}
            >
              <X className="size-4" />
              Cancelar
            </button>
          </div>
        </form>
      </ButtonSheetModal>
    </AdminSection>
  );
}
