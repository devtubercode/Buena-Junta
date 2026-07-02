import { Plus, Save, X } from "lucide-react";
import { AdminDataState } from "@/features/admin/shared/state/AdminDataState";
import { AdminSection } from "@/features/admin/shared/components/AdminSection";
import { AdminCategoriesSkeleton } from "@/features/admin/shared/state/AdminSkeletons";
import { useCategoriesData } from "@/features/admin/categories/hooks/useCategoriesData";
import { useAdminCategoryFilters } from "@/features/admin/categories/hooks/useAdminCategoryFilters";
import { useAdminCategoryDelete } from "@/features/admin/categories/hooks/useAdminCategoryDelete";
import { useAdminCategoryForm } from "@/features/admin/categories/hooks/useAdminCategoryForm";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";
import { InputField } from "@/shared/components/InputField";
import { TextAreaField } from "@/shared/components/TextAreaField";
import { CategoriesToolbar } from "@/features/admin/categories/components/CategoriesToolbar";
import { CategoryList } from "@/features/admin/categories/components/CategoryList";
import { CategoryEmptyState } from "@/features/admin/categories/components/CategoryEmptyState";

export function CategoriesPage() {
  const { data: categories, isLoading, error, reload } = useCategoriesData();

  const {
    searchQuery,
    setSearchQuery,
    filteredCategories,
    activeFiltersCount,
  } = useAdminCategoryFilters(categories);

  const { handleDelete, ConfirmDialog: CategoryDeleteDialog } =
    useAdminCategoryDelete(reload);

  const {
    form,
    isSaving,
    selected,
    isOpen,
    openNew,
    openEdit,
    close,
    onSubmit,
  } = useAdminCategoryForm(reload);

  const clearFilters = () => {
    setSearchQuery("");
  };

  if (error) {
    return <AdminDataState isLoading={false} error={error} />;
  }

  if (isLoading) {
    return (
      <AdminSection
        title="Categorías"
        description="Crea y edita las categorías públicas del menú."
      >
        <AdminCategoriesSkeleton />
      </AdminSection>
    );
  }

  const hasCategories = categories.length > 0;
  const hasFilteredCategories = filteredCategories.length > 0;

  return (
    <AdminSection
      title="Categorías"
      description="Crea y edita las categorías públicas del menú."
      actions={
        <button
          type="button"
          onClick={openNew}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90"
        >
          <Plus className="size-4" />
          Nueva categoría
        </button>
      }
    >
      {hasCategories ? (
        <CategoriesToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFiltersCount={activeFiltersCount}
          onClearFilters={clearFilters}
          resultCount={filteredCategories.length}
        />
      ) : null}

      {!hasCategories ? (
        <CategoryEmptyState type="empty" onCreate={openNew} />
      ) : !hasFilteredCategories ? (
        <CategoryEmptyState type="no-results" onClearFilters={clearFilters} />
      ) : (
        <CategoryList
          categories={filteredCategories}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
      )}

      <ButtonSheetModal
        isOpen={isOpen}
        title={selected ? "Editar categoría" : "Nueva categoría"}
        description={
          selected
            ? "Actualiza los datos de la categoría seleccionada."
            : "Completa los datos para crear una nueva categoría."
        }
        contentClassName="max-w-lg"
        onClose={close}
      >
        <form className="grid gap-4" onSubmit={onSubmit} noValidate>
          <InputField
            name="name"
            control={form.control}
            label="Nombre"
            placeholder="Ej: Hamburguesas"
            autoComplete="off"
          />

          <InputField
            name="slug"
            control={form.control}
            label="Slug"
            placeholder="Ej: hamburguesas"
            autoComplete="off"
          />

          <TextAreaField
            name="description"
            control={form.control}
            label="Descripción"
            placeholder="Descripción opcional de la categoría"
          />

          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 disabled:opacity-60"
            >
              <Save className="size-4" />
              {isSaving ? "Guardando" : "Guardar"}
            </button>
            <button
              type="button"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-black text-muted-foreground transition hover:border-primary hover:text-primary"
              onClick={close}
            >
              <X className="size-4" />
              Cancelar
            </button>
          </div>
        </form>
      </ButtonSheetModal>

      <CategoryDeleteDialog />
    </AdminSection>
  );
}
