import type { MenuPriceOption } from "@/features/menu/types/menu.types";
import { formatCOP } from "@/features/cart/utils/money";
import { cn } from "@/shared/utils/cn";

type VariantSelectorProps = {
  variants: MenuPriceOption[];
  selectedVariant: MenuPriceOption | null;
  onSelect: (variant: MenuPriceOption) => void;
};

export function VariantSelector({
  variants,
  selectedVariant,
  onSelect,
}: VariantSelectorProps) {
  if (variants.length === 0) return null;

  return (
    <section className="grid gap-3">
      <h3 className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
        Presentación
        <span className="ml-1 text-primary">*</span>
      </h3>
      <div className="grid gap-2">
        {variants.map((variant) => {
          const isSelected = selectedVariant?.label === variant.label;

          return (
            <button
              key={variant.label}
              type="button"
              data-selected={isSelected}
              onClick={() => onSelect(variant)}
              className={cn(
                "flex items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left transition",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                isSelected
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border bg-surface text-foreground hover:border-primary-border",
              )}
            >
              <span className="text-sm font-black">{variant.label}</span>
              <span className="shrink-0 text-sm font-black text-primary">
                {formatCOP(variant.price)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
