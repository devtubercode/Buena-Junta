import type { AdditionRow } from "@/features/admin/types/additions.types";
import { formatCOP } from "@/features/cart/utils/money";
import { cn } from "@/shared/utils/cn";

type AdditionSelectorProps = {
  additions: AdditionRow[];
  selectedAdditions: AdditionRow[];
  onToggle: (addition: AdditionRow) => void;
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function AdditionSelector({
  additions,
  selectedAdditions,
  onToggle,
}: AdditionSelectorProps) {
  if (additions.length === 0) return null;

  return (
    <section className="grid gap-2">
      <h3 className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
        Elegir Acompañantes
      </h3>

      <div role="group" aria-label="Acompañantes" className="grid gap-2">
        {additions.map((addition) => {
          const isSelected = selectedAdditions.some(
            (selected) => selected.id === addition.id,
          );

          return (
            <button
              key={addition.id}
              type="button"
              role="checkbox"
              aria-checked={isSelected}
              data-selected={isSelected}
              onClick={() => onToggle(addition)}
              className={cn(
                "flex items-center justify-between gap-3 rounded-xl border-2 px-4 py-2.5 text-left transition",
                "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                isSelected
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border bg-surface text-foreground hover:border-primary/50",
              )}
            >
              <span className="flex items-center gap-3">
                <span
                  className={cn(
                    "inline-flex size-5 shrink-0 items-center justify-center rounded border transition",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface",
                  )}
                >
                  {isSelected ? <CheckIcon className="h-3.5 w-3.5" /> : null}
                </span>
                <span className="text-sm font-black">{addition.name}</span>
              </span>
              <span className="shrink-0 text-xs font-black text-primary">
                +{formatCOP(addition.price)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
