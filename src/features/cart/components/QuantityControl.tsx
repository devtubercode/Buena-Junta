import { cn } from "@/shared/utils/cn";

type QuantityControlProps = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onChange?: (quantity: number) => void;
  compact?: boolean;
};

export function QuantityControl({
  quantity,
  onIncrement,
  onDecrement,
  onChange,
  compact = false,
}: QuantityControlProps) {
  return (
    <div
      className={cn(
        "inline-grid overflow-hidden rounded-lg border border-border bg-surface",
        compact ? "grid-cols-[40px_48px_40px]" : "grid-cols-[44px_54px_44px]",
      )}
    >
      <button
        type="button"
        className={cn(
          "text-lg font-black text-primary transition hover:bg-primary-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary",
          compact ? "min-h-10" : "min-h-11",
        )}
        aria-label="Disminuir cantidad"
        onClick={onDecrement}
      >
        -
      </button>
      <input
        type="number"
        min={1}
        value={quantity}
        className={cn(
          "border-x border-border bg-surface text-center text-sm font-black text-foreground outline-none",
          compact ? "min-h-10" : "min-h-11",
        )}
        aria-label="Cantidad"
        onChange={(event) => onChange?.(Number(event.target.value))}
      />
      <button
        type="button"
        className={cn(
          "text-lg font-black text-primary transition hover:bg-primary-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary",
          compact ? "min-h-10" : "min-h-11",
        )}
        aria-label="Aumentar cantidad"
        onClick={onIncrement}
      >
        +
      </button>
    </div>
  );
}
