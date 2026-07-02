import { Edit3, Trash2 } from "lucide-react";
import { OptionValueStatusDot } from "./OptionGroupBadges";
import type { ProductOptionValueRow } from "@/features/admin/types/products.types";

interface OptionItemProps {
  value: ProductOptionValueRow;
  onEdit: () => void;
  onDelete: () => void;
}

export function OptionItem({ value, onEdit, onDelete }: OptionItemProps) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-2.5 transition hover:border-primary/30 hover:bg-surface-raised">
      <span className="flex min-w-0 items-center gap-2 text-sm font-bold text-foreground">
        <OptionValueStatusDot isActive={value.is_active} />
        <span className="truncate">{value.name}</span>
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-surface-muted text-muted-foreground transition hover:border-primary hover:text-primary"
          onClick={onEdit}
          aria-label={`Editar ${value.name}`}
        >
          <Edit3 className="size-4" />
        </button>
        <button
          type="button"
          className="inline-flex size-8 items-center justify-center rounded-full border border-error-border bg-error-soft text-error transition hover:bg-error hover:text-error-foreground"
          onClick={onDelete}
          aria-label={`Eliminar ${value.name}`}
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </li>
  );
}
