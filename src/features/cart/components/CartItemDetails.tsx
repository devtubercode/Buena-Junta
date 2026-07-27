import { useState } from "react";
import type { CartItem } from "@/features/cart/types/cart.types";
import { formatCOP } from "@/features/cart/utils/money";
import { cn } from "@/shared/utils/cn";

type CartItemDetailsProps = {
  item: CartItem;
};

const VISIBLE_ADDITIONS = 3;

export function CartItemDetails({ item }: CartItemDetailsProps) {
  const [showAllAdditions, setShowAllAdditions] = useState(false);

  const variantLabel = item.variantId
    ? item.variantOptions?.find((v) => v.key === item.variantId)?.label
    : undefined;
  const selectedOptions = item.selectedOptions;
  const additions = item.additionOptions ?? [];

  const hasOptions = selectedOptions && Object.keys(selectedOptions).length > 0;
  const hasAdditions = additions.length > 0;

  if (!variantLabel && !hasOptions && !hasAdditions) {
    return null;
  }

  const visibleAdditions = showAllAdditions
    ? additions
    : additions.slice(0, VISIBLE_ADDITIONS);
  const hiddenCount = Math.max(0, additions.length - VISIBLE_ADDITIONS);

  return (
    <div className={cn("mt-2 flex flex-col gap-2")}>
      {(variantLabel || hasOptions) && (
        <div className="flex flex-wrap items-center gap-1.5">
          {variantLabel && (
            <span className="inline-flex items-center rounded-full border border-primary-border bg-primary-soft px-2.5 py-1 text-xs font-black text-primary">
              {variantLabel}
            </span>
          )}

          {hasOptions &&
            Object.entries(selectedOptions!).map(([group, value]) => (
              <span
                key={group}
                className="inline-flex items-center rounded-full border border-border bg-surface-muted px-2.5 py-1 text-xs font-black text-foreground"
              >
                <span className="text-muted-foreground">{group}:</span>
                <span className="ml-1">{value}</span>
              </span>
            ))}
        </div>
      )}

      {hasAdditions && (
        <div className="rounded-xl border border-border bg-surface-muted px-2.5 py-2">
          <p className="mb-1.5 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
            Acompañantes
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {visibleAdditions.map((addition) => (
              <span
                key={addition.key}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-black text-foreground"
              >
                <span>{addition.label}</span>
                <span className="text-primary">
                  {formatCOP(addition.unitPrice)}
                </span>
              </span>
            ))}

            {hiddenCount > 0 && !showAllAdditions && (
              <button
                type="button"
                onClick={() => setShowAllAdditions(true)}
                className="inline-flex items-center rounded-full border border-dashed border-border bg-surface px-2.5 py-1 text-xs font-black text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-expanded={false}
                aria-label={`Mostrar ${hiddenCount} acompañantes más`}
              >
                +{hiddenCount} más
              </button>
            )}

            {showAllAdditions && hiddenCount > 0 && (
              <button
                type="button"
                onClick={() => setShowAllAdditions(false)}
                className="inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-black text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-expanded={true}
                aria-label="Mostrar menos acompañantes"
              >
                Ver menos
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
