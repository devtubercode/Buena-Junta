import { useSearchParams, useNavigate } from "react-router";
import { appRoutes } from "@/app/routes";
import { AdminDataState } from "@/features/admin/shared/state/AdminDataState";
import { AdminDetailShell } from "@/features/admin/shared/components/AdminDetailShell";
import { AdminNotFoundState } from "@/features/admin/shared/state/AdminNotFoundState";
import { useCategoriesData } from "@/features/admin/categories/hooks/useCategoriesData";
import { useProductDetailData } from "@/features/admin/products/useProductDetailData";
import { useProductBaseForm } from "@/features/admin/products/hooks/useProductBaseForm";
import { ProductBaseForm } from "@/features/admin/products/components/ProductBaseForm";
import { ProductOptionGroupsSection } from "@/features/admin/products/option-groups/ProductOptionGroupsSection";
import { ProductVariantsSection } from "@/features/admin/products/variants/ProductVariantsSection";
import { ProductAdditionsSection } from "@/features/admin/products/additions/ProductAdditionsSection";
import type { ProductRow } from "@/features/admin/types/products.types";

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

  const handleProductSaved = async (savedProduct: ProductRow) => {
    await reloadProductDetail();
    navigate(getProductDetailPath(savedProduct), { replace: true });
  };

  const {
    productForm,
    registerProduct,
    handleSubmitProduct,
    setProductValue,
    watchedProductName,
    watchedProductIsAvailable,
    isSaving,
    onSubmitProduct,
    imagePreviewUrl,
    shouldRemoveImage,
    setSelectedImageFile,
    removeImage,
  } = useProductBaseForm({
    selected,
    isNewProduct,
    categories,
    onSaved: handleProductSaved,
  });

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
      <div className="grid min-w-0 max-w-full gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(340px,0.46fr)]">
        <ProductBaseForm
          categories={categories}
          selected={selected}
          control={productForm.control}
          register={registerProduct}
          handleSubmit={handleSubmitProduct}
          setValue={setProductValue}
          watchedName={watchedProductName}
          watchedIsAvailable={watchedProductIsAvailable}
          isSaving={isSaving}
          imagePreviewUrl={imagePreviewUrl}
          shouldRemoveImage={shouldRemoveImage}
          onImageFileChange={setSelectedImageFile}
          onRemoveImage={removeImage}
          onSubmit={onSubmitProduct}
        />

        {selected ? (
          <div className="min-w-0 xl:col-start-2">
            <ProductVariantsSection
              productId={selected.id}
              variants={product_variants}
              onVariantsChange={reloadProductDetail}
            />
          </div>
        ) : (
          <section className="grid h-fit min-w-0 content-start gap-4 rounded-xl border border-border bg-surface p-3 shadow-elevated sm:p-4 xl:col-start-2">
            <h2 className="m-0 font-heading text-2xl font-black text-foreground">
              Variantes
            </h2>
            <p className="m-0 rounded-lg border border-dashed border-border bg-surface-muted p-4 text-sm font-bold text-muted-foreground">
              Guarda el producto para activar la gestión de variantes.
            </p>
          </section>
        )}

        {selected ? (
          <div className="min-w-0 xl:col-span-2">
            <ProductOptionGroupsSection
              productId={selected.id}
              optionGroups={product_option_groups}
              onGroupsChange={reloadProductDetail}
            />
          </div>
        ) : null}

        {selected ? (
          <div className="min-w-0 xl:col-span-2">
            <ProductAdditionsSection
              additions={product_additions}
              productId={selected.id}
              onAdditionsChange={reloadProductDetail}
            />
          </div>
        ) : (
          <section className="grid h-fit min-w-0 content-start gap-4 rounded-xl border border-border bg-surface p-3 shadow-elevated sm:p-4 xl:col-start-2">
            <h2 className="m-0 font-heading text-2xl font-black text-foreground">
              Adiciones
            </h2>
            <p className="m-0 rounded-lg border border-dashed border-border bg-surface-muted p-4 text-sm font-bold text-muted-foreground">
              Guarda el producto para activar la gestión de adiciones.
            </p>
          </section>
        )}
      </div>
    </AdminDetailShell>
  );
}
