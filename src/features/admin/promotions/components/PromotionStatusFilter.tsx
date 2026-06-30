import { cn } from "@/shared/utils/cn";
import type { PromotionStatusFilter } from "@/features/admin/promotions/utils/promotionFilters";

const filterOptions: { value: PromotionStatusFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "active", label: "Activas" },
  { value: "scheduled", label: "Programadas" },
  { value: "expired", label: "Vencidas" },
  { value: "inactive", label: "Inactivas" },
];

type PromotionStatusFilterProps = {
  value: PromotionStatusFilter;
  onChange: (value: PromotionStatusFilter) => void;
};

export function PromotionStatusFilter({
  value,
  onChange,
}: PromotionStatusFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por estado">
      {filterOptions.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={cn(
              "inline-flex min-h-9 items-center rounded-full px-3.5 text-xs font-black transition",
              isActive
                ? "border border-primary bg-primary text-primary-foreground shadow-elevated"
                : "border border-border bg-surface text-muted-foreground hover:border-primary hover:text-primary",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
