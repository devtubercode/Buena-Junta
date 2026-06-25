import type { MenuAddition } from "@/features/menu/types/menu.types";
import { formatCOP } from "@/features/cart/utils/money";
import { cn } from "@/shared/utils/cn";

type AdditionSelectorProps = {
  additions: MenuAddition[];
  selectedAdditions: MenuAddition[];
  onToggle: (addition: MenuAddition) => void;
};

export function AdditionSelector({
  additions,
  selectedAdditions,
  onToggle,
}: AdditionSelectorProps) {
  if (additions.length === 0) return null;

  return (
    <section className="grid gap-3">
      <h3 className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
        Acompañantes
      </h3>
      <div className="grid gap-2">
        {additions.map((addition) => {
          const isSelected = selectedAdditions.some(
            (selected) => selected.id === addition.id,
          );

          return (
            <button
              key={addition.id}
              type="button"
              data-selected={isSelected}
              onClick={() => onToggle(addition)}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left transition",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                isSelected
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border bg-surface text-foreground hover:border-primary-border",
              )}
            >
              <span className="text-sm font-black">{addition.name}</span>
              <span className="shrink-0 text-sm font-black text-primary">
                +{formatCOP(addition.price)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
