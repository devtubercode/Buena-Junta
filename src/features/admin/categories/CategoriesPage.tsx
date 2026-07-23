import { Plus } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { AdminSection } from "@/features/admin/shared/components/AdminSection";
import { CategoriesSkeleton } from "@/features/admin/shared/state/AdminSkeletons";
import { useCategoryFilters } from "@/features/admin/categories/hooks/useCategoryFilters";
import { CategoriesToolbar } from "@/features/admin/categories/components/CategoriesToolbar";
import { CategoryEmptyState } from "@/features/admin/categories/components/CategoryEmptyState";
import { useAdminResource } from "../shared/hooks/useAdminResource";
import type { CategoryRow } from "../types/categories.types";
import {
  deleteCategory,
  fetchAdminCategories,
} from "./services/admin-categories.service";
import { useAdminDeleteConfirm } from "../shared/hooks/useAdminDeleteConfirm";
import { CategoryCard } from "./components/CategoryCard";
import { useAdminCrudModal } from "../shared/hooks/useAdminCrudModal";
import { CategoryForm } from "./components/CategoryForm";
import { EmptyState } from "@/shared/components/EmptyState";

export const CategoriesPage = () => {
  const {
    data: categories,
    setData: setCategories,
    isLoading,
    error,
  } = useAdminResource<CategoryRow[]>(fetchAdminCategories, []);

  const categoryModal = useAdminCrudModal<CategoryRow>();

  const { searchQuery, setSearchQuery, filteredCategories } =
    useCategoryFilters(categories);

  const { confirmDelete, ConfirmDialog: CategoryDeleteDialog } =
    useAdminDeleteConfirm();

  const handleDelete = async (category: CategoryRow) => {
    const deleted = await confirmDelete({
      item: category,
      deleteFn: deleteCategory,
      id: category.id,
      itemLabel: "Categoría",
    });
    if (!deleted) return;
    setCategories((prev) => prev.filter((c) => c.id !== category.id));
  };

  const clearFilters = () => setSearchQuery("");

  const handleCategorySaved = (savedCategory: CategoryRow) => {
    if (categoryModal.selected === null) {
      setCategories([...categories, { ...savedCategory }]);
      categoryModal.close();
      return;
    }

    const getGroupsUpdated = categories.map((category) => {
      if (category.id === savedCategory.id) {
        return savedCategory;
      }

      return category;
    });
    setCategories(getGroupsUpdated);
    categoryModal.close();
  };
  if (error)
    return (
      <EmptyState
        title="No se pudieron cargar los datos"
        description={error.message}
      />
    );

  if (isLoading) {
    return <CategoriesSkeleton />;
  }

  const hasCategories = categories.length > 0;
  const hasFilteredCategories = filteredCategories.length > 0;

  return (
    <AdminSection
      title="Categorías"
      description="Crea y edita las categorías públicas del menú."
      actions={
        <Button
          type="button"
          variant="primary"
          radius="full"
          onClick={categoryModal.openNew}
          icon={<Plus className="size-4" />}
        >
          Nueva categoría
        </Button>
      }
    >
      {hasCategories && (
        <CategoriesToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          resultCount={filteredCategories.length}
        />
      )}

      {!hasCategories ? (
        <CategoryEmptyState type="empty" onCreate={categoryModal.openNew} />
      ) : !hasFilteredCategories ? (
        <CategoryEmptyState type="no-results" onClearFilters={clearFilters} />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={categoryModal.openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
      {categoryModal.isOpen && (
        <CategoryForm
          category={categoryModal.selected}
          onCloseModal={categoryModal.close}
          onSuccessSaved={handleCategorySaved}
        />
      )}

      <CategoryDeleteDialog />
    </AdminSection>
  );
};
