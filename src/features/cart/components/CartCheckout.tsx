import { Trash2 } from "lucide-react";

type CartCheckoutProps = {
  onClearCart: () => void;
};

export function CartCheckout({ onClearCart }: CartCheckoutProps) {
  return (
    <div className="grid gap-3">
      <button
        type="button"
        disabled
        title="Proximamente pagos con Stripe"
        className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-black text-primary-foreground shadow-elevated transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-muted-foreground/30 disabled:text-muted-foreground"
      >
        Proximamente pagos con Stripe
      </button>

      <button
        type="button"
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-black text-muted-foreground transition hover:border-error hover:text-error focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
        onClick={onClearCart}
      >
        <Trash2 className="size-5" />
        Limpiar carrito
      </button>
    </div>
  );
}
