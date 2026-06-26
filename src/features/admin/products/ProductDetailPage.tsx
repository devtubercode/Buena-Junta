import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { appRoutes } from "@/app/routes";
import { AdminDataState } from "@/features/admin/shared/state/AdminDataState";
import {
  AdminField,
  adminInputClass,
} from "@/features/admin/shared/components/AdminField";
import { AdminDetailShell } from "@/features/admin/shared/components/AdminDetailShell";
import { AdminImageField } from "@/features/admin/shared/components/AdminImageField";
import { AdminNotFoundState } from "@/features/admin/shared/state/AdminNotFoundState";
import { useAdminImageUpload } from "@/features/admin/shared/hooks/useAdminImageUpload";
import { useAdminSaveHandler } from "@/features/admin/shared/hooks/useAdminSaveHandler";
import { useAutoSlug } from "@/features/admin/shared/hooks/useAutoSlug";
import { useProductDetailData } from "@/features/admin/products/useProductDetailData";
import { useCategoriesData } from "@/features/admin/categories/useCategoriesData";
import {
  normalizeAdminString,
  normalizeSlug,
  parsePrice,
  priceToInputValue,
  tagsToText,
  textToTags,
} from "@/features/admin/shared/utils/adminForms";
import { saveProduct } from "@/features/admin/products/services/admin-products.service";
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
  productSchema,
  type ProductFormData,
} from "@/features/admin/schemas/productSchema";
import { ProductOptionGroupsManager } from "@/features/admin/products/option-groups/ProductOptionGroupsManager";
import { ProductVariantsSection } from "@/features/admin/products/variants/ProductVariantsSection";
import { ProductAdditionsSection } from "@/features/admin/products/additions/ProductAdditionsSection";
import type { ProductInput, ProductRow } from "@/features/admin/types/products.types";

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

  const selectedProductVariants = selected
    ? product_variants.filter((variant) => variant.product_id === selected.id)
    : [];

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
          price: parsePrice(data.price),
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

  if (isLoading || error) {
    return <AdminDataState isLoading={isLoading} error={error} />;
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

        {selected && (
          <section className="grid h-fit min-w-0 content-start gap-4 rounded-lg border border-border bg-surface p-3 shadow-elevated sm:p-4 xl:col-span-2">
            <ProductOptionGroupsManager
              productId={selected.id}
              optionGroups={product_option_groups}
              onGroupsChange={reloadProductDetail}
            />
          </section>
        )}

        {selected ? (
          <ProductAdditionsSection
            additions={product_additions}
            productId={selected.id}
            onAdditionsChange={reloadProductDetail}
          />
        ) : (
          <section className="grid h-fit min-w-0 content-start gap-4 rounded-lg border border-border bg-surface p-3 shadow-elevated sm:p-4">
            <h2 className="m-0 font-heading text-2xl font-black text-foreground">
              Adiciones
            </h2>
            <p className="m-0 rounded-lg border border-border bg-surface-muted p-3 text-sm font-bold text-muted-foreground">
              Guarda el producto para activar la gestión de adiciones.
            </p>
          </section>
        )}

        {selected ? (
          <ProductVariantsSection
            productId={selected.id}
            variants={selectedProductVariants}
            onVariantsChange={reloadProductDetail}
          />
        ) : (
          <section className="grid h-fit min-w-0 content-start gap-4 rounded-lg border border-border bg-surface p-3 shadow-elevated sm:p-4">
            <h2 className="m-0 font-heading text-2xl font-black text-foreground">
              Variantes
            </h2>
            <p className="m-0 rounded-lg border border-border bg-surface-muted p-3 text-sm font-bold text-muted-foreground">
              Guarda el producto para activar la gestión de variantes.
            </p>
          </section>
        )}
      </div>
    </AdminDetailShell>
  );
}
