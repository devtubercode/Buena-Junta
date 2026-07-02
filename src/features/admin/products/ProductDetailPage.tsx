import { Link, useParams } from "react-router";
import { appRoutes } from "@/app/routes";
import { AdminProductDetailSkeleton } from "@/features/admin/shared/state/AdminSkeletons";
import { AdminNotFoundState } from "@/features/admin/shared/state/AdminNotFoundState";
import { useCategoriesData } from "@/features/admin/categories/hooks/useCategoriesData";
import { ProductForm } from "@/features/admin/products/components/ProductForm";
import { ProductOptionGroupsSection } from "@/features/admin/products/option-groups/ProductOptionGroupsSection";
import { ProductVariantsSection } from "@/features/admin/products/variants/ProductVariantsSection";
import { ProductAdditionsSection } from "@/features/admin/products/additions/ProductAdditionsSection";
import { EmptyState } from "@/shared/components/EmptyState";
import { AdminSection } from "../shared/components/AdminSection";
import { ArrowLeft } from "lucide-react";
import { useCallback } from "react";
import type { AdminProductDetailData } from "../types/products.types";
import { fetchAdminProductDetail } from "./services/admin-products.service";
import { useAdminResource } from "../shared/hooks/useAdminResource";

const emptyProductDetail: AdminProductDetailData = {
  product: null,
  product_variants: [],
  product_additions: [],
  product_option_groups: [],
};

export const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();

  const isNewProduct = !slug || slug === "new";

  const fetchProductDetail = useCallback(() => {
    if (isNewProduct) return Promise.resolve(emptyProductDetail);
    return fetchAdminProductDetail(slug!);
  }, [slug, isNewProduct]);

  const {
    data: productDetail,
    setData: setProductDetail,
    isLoading: isLoadingProductDetail,
    error: productDetailError,
  } = useAdminResource(fetchProductDetail, emptyProductDetail, {
    enabled: Boolean(slug) && slug !== "new",
  });

  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useCategoriesData();

  const isLoading = isLoadingProductDetail || isLoadingCategories;
  const error = productDetailError ?? categoriesError;

  if (error) {
    return (
      <EmptyState
        title="No se pudieron cargar los datos"
        description={error.message}
      />
    );
  }

  if (isLoading) {
    return <AdminProductDetailSkeleton />;
  }

  if (!isNewProduct && !productDetail.product) {
    return (
      <AdminNotFoundState
        title="Producto no encontrado"
        description="No se encontró un producto con ese identificador."
        backTo={appRoutes.adminProducts}
      />
    );
  }

  return (
    <AdminSection
      title={isNewProduct ? "Nuevo producto" : productDetail.product!.name}
      description={
        "Gestiona la información, imagen, acompañantes y variantes de este producto."
      }
      actions={
        <Link
          to={appRoutes.adminProducts}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-black text-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ArrowLeft className="size-4" />
          Volver
        </Link>
      }
    >
      <div className="grid min-w-0 max-w-full gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(500px,0.46fr)]">
        <ProductForm
          categories={categories}
          selectedProduct={productDetail.product}
        />

        <div className="flex flex-col gap-2">
          {productDetail.product ? (
            <div className="min-w-0 xl:col-start-2">
              <ProductVariantsSection
                productId={productDetail.product.id}
                variants={productDetail.product_variants}
                setProductDetail={setProductDetail}
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
          {productDetail.product ? (
            <div className="min-w-0 xl:col-span-2">
              <ProductAdditionsSection
                additions={productDetail.product_additions}
                productId={productDetail.product.id}
                setProductDetail={setProductDetail}
              />
            </div>
          ) : (
            <section className="grid h-fit min-w-0 content-start gap-4 rounded-xl border border-border bg-surface p-3 shadow-elevated sm:p-4 ">
              <h2 className="m-0 font-heading text-2xl font-black text-foreground">
                Adiciones
              </h2>
              <p className="m-0 rounded-lg border border-dashed border-border bg-surface-muted p-4 text-sm font-bold text-muted-foreground">
                Guarda el producto para activar la gestión de adiciones.
              </p>
            </section>
          )}

          {productDetail.product ? (
            <div className="min-w-0 xl:col-span-2">
              <ProductOptionGroupsSection
                productId={productDetail.product.id}
                optionGroups={productDetail.product_option_groups}
                setProductDetail={setProductDetail}
              />
            </div>
          ) : (
            <section className="grid h-fit min-w-0 content-start gap-4 rounded-xl border border-border bg-surface p-3 shadow-elevated sm:p-4 xl:col-start-2">
              <h2 className="m-0 font-heading text-2xl font-black text-foreground">
                Grupos de opciones
              </h2>
              <p className="m-0 rounded-lg border border-dashed border-border bg-surface-muted p-4 text-sm font-bold text-muted-foreground">
                Guarda el producto para activar la gestión de grupos de
                opciones.
              </p>
            </section>
          )}
        </div>
      </div>
    </AdminSection>
  );
};
