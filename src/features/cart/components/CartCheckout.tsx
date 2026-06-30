import { AlertCircle, Trash2 } from "lucide-react";
import { WhatsappIcon } from "@/shared/icons";

type CartCheckoutProps = {
  canSendOrder: boolean;
  onSendOrder: () => void;
  onClearCart: () => void;
  disabledReason?: string;
};

export function CartCheckout({
  canSendOrder,
  onSendOrder,
  onClearCart,
  disabledReason = "Escribe el responsable del pedido para continuar",
}: CartCheckoutProps) {
  return (
    <div className="grid gap-3">
      <button
        type="button"
        disabled={!canSendOrder}
        title={
          canSendOrder
            ? "Enviar pedido por WhatsApp"
            : "Escribe el responsable del pedido para continuar"
        }
        className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-black text-primary-foreground shadow-elevated transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:bg-muted-foreground/30 disabled:text-muted-foreground"
        onClick={onSendOrder}
      >
        <WhatsappIcon className="size-6" />
        Enviar pedido por WhatsApp
      </button>

      {!canSendOrder ? (
        <p className="flex items-start gap-1.5 text-xs font-bold text-error">
          <AlertCircle className="size-4 shrink-0" />
          {disabledReason}
        </p>
      ) : null}

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
