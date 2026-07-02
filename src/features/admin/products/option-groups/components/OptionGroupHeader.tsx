import { Edit3, Trash2, ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { RequirementBadge, ActiveBadge } from "./OptionGroupBadges";
import type { ProductOptionGroupRow } from "@/features/admin/types/products.types";

interface OptionGroupHeaderProps {
  group: ProductOptionGroupRow;
  optionsCount: number;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function OptionGroupHeader({
  group,
  optionsCount,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
}: OptionGroupHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div
        className="flex min-w-0 flex-1 cursor-pointer items-start gap-2"
        onClick={onToggle}
        role="button"
        aria-expanded={isExpanded}
        tabIndex={0}
        aria-label={`${isExpanded ? "Colapsar" : "Expandir"} grupo ${group.name}`}
      >
        <div className="min-w-0 flex-1">
          <h3 className="m-0 truncate font-heading text-base font-black text-foreground">
            {group.name}
          </h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <RequirementBadge isRequired={group.is_required} />
            <ActiveBadge isActive={group.is_active} />
            <span className="inline-flex items-center rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-muted-foreground">
              {optionsCount} opción{optionsCount === 1 ? "" : "es"}
            </span>
          </div>
        </div>
        <div
          className={cn(
            "mt-1 shrink-0 transition-transform duration-200",
            isExpanded && "rotate-180",
          )}
        >
          <ChevronDown className="size-4 text-muted-foreground" />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition hover:border-primary hover:text-primary"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          aria-label={`Editar ${group.name}`}
        >
          <Edit3 className="size-4" />
        </button>
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-full border border-error-border bg-error-soft text-error transition hover:bg-error hover:text-error-foreground"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label={`Eliminar ${group.name}`}
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}
