import { Plus, Cookie, SearchX } from "lucide-react";
import { Button } from "@/shared/components/Button";
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
          <Button
            type="button"
            variant="primary"
            radius="full"
            onClick={onCreate}
            icon={<Plus className="size-4" />}
          >
            Crear primera adición
          </Button>
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
