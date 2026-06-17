type QuantityControlProps = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onChange?: (quantity: number) => void;
};

export function QuantityControl({
  quantity,
  onIncrement,
  onDecrement,
  onChange,
}: QuantityControlProps) {
  return (
    <div className="inline-grid grid-cols-[44px_54px_44px] overflow-hidden rounded-lg border border-border bg-surface">
      <button
        type="button"
        className="min-h-11 text-lg font-black text-primary transition hover:bg-primary-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        aria-label="Disminuir cantidad"
        onClick={onDecrement}
      >
        -
      </button>
      <input
        type="number"
        min={1}
        value={quantity}
        className="min-h-11 border-x border-border bg-surface text-center text-sm font-black text-foreground outline-none"
        aria-label="Cantidad"
        onChange={(event) => onChange?.(Number(event.target.value))}
      />
      <button
        type="button"
        className="min-h-11 text-lg font-black text-primary transition hover:bg-primary-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        aria-label="Aumentar cantidad"
        onClick={onIncrement}
      >
        +
      </button>
    </div>
  );
}
