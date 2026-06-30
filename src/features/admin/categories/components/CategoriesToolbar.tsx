import { SearchInput } from "@/shared/components/SearchInput";

type CategoriesToolbarProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeFiltersCount: number;
  onClearFilters: () => void;
  resultCount?: number;
};

export function CategoriesToolbar({
  searchQuery,
  onSearchChange,
  activeFiltersCount,
  onClearFilters,
  resultCount,
}: CategoriesToolbarProps) {
  return (
    <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Buscar por nombre..."
          label="Buscar categoría"
        />
      </div>
      {activeFiltersCount > 0 ? (
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-black text-muted-foreground transition hover:border-primary hover:text-primary"
        >
          Limpiar filtros
        </button>
      ) : null}

      {resultCount !== undefined ? (
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {resultCount} {resultCount === 1 ? "categoría encontrada" : "categorías encontradas"}
        </div>
      ) : null}
    </div>
  );
}
