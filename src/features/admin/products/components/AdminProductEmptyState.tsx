import { Link } from "react-router";
import { Plus, SearchX } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { appRoutes } from "@/app/routes";

type AdminProductEmptyStateProps = {
  type: "empty" | "no-results";
  onClearFilters?: () => void;
};

export function AdminProductEmptyState({
  type,
  onClearFilters,
}: AdminProductEmptyStateProps) {
  if (type === "empty") {
    return (
      <EmptyState
        title="No hay productos"
        description="Crea el primer producto para empezar a configurar tu menú."
        action={
          <Link
            to={`${appRoutes.adminProducts}/new`}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-sm font-black text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="size-4" />
            Crear primer producto
          </Link>
        }
      />
    );
  }

  return (
    <EmptyState
      title="Sin resultados"
      description="No encontramos productos que coincidan con tu búsqueda o filtro."
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
