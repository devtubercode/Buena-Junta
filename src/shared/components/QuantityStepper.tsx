import { Minus, Plus } from "lucide-react";
import { cn } from "@/shared/utils/cn";

type QuantityStepperProps = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onChange?: (quantity: number) => void;
  size?: "sm" | "md";
  className?: string;
};

export function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  onChange,
  size = "md",
  className,
}: QuantityStepperProps) {
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
        onClick={onDecrement}
        className="flex aspect-square items-center justify-center text-primary transition hover:bg-primary-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        aria-label="Disminuir cantidad"
      >
        <Minus className={cn(size === "sm" ? "size-3.5" : "size-4")} />
      </button>
      <input
        type="number"
        min={1}
        value={quantity}
        onChange={(event) => onChange?.(Number(event.target.value))}
        className={cn(
          "min-w-0 border-x border-border bg-surface text-center text-sm font-black text-foreground outline-none",
          size === "sm" ? "w-10 px-1" : "w-12 px-2",
        )}
        aria-label="Cantidad"
      />
      <button
        type="button"
        onClick={onIncrement}
        className="flex aspect-square items-center justify-center text-primary transition hover:bg-primary-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        aria-label="Aumentar cantidad"
      >
        <Plus className={cn(size === "sm" ? "size-3.5" : "size-4")} />
      </button>
    </div>
  );
}
