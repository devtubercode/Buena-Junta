import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { appRoutes } from "@/app/routes";
import { AdminDataState } from "@/features/admin/components/AdminDataState";
import {
  AdminField,
  adminInputClass,
} from "@/features/admin/components/AdminField";
import { AdminDetailShell } from "@/features/admin/components/AdminDetailShell";
import { AdminImageField } from "@/features/admin/components/AdminImageField";
import { AdminNotFoundState } from "@/features/admin/components/AdminNotFoundState";
import { useAdminImageUpload } from "@/features/admin/hooks/useAdminImageUpload";
import { useAdminSaveHandler } from "@/features/admin/hooks/useAdminSaveHandler";
import { useAutoSlug } from "@/features/admin/hooks/useAutoSlug";
import { useProductDetailData } from "@/features/admin/hooks/useProductDetailData";
import { useCategoriesData } from "@/features/admin/hooks/useCategoriesData";
import {
  inputValueToPrice,
  normalizeAdminNullableString,
  normalizeAdminPrice,
  normalizeAdminString,
  normalizeSlug,
  priceToInputValue,
  tagsToText,
  textToTags,
} from "@/features/admin/utils/adminForms";
import { notify } from "@/shared/notifications/notify";
import {
  deleteAddition,
  saveAddition,
} from "@/features/admin/services/admin-additions.service";
import {
  deleteProductVariant,
  saveProduct,
  saveProductVariant,
} from "@/features/admin/services/admin-products.service";
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
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";
import { EmptyState } from "@/shared/components/EmptyState";
import {
  productSchema,
  type ProductFormData,
} from "@/features/admin/schemas/productSchema";
import {
  productVariantSchema,
  type ProductVariantFormData,
} from "@/features/admin/schemas/productVariantSchema";
import {
  additionSchema,
  type AdditionFormData,
} from "@/features/admin/schemas/additionSchema";
import { ProductOptionGroupsManager } from "@/features/admin/components/ProductOptionGroupsManager";
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

