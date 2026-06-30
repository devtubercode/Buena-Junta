import { Link } from "react-router";
import { Plus, SearchX, TicketPercent } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";
import { appRoutes } from "@/app/routes";

type PromotionEmptyStateProps = {
  type: "empty" | "no-results";
  onClearFilters?: () => void;
};

export function PromotionEmptyState({
  type,
  onClearFilters,
}: PromotionEmptyStateProps) {
  if (type === "empty") {
    return (
      <EmptyState
        title="No hay promociones"
        description="Crea la primera promoción para empezar a ofrecer ofertas."
        icon={<TicketPercent className="size-8" />}
        action={
          <Link
            to={`${appRoutes.adminPromotions}/nueva`}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-sm font-black text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="size-4" />
            Crear primera promoción
          </Link>
        }
      />
    );
  }

  return (
    <EmptyState
      title="Sin resultados"
        description="No encontramos promociones que coincidan con el filtro seleccionado."
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
