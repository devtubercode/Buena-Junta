import { Link } from "react-router";
import { Plus } from "lucide-react";
import { appRoutes } from "@/app/routes";
import { AdminDataState } from "@/features/admin/shared/state/AdminDataState";
import { AdminSection } from "@/features/admin/shared/components/AdminSection";
import { AdminProductsSkeleton } from "@/features/admin/shared/state/AdminSkeletons";
import { SearchInput } from "@/shared/components/SearchInput";

import { useCategoriesData } from "@/features/admin/categories/hooks/useCategoriesData";
import { useAdminProductsFilters } from "@/features/admin/products/hooks/useAdminProductsFilters";
import { AdminProductCategoryFilter } from "@/features/admin/products/components/AdminProductCategoryFilter";
import { AdminProductList } from "@/features/admin/products/components/AdminProductList";
import { AdminProductEmptyState } from "@/features/admin/products/components/AdminProductEmptyState";
import { useAdminResource } from "../shared/hooks/useAdminResource";

import {
  deleteProduct,
  fetchAdminProductsList,
} from "./services/admin-products.service";
import type { AdminProductListRow } from "../types/products.types";
import { useAdminDeleteConfirm } from "../shared/hooks/useAdminDeleteConfirm";

export const ProductsPage = () => {
  const {
    data: products,
    setData: setProducts,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useAdminResource<AdminProductListRow[]>(fetchAdminProductsList, []);

  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useCategoriesData();

  const {
    searchQuery,
    setSearchQuery,
    selectedCategoryId,
    setSelectedCategoryId,
    filteredProducts,
    activeFiltersCount,
  } = useAdminProductsFilters(products);

  const { confirmDelete, ConfirmDialog: ConfirmProductDeleteDialog } =
    useAdminDeleteConfirm();

  const onDeleteProduct = async (product: AdminProductListRow) => {
    const deleted = await confirmDelete<AdminProductListRow>({
      item: product,
      deleteFn: deleteProduct,
      id: product.id,
      itemLabel: "Producto",
    });

    if (deleted) {
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategoryId(null);
  };

  const isLoading = isLoadingProducts || isLoadingCategories;
  const error = productsError ?? categoriesError;

  if (error) {
    return <AdminDataState isLoading={false} error={error} />;
  }

  if (isLoading) {
    return (
      <AdminSection
        title="Productos"
        description="Consulta productos del menú y entra a cada producto para editar su información, imagen y variantes."
      >
        <AdminProductsSkeleton />
      </AdminSection>
    );
  }

  const hasProducts = products.length > 0;
  const hasFilteredProducts = filteredProducts.length > 0;

  return (
    <AdminSection
      title="Productos"
      description="Consulta productos del menú y entra a cada producto para editar su información, imagen y variantes."
      actions={
        <Link
          to={`${appRoutes.adminProducts}/new`}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90"
        >
          <Plus className="size-4" />
          Nuevo
        </Link>
      }
    >
      {hasProducts ? (
        <div className="grid min-w-0 gap-4">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Buscar por nombre..."
                label="Buscar producto"
              />
            </div>
            {activeFiltersCount > 0 ? (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-black text-muted-foreground transition hover:border-primary hover:text-primary"
              >
                Limpiar filtros
              </button>
            ) : null}
          </div>

          <AdminProductCategoryFilter
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onChange={setSelectedCategoryId}
          />
        </div>
      ) : null}

      {!hasProducts ? (
        <AdminProductEmptyState type="empty" />
      ) : !hasFilteredProducts ? (
        <AdminProductEmptyState
          type="no-results"
          onClearFilters={clearFilters}
        />
      ) : (
        <AdminProductList
          products={filteredProducts}
          onDelete={onDeleteProduct}
        />
      )}

      <ConfirmProductDeleteDialog />
    </AdminSection>
  );
};