const defaultAdditionValues: AdditionFormData = {
  name: "",
  description: null,
  price: 0,
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

function getProductDetailPath(product: Pick<ProductRow, "id">) {
  return `${appRoutes.adminProduct}?id=${product.id}`;
}

export function ProductDetailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get("id");
  const isNewProduct = !productId || productId === "new";

  const {
    data: productDetail,
    isLoading: isLoadingProductDetail,
    error: productDetailError,
    reload: reloadProductDetail,
  } = useProductDetailData(productId, isNewProduct);

  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useCategoriesData();

  const isLoading = isLoadingProductDetail || isLoadingCategories;
  const error = productDetailError ?? categoriesError;

  const {
    product: selected,
    product_additions,
    product_option_groups,
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
    setValue: setProductValue,
  } = productForm;

  const watchedProductName = useWatch({
    control: productForm.control,
    name: "name",
  });
  const watchedProductIsAvailable = useWatch({
    control: productForm.control,
    name: "is_available",
  });

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

  useAutoSlug({
    form: productForm,
    source: "name",
    target: "slug",
    isNew: isNewProduct,
  });

  const variantForm = useForm<ProductVariantFormData>({
    resolver: zodResolver(productVariantSchema),
    defaultValues: defaultVariantValues,
  });

  const {
    reset: resetVariant,
    handleSubmit: handleSubmitVariant,
    setValue: setVariantValue,
  } = variantForm;

  const watchedVariantIsDefault = useWatch({
    control: variantForm.control,
    name: "is_default",
  });
  const watchedVariantIsActive = useWatch({
    control: variantForm.control,
    name: "is_active",
  });

  const additionForm = useForm<AdditionFormData>({
    resolver: zodResolver(additionSchema),
    defaultValues: defaultAdditionValues,
  });

  const { reset: resetAddition, handleSubmit: handleSubmitAddition } =
    additionForm;

  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantRow | null>(null);
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);

  const [selectedAddition, setSelectedAddition] = useState<AdditionRow | null>(
    null,
  );
  const [isAdditionModalOpen, setIsAdditionModalOpen] = useState(false);
  const [isSavingAddition, setIsSavingAddition] = useState(false);

  const {
    imageFile,
    imagePreviewUrl,
    shouldRemoveImage,
    setSelectedImageFile,
    removeImage,
    resetImageState,
  } = useAdminImageUpload();
  const { isSaving, execute: executeProductSave } =
    useAdminSaveHandler<ProductRow>({
      successMessage: "Producto guardado.",
      onSuccess: async (savedProduct) => {
        resetImageState();
        await reloadProductDetail();
        navigate(getProductDetailPath(savedProduct), { replace: true });
      },
    });
  const [isSavingVariant, setIsSavingVariant] = useState(false);

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

  const selectAddition = (addition: AdditionRow) => {
    setSelectedAddition(addition);
    resetAddition({
      name: addition.name,
      description: addition.description,
      price: addition.price,
    });
    setIsAdditionModalOpen(true);
  };

  const startNewAddition = () => {
    setSelectedAddition(null);
    resetAddition(defaultAdditionValues);
    setIsAdditionModalOpen(true);
  };

  const closeAdditionModal = () => {
    setIsAdditionModalOpen(false);
  };

  const onSubmitProduct = async (data: ProductFormData) => {
    await executeProductSave(async () => {
      let image_path: string | null = selected?.image_path ?? null;

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
          name: normalizeAdminString(data.name),
          description: normalizeAdminString(data.description),
          price: inputValueToPrice(data.price),
          image_path: shouldRemoveImage ? null : image_path,
          is_available: data.is_available,
          sort_order: data.sort_order,
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

      return savedProduct;
    });
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
          name: normalizeAdminString(data.name),
          price: normalizeAdminPrice(data.price),
          is_default: data.is_default,
          is_active: data.is_active,
          sort_order: data.sort_order,
        } satisfies ProductVariantInput,
        selectedVariant?.id,
      );
      notify.success("Variante guardada.");
      startNewVariant();
      closeVariantModal();
      await reloadProductDetail();
    } catch (submitError) {
      notify.error(
        submitError instanceof Error
          ? submitError.message
          : String(submitError),
      );
    } finally {
      setIsSavingVariant(false);
    }
  };

  const onSubmitAddition = async (data: AdditionFormData) => {
    if (!selected) {
      notify.warning("Guarda el producto antes de agregar adiciones.");
      return;
    }

    setIsSavingAddition(true);

    try {
      await saveAddition(
        {
          name: normalizeAdminString(data.name),
          description: normalizeAdminNullableString(data.description),
          price: data.price,
          product_id: selected.id,
        },
        selectedAddition?.id,
      );
      notify.success(
        selectedAddition ? "Adición actualizada." : "Adición creada.",
      );
      closeAdditionModal();
      setSelectedAddition(null);
      resetAddition(defaultAdditionValues);
      await reloadProductDetail();
    } catch (submitError) {
      notify.error(
        submitError instanceof Error
          ? submitError.message
          : String(submitError),
      );
    } finally {
      setIsSavingAddition(false);
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
      await reloadProductDetail();
    } catch (deleteError) {
      notify.error(
        deleteError instanceof Error
          ? deleteError.message
          : String(deleteError),
      );
    }
  };

  const handleAdditionDelete = async (addition: AdditionRow) => {
    if (!window.confirm(`¿Eliminar ${addition.name}?`)) {
      return;
    }

    try {
      await deleteAddition(addition.id);
      notify.success("Adición eliminada.");
      if (selectedAddition?.id === addition.id) {
        setSelectedAddition(null);
        resetAddition(defaultAdditionValues);
      }
      await reloadProductDetail();
    } catch (deleteError) {
      notify.error(
        deleteError instanceof Error
          ? deleteError.message
          : String(deleteError),
      );
    }
  };

  const state = <AdminDataState isLoading={isLoading} error={error} />;

  if (isLoading || error) {
    return state;
  }

  if (!isNewProduct && !selected) {
    return (
      <AdminNotFoundState
        title="Producto no encontrado"
        description="No se encontró un producto con ese identificador."
        backTo={appRoutes.adminProducts}
      />
    );
  }

  return (
    <AdminDetailShell
      title={selected ? selected.name : "Nuevo producto"}
      description="Gestiona la información, imagen, acompañantes y variantes de este producto."
      backTo={appRoutes.adminProducts}
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

          <AdminImageField
            imagePreviewUrl={imagePreviewUrl}
            currentImagePath={selected?.image_path ?? null}
            shouldRemoveImage={shouldRemoveImage}
            onFileChange={setSelectedImageFile}
            onRemove={removeImage}
            alt={watchedProductName || "Producto"}
            bucket={SUPABASE_BUCKETS.PRODUCT_IMAGES}
          />

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
            checked={watchedProductIsAvailable}
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

        {/* Product-specific Option Groups Manager */}
        {selected && (
          <section className="grid h-fit min-w-0 content-start gap-4 rounded-lg border border-border bg-surface p-3 shadow-elevated sm:p-4 xl:col-span-2">
            <ProductOptionGroupsManager
              productId={selected.id}
              optionGroups={product_option_groups}
              onGroupsChange={reloadProductDetail}
            />
          </section>
        )}

        <section className="grid h-fit min-w-0 content-start gap-4 rounded-lg border border-border bg-surface p-3 shadow-elevated sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="m-0 font-heading text-2xl font-black text-foreground">
                Adiciones
              </h2>
              <p className="mt-1 text-xs font-bold text-muted-foreground">
                {product_additions.length} adicion
                {product_additions.length === 1 ? "" : "es"}
              </p>
            </div>
            {selected ? (
              <button
                type="button"
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-primary bg-primary px-3 text-xs font-black text-primary-foreground sm:px-4"
                onClick={startNewAddition}
              >
                <Plus className="size-4" />
                Nueva
              </button>
            ) : null}
          </div>

          {selected ? (
            product_additions.length > 0 ? (
              <div className="grid max-h-[400px] gap-2 overflow-y-auto pr-1">
                {product_additions.map((addition) => (
                  <article
                    key={addition.id}
                    className="grid gap-2 rounded-lg border border-border bg-surface-muted p-3 sm:grid-cols-[1fr_auto]"
                  >
                    <button
                      type="button"
                      className="min-w-0 text-left"
                      onClick={() => selectAddition(addition)}
                    >
                      <span className="block text-sm font-black text-foreground">
                        {addition.name}
                      </span>
                      <span className="mt-1 block text-xs font-bold text-muted-foreground">
                        ${addition.price}
                        {addition.description
                          ? ` · ${addition.description}`
                          : ""}
                      </span>
                    </button>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition hover:border-primary hover:text-primary"
                        onClick={() => selectAddition(addition)}
                        aria-label={`Editar ${addition.name}`}
                      >
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex size-9 items-center justify-center rounded-full border border-error-border bg-error-soft text-error"
                        onClick={() => void handleAdditionDelete(addition)}
                        aria-label={`Eliminar ${addition.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="Sin adiciones"
                description="Este producto no tiene adiciones configuradas."
                action={
                  <button
                    type="button"
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-xs font-black text-primary-foreground"
                    onClick={startNewAddition}
                  >
                    <Plus className="size-4" />
                    Nueva adición
                  </button>
                }
              />
            )
          ) : (
            <p className="m-0 rounded-lg border border-border bg-surface-muted p-3 text-sm font-bold text-muted-foreground">
              Guarda el producto para activar la gestión de adiciones.
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
            selectedProductVariants.length > 0 ? (
              <div className="grid max-h-[400px] gap-2 overflow-y-auto pr-1">
                {selectedProductVariants.map((variant) => (
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
                ))}
              </div>
            ) : (
              <EmptyState
                title="Sin variantes"
                description="Este producto no tiene variantes configuradas."
                action={
                  <button
                    type="button"
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-xs font-black text-primary-foreground"
                    onClick={startNewVariant}
                  >
                    <Plus className="size-4" />
                    Nueva variante
                  </button>
                }
              />
            )
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
              checked={watchedVariantIsDefault}
              onCheckedChange={(checked) => {
                setVariantValue("is_default", checked, {
                  shouldValidate: true,
                });
              }}
            />
            <Checkbox
              label="Activa"
              checked={watchedVariantIsActive}
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

      <ButtonSheetModal
        isOpen={isAdditionModalOpen}
        title={selectedAddition ? "Editar adición" : "Nueva adición"}
        description={
          selectedAddition
            ? "Actualiza los datos de la adición seleccionada."
            : "Completa los datos para crear una nueva adición."
        }
        contentClassName="max-w-lg"
        onClose={closeAdditionModal}
      >
        <form
          className="grid gap-4"
          onSubmit={handleSubmitAddition(onSubmitAddition)}
          noValidate
        >
          <InputField
            name="name"
            control={additionForm.control}
            label="Nombre"
            placeholder="Ej: Queso extra"
            autoComplete="off"
          />

          <TextAreaField
            name="description"
            form={additionForm}
            label="Descripción"
            placeholder="Descripción opcional de la adición"
          />

          <InputField
            name="price"
            control={additionForm.control}
            label="Precio"
            type="number"
            min={0}
            step={1}
          />

          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <button
              type="submit"
              disabled={isSavingAddition}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 disabled:opacity-60"
            >
              <Save className="size-4" />
              {isSavingAddition ? "Guardando" : "Guardar"}
            </button>
            <button
              type="button"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-black text-muted-foreground transition hover:border-primary hover:text-primary"
              onClick={closeAdditionModal}
            >
              <X className="size-4" />
              Cancelar
            </button>
          </div>
        </form>
      </ButtonSheetModal>
    </AdminDetailShell>
  );
}
