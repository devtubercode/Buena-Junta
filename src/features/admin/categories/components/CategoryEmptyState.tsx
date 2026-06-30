import { Plus, SearchX, Folder } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";

type CategoryEmptyStateProps = {
  type: "empty" | "no-results";
  onCreate?: () => void;
  onClearFilters?: () => void;
};

export function CategoryEmptyState({
  type,
  onCreate,
  onClearFilters,
}: CategoryEmptyStateProps) {
  if (type === "empty") {
    return (
      <EmptyState
        title="No hay categorías"
        description="Crea la primera categoría para organizar tu menú."
        icon={<Folder className="size-8" />}
        action={
          <button
            type="button"
            onClick={onCreate}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-sm font-black text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="size-4" />
            Crear primera categoría
          </button>
        }
      />
    );
  }

  return (
    <EmptyState
      title="Sin resultados"
      description="No encontramos categorías que coincidan con tu búsqueda."
      icon={<SearchX className="size-8" />}
      action={
        <button
          type="button"
          onClick={onClearFilters}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-black text-muted-foreground transition hover:border-primary hover:text-primary"
        >
          <SearchX className="size-4" />
          Limpiar filtros
        </button>
      }
    />
  );
}
