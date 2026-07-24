import { Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/shared/utils/cn";

type QuantityStepperProps = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onChange?: (quantity: number) => void;
  onRemove?: () => void;
  itemName?: string;
  size?: "sm" | "md";
  className?: string;
};

export function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  onRemove,
  itemName,
  size = "md",
  className,
}: QuantityStepperProps) {
  const isAtMin = onRemove && quantity <= 1;
  const DecrementIcon = isAtMin ? Trash2 : Minus;
  const handleDecrement = isAtMin ? onRemove : onDecrement;
  const decrementLabel = isAtMin
    ? `Eliminar ${itemName ?? "producto"}`
    : `Disminuir cantidad de ${itemName ?? "producto"}`;

  return (
    <div
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded-lg border border-border bg-surface",
        size === "sm" ? "h-9" : "h-11",
        className,
      )}
    >
      <button
        type="button"
        onClick={handleDecrement}
        className="flex aspect-square items-center justify-center transition hover:bg-primary-soft focus-visible:outline focus-visible:outline-primary"
        aria-label={decrementLabel}
      >
        <DecrementIcon
          className={cn(
            size === "sm" ? "size-3.5" : "size-4",
            isAtMin ? "text-error" : "text-primary",
          )}
        />
      </button>
      <span
        className={cn(
          "flex items-center justify-center border-x border-border bg-surface text-center text-sm font-black text-foreground",
          size === "sm" ? "w-15" : "w-18 sm:w-25",
        )}
        aria-label="Cantidad"
        aria-live="polite"
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        className="flex aspect-square items-center justify-center text-primary transition hover:bg-primary-soft focus-visible:outline focus-visible:outline-primary"
        aria-label={`Aumentar cantidad de ${itemName ?? "producto"}`}
      >
        <Plus className={cn(size === "sm" ? "size-3.5" : "size-4")} />
      </button>
    </div>
  );
}
