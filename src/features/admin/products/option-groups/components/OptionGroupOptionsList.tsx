import { useMemo } from "react";
import { Plus } from "lucide-react";
import type { ProductOptionValueRow } from "@/features/admin/types/products.types";
import { OptionItem } from "./OptionItem";

interface OptionGroupOptionsListProps {
  options: ProductOptionValueRow[];
  onAdd: () => void;
  onEdit: (value: ProductOptionValueRow) => void;
  onDelete: (value: ProductOptionValueRow) => void;
}

export function OptionGroupOptionsList({
  options,
  onAdd,
  onEdit,
  onDelete,
}: OptionGroupOptionsListProps) {
  const sortedOptions = useMemo(
    () => [...options].sort((a, b) => a.name.localeCompare(b.name)),
    [options],
  );

  return (
    <div className="grid gap-3">
      {sortedOptions.length > 0 ? (
        <ul className="grid max-h-[280px] gap-2 overflow-y-auto pr-1">
          {sortedOptions.map((optionValue) => (
            <OptionItem
              key={optionValue.id}
              value={optionValue}
              onEdit={() => onEdit(optionValue)}
              onDelete={() => onDelete(optionValue)}
            />
          ))}
        </ul>
      ) : (
        <p className="m-0 rounded-lg border border-dashed border-border bg-surface p-4 text-center text-xs font-bold text-muted-foreground">
          Este grupo aún no tiene opciones.
        </p>
      )}

      <button
        type="button"
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border bg-surface px-4 text-xs font-black text-muted-foreground transition hover:border-primary hover:text-primary"
        onClick={onAdd}
      >
        <Plus className="size-4" />
        Agregar opción
      </button>
    </div>
  );
}
