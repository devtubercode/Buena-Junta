import { Link } from "react-router";
import { Plus } from "lucide-react";
import { appRoutes } from "@/app/routes";

import { AdminSection } from "@/features/admin/shared/components/AdminSection";
import { ProductsSkeleton } from "@/features/admin/shared/state/AdminSkeletons";
import { SearchInput } from "@/shared/components/SearchInput";

import { useAdminProductsFilters } from "@/features/admin/products/hooks/useAdminProductsFilters";
import { AdminProductCategoryFilter } from "@/features/admin/products/components/AdminProductCategoryFilter";
import { AdminProductEmptyState } from "@/features/admin/products/components/AdminProductEmptyState";
import { useAdminResource } from "../shared/hooks/useAdminResource";

import {
  deleteProduct,
  fetchAdminProductsList,
} from "./services/admin-products.service";
import type { AdminProductListRow } from "../types/products.types";
import { useAdminDeleteConfirm } from "../shared/hooks/useAdminDeleteConfirm";
import { AdminProductCard } from "./components/AdminProductCard";
import type { CategoryRow } from "../types/categories.types";
import { fetchAdminCategories } from "../categories/services/admin-categories.service";
import { EmptyState } from "@/shared/components/EmptyState";

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
  } = useAdminResource<CategoryRow[]>(fetchAdminCategories, []);

  const {
    searchQuery,
    setSearchQuery,
    selectedCategoryId,
    setSelectedCategoryId,
    filteredProducts,
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
  const hasProducts = products.length > 0;
  const hasFilteredProducts = filteredProducts.length > 0;

  if (error) {
    return (
      <EmptyState
        title="No se pudieron cargar los datos"
        description={error.message}
      />
    );
  }

  if (isLoading) return <ProductsSkeleton />;

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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
          {filteredProducts.map((product) => (
            <AdminProductCard
              key={product.id}
              product={product}
              onDelete={onDeleteProduct}
            />
          ))}
        </div>
      )}

      <ConfirmProductDeleteDialog />
    </AdminSection>
  );
};
