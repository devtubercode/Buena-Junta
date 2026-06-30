import { Plus, Cookie, SearchX } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";

type AdditionEmptyStateProps = {
  type: "empty" | "no-results";
  onCreate?: () => void;
  onClearFilters?: () => void;
};

export function AdditionEmptyState({
  type,
  onCreate,
  onClearFilters,
}: AdditionEmptyStateProps) {
  if (type === "empty") {
    return (
      <EmptyState
        title="No hay adiciones"
        description="Crea la primera adición para ofrecer complementos en tu menú."
        icon={<Cookie className="size-8" />}
        action={
          <button
            type="button"
            onClick={onCreate}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-sm font-black text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="size-4" />
            Crear primera adición
          </button>
        }
      />
    );
  }

  return (
    <EmptyState
      title="Sin resultados"
      description="No encontramos adiciones que coincidan con tu búsqueda."
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
