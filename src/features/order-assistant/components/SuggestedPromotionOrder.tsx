import { Trash2, Sparkles } from "lucide-react";
import { QuantityStepper } from "@/shared/components/QuantityStepper";
import { formatCOP } from "@/features/cart/utils/money";
import productPlaceholderImage from "@/assets/product-placeholder.svg";
import type { SuggestedOrderPromotion } from "@/features/order-assistant/types/order-assistant.types";

type SuggestedPromotionOrderProps = {
  promotion: SuggestedOrderPromotion;
  explanation?: string;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
};

export function SuggestedPromotionOrder({
  promotion,
  explanation,
  onUpdateQuantity,
  onRemove,
}: SuggestedPromotionOrderProps) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-3 shadow-elevated sm:p-4">
      <div className="flex items-start gap-3">
        <img
          src={promotion.urlImage?.src ?? productPlaceholderImage}
          alt={promotion.urlImage?.alt ?? promotion.title}
          className="size-12 shrink-0 rounded-xl border border-border object-cover sm:size-14"
          loading="lazy"
          decoding="async"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate font-heading text-sm font-black leading-tight text-foreground sm:text-base">
                {promotion.title}
              </h3>
              <p className="mt-0.5 text-xs font-bold text-muted-foreground">
                {formatCOP(promotion.unitPrice)} c/u
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-heading text-base font-black leading-none text-primary sm:text-lg">
                {formatCOP(promotion.subtotal)}
              </p>
              <p className="mt-0.5 text-[10px] font-bold text-muted-foreground sm:text-xs">
                {promotion.quantity} x {formatCOP(promotion.unitPrice)}
              </p>
            </div>
          </div>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-black text-primary">
            <Sparkles className="size-3" />
            Para compartir
          </span>
        </div>
      </div>

      {explanation ? (
        <p className="mt-2 text-xs italic leading-relaxed text-muted-foreground">
          {explanation}
        </p>
      ) : null}

      <div className="mt-3 flex items-center justify-between gap-3">
        <QuantityStepper
          size="sm"
          quantity={promotion.quantity}
          onIncrement={() => onUpdateQuantity(promotion.quantity + 1)}
          onDecrement={() =>
            onUpdateQuantity(Math.max(0, promotion.quantity - 1))
          }
          onChange={(qty) => onUpdateQuantity(qty)}
          itemName={promotion.title}
        />
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-error hover:text-error focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
          aria-label={`Eliminar ${promotion.title} de la sugerencia`}
          title="Eliminar"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
