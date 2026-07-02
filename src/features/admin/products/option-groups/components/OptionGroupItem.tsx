import type {
  ProductOptionGroupRow,
  ProductOptionValueRow,
} from "@/features/admin/types/products.types";
import { OptionGroupHeader } from "./OptionGroupHeader";
import { OptionGroupOptionsList } from "./OptionGroupOptionsList";

interface OptionGroupItemProps {
  group: ProductOptionGroupRow & {
    product_option_values: ProductOptionValueRow[];
  };
  isExpanded: boolean;
  onToggle: () => void;
  onEditGroup: () => void;
  onDeleteGroup: () => void;
  onAddValue: () => void;
  onEditValue: (value: ProductOptionValueRow) => void;
  onDeleteValue: (value: ProductOptionValueRow) => void;
}

export function OptionGroupItem({
  group,
  isExpanded,
  onToggle,
  onEditGroup,
  onDeleteGroup,
  onAddValue,
  onEditValue,
  onDeleteValue,
}: OptionGroupItemProps) {
  return (
    <article className="grid gap-4 rounded-xl border border-border bg-surface-muted p-4 transition hover:border-primary/20">
      <OptionGroupHeader
        group={group}
        optionsCount={group.product_option_values.length}
        isExpanded={isExpanded}
        onToggle={onToggle}
        onEdit={onEditGroup}
        onDelete={onDeleteGroup}
      />
      {isExpanded && (
        <OptionGroupOptionsList
          options={group.product_option_values}
          onAdd={onAddValue}
          onEdit={onEditValue}
          onDelete={onDeleteValue}
        />
      )}
    </article>
  );
}
