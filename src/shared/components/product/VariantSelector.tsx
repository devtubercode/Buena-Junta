import type { MenuPriceVariant } from "@/features/menu/types/menu.types";
import { formatCOP } from "@/features/cart/utils/money";
import { cn } from "@/shared/utils/cn";

type VariantSelectorProps = {
  variants: MenuPriceVariant[];
  selectedVariant: MenuPriceVariant | null;
  onSelect: (variant: MenuPriceVariant) => void;
};

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function VariantSelector({
  variants,
  selectedVariant,
  onSelect,
}: VariantSelectorProps) {
  if (variants.length === 0) return null;

  return (
    <section className="grid gap-2">
      <h3 className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
        Elegir Presentación
        <span aria-hidden="true" className="ml-1 text-primary">
          *
        </span>
      </h3>

      <div className="relative">
        <select
          value={selectedVariant?.label ?? ""}
          onChange={(event) => {
            const variant = variants.find(
              (item) => item.label === event.target.value,
            );
            if (variant) onSelect(variant);
          }}
          className={cn(
            "min-h-11 w-full appearance-none rounded-xl border-2 bg-surface px-4 py-2.5 text-sm font-black text-foreground transition",
            "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
            selectedVariant
              ? "border-primary"
              : "border-border hover:border-primary/50",
          )}
        >
          <option value="" disabled>
            Selecciona una presentación
          </option>
          {variants.map((variant) => (
            <option key={variant.label} value={variant.label}>
              {variant.label} — {formatCOP(variant.price)}
            </option>
          ))}
        </select>
        <ChevronIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
      </div>
    </section>
  );
}
