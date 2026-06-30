import { PromotionStatusFilter } from "./PromotionStatusFilter";
import type { PromotionStatusFilter as PromotionStatusFilterValue } from "@/features/admin/promotions/utils/promotionFilters";

type PromotionsToolbarProps = {
  statusFilter: PromotionStatusFilterValue;
  onStatusFilterChange: (value: PromotionStatusFilterValue) => void;
  activeFiltersCount: number;
  onClearFilters: () => void;
  resultCount?: number;
};

export function PromotionsToolbar({
  statusFilter,
  onStatusFilterChange,
  activeFiltersCount,
  onClearFilters,
  resultCount,
}: PromotionsToolbarProps) {
  return (
    <div className="grid min-w-0 gap-4">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PromotionStatusFilter
          value={statusFilter}
          onChange={onStatusFilterChange}
        />

        {activeFiltersCount > 0 ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-full border border-border bg-surface px-4 text-sm font-black text-muted-foreground transition hover:border-primary hover:text-primary"
          >
            Limpiar filtros
          </button>
        ) : null}
      </div>

      {resultCount !== undefined ? (
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {resultCount}{" "}
          {resultCount === 1
            ? "promoción encontrada"
            : "promociones encontradas"}
        </div>
      ) : null}
    </div>
  );
}
