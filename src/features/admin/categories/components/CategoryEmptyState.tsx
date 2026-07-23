import { Plus, SearchX, Folder } from "lucide-react";
import { Button } from "@/shared/components/Button";
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
          <Button
            type="button"
            variant="primary"
            radius="full"
            onClick={onCreate}
            icon={<Plus className="size-4" />}
          >
            Crear primera categoría
          </Button>
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
        <Button
          type="button"
          variant="outline"
          radius="full"
          onClick={onClearFilters}
          icon={<SearchX className="size-4" />}
        >
          Limpiar filtros
        </Button>
      }
    />
  );
}
