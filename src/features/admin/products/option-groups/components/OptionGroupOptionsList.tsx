import { useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/shared/components/Button";
import type { ProductOptionValueRow } from "@/features/admin/types/products.types";
import { OptionItem } from "./OptionItem";

interface OptionGroupOptionsListProps {
  options: ProductOptionValueRow[];
  onAdd: () => void;
  onEdit: (value: ProductOptionValueRow) => void;
  onDelete: (value: ProductOptionValueRow) => void;
}

export const OptionGroupOptionsList = ({
  options,
  onAdd,
  onEdit,
  onDelete,
}: OptionGroupOptionsListProps) => {
  const sortedOptions = useMemo(
    () => [...options].sort((a, b) => a.name.localeCompare(b.name)),
    [options],
  );

  return (
    <div className="grid gap-3">
      {sortedOptions.length > 0 ? (
        <ul className="grid max-h-70 gap-2 overflow-y-auto pr-1">
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

      <Button
        type="button"
        variant="outline"
        radius="full"
        size="sm"
        onClick={onAdd}
        icon={<Plus className="size-4" />}
      >
        Agregar opción
      </Button>
    </div>
  );
};
