import type { CartItem as CartItemType } from "@/features/cart/types/cart.types";
import { formatCartItemName } from "@/features/cart/utils/cartCopy";
import { formatCOP } from "@/features/cart/utils/money";
import { QuantityStepper } from "@/shared/components/QuantityStepper";
import { Pencil, Trash2 } from "lucide-react";
import { CartItemDetails } from "./CartItemDetails";
import { CartItemNote } from "./CartItemNote";
import { cn } from "@/shared/utils/cn";

type CartItemProps = {
  item: CartItemType;
  onIncrement: () => void;
  onDecrement: () => void;
  onQuantityChange: (quantity: number) => void;
  onNoteChange: (note: string) => void;
  onEdit: () => void;
  onRemove: () => void;
};

function getCartItemTitle(item: CartItemType) {
  return formatCartItemName(item.baseName ?? item.name);
}

export function CartItem({
  item,
  onIncrement,
  onDecrement,
  onQuantityChange,
  onNoteChange,
  onEdit,
  onRemove,
}: CartItemProps) {
  const title = getCartItemTitle(item);

  return (
    <article className="rounded-2xl border border-border bg-surface p-3 shadow-elevated transition hover:shadow-lg sm:p-4">
      <div
        className={cn(
          "grid items-start gap-3",
          item.image
            ? "grid-cols-[64px_minmax(0,1fr)] sm:grid-cols-[80px_minmax(0,1fr)]"
            : "grid-cols-1",
        )}
      >
        {item.image ? (
          <img
            src={item.image.src}
            alt={item.image.alt}
            className="aspect-square w-16 rounded-xl border border-border object-cover sm:w-20"
            loading="lazy"
          />
        ) : null}

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="line-clamp-2 font-heading text-lg font-black leading-tight text-foreground sm:text-xl">
                {title}
              </h3>
              <p className="mt-0.5 text-xs font-bold text-muted-foreground">
                {formatCOP(item.unitPrice)} c/u
              </p>
            </div>
            <p className="shrink-0 font-heading text-xl font-black leading-none text-primary sm:text-2xl">
              {formatCOP(item.unitPrice * item.quantity)}
            </p>
          </div>

          <CartItemDetails item={item} />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <QuantityStepper
          size="md"
          quantity={item.quantity}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onChange={onQuantityChange}
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-border px-4 text-xs font-black text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={onEdit}
          >
            <Pencil className="size-4" />
            Editar
          </button>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-error hover:text-error focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
            aria-label={`Eliminar ${title} del carrito`}
            title="Eliminar"
            onClick={onRemove}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      <CartItemNote note={item.note ?? ""} onChange={onNoteChange} />
    </article>
  );
}
