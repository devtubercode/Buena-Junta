import type { CartItem } from "@/features/cart/types/cart.types";
import { formatCOP } from "@/features/cart/utils/money";

type CartItemDetailsProps = {
  item: CartItem;
};

export function CartItemDetails({ item }: CartItemDetailsProps) {
  const hasVariants = item.variantOptions && item.variantOptions.length > 0;
  const hasSelectedOptions =
    item.selectedOptions && Object.keys(item.selectedOptions).length > 0;
  const hasAdditions = item.additionOptions && item.additionOptions.length > 0;

  if (!hasVariants && !hasSelectedOptions && !hasAdditions) return null;

  return (
    <div className="mt-2.5 grid gap-2">
      {hasVariants ? (
        <div className="flex flex-wrap gap-1.5">
          {item.variantOptions?.map((variant) => (
            <span
              key={variant.key}
              className="inline-flex items-center rounded-full border border-primary-border bg-primary-soft px-2.5 py-1 text-xs font-black text-primary"
            >
              {variant.label}
            </span>
          ))}
        </div>
      ) : null}

      {hasSelectedOptions ? (
        <div className="rounded-lg border border-primary-border bg-primary-soft px-3 py-2">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {Object.entries(item.selectedOptions!).map(
              ([groupName, optionName]) => (
                <span
                  key={groupName}
                  className="text-xs font-black text-foreground"
                >
                  <span className="text-primary">{groupName}:</span>{" "}
                  {optionName}
                </span>
              ),
            )}
          </div>
        </div>
      ) : null}

      {hasAdditions ? (
        <div className="rounded-lg border border-border bg-surface-muted px-3 py-2">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
            Acompañantes
          </p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {item.additionOptions?.map((addition) => (
              <span
                key={addition.key}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-black text-foreground"
              >
                <span>{addition.label}</span>
                <span className="text-primary">
                  {formatCOP(addition.unitPrice)}
                </span>
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
