import { useState } from "react";
import type { CartItem as CartItemType } from "@/features/cart/types/cart.types";
import { formatCartItemName } from "@/features/cart/utils/cartCopy";
import { formatCOP } from "@/features/cart/utils/money";
import { QuantityStepper } from "@/shared/components/QuantityStepper";
import { Pencil, Trash2, X } from "lucide-react";
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

function getSelectedOptionsDisplay(item: CartItemType) {
  if (!item.selectedOptions || Object.keys(item.selectedOptions).length === 0) {
    return null;
  }

  return Object.entries(item.selectedOptions).map(([groupName, optionName]) => ({
    groupName,
    optionName,
  }));
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
  const [isEditingNote, setIsEditingNote] = useState(false);
  const hasAdditionOptions = Boolean(item.additionOptions?.length);
  const hasSelectedOptions = Boolean(
    item.selectedOptions && Object.keys(item.selectedOptions).length > 0,
  );
  const note = item.note?.trim() ?? "";
  const title = getCartItemTitle(item);
  const selectedOptionsDisplay = getSelectedOptionsDisplay(item);

  return (
    <article className="rounded-lg border border-border bg-surface p-3 shadow-elevated sm:p-4">
      <div
        className={cn(
          "grid items-start gap-3",
          item.image
            ? "grid-cols-[56px_minmax(0,1fr)_auto] sm:grid-cols-[64px_minmax(0,1fr)_auto]"
            : "grid-cols-[minmax(0,1fr)_auto]",
        )}
      >
        {item.image ? (
          <img
            src={item.image.src}
            alt={item.image.alt}
            className="aspect-square w-14 rounded-md border border-border object-cover sm:w-16"
            loading="lazy"
          />
        ) : null}
        <div className="min-w-0">
          <h3 className="font-heading text-xl font-black leading-tight text-foreground sm:text-2xl">
            {title}
          </h3>
          <div className="mt-1 grid gap-0.5 text-xs font-bold text-muted-foreground">
            <span>{formatCOP(item.unitPrice)} c/u</span>
          </div>
        </div>
        <p className="font-heading text-2xl font-black leading-none text-foreground sm:text-3xl">
          {formatCOP(item.unitPrice * item.quantity)}
        </p>
      </div>

      {hasSelectedOptions && selectedOptionsDisplay ? (
        <section className="mt-3 rounded-lg border border-primary-border bg-primary-soft px-3 py-2">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {selectedOptionsDisplay.map(({ groupName, optionName }) => (
              <span
                key={groupName}
                className="text-xs font-black text-foreground"
              >
                <span className="text-primary">{groupName}:</span> {optionName}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {hasAdditionOptions ? (
        <section className="mt-3 rounded-lg border border-border bg-surface-muted px-3 py-2">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
            Acompañantes
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {item.additionOptions?.map((addition) => (
              <span
                key={addition.key}
                className="inline-flex items-center gap-1 rounded-full border border-primary-border bg-surface px-3 py-1 text-xs font-black text-foreground"
              >
                <span>{addition.label}</span>
                <span className="text-primary">{formatCOP(addition.unitPrice)}</span>
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <QuantityStepper
          size="sm"
          quantity={item.quantity}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onChange={onQuantityChange}
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-border px-3 text-xs font-black text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={onEdit}
          >
            <Pencil className="size-4" />
            Editar
          </button>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={`Eliminar ${title} del carrito`}
            title="Eliminar"
            onClick={onRemove}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>

      {isEditingNote ? (
        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
              Observación
            </span>
            <button
              type="button"
              className="inline-flex min-h-8 items-center justify-center gap-1 rounded-full border border-border px-3 text-xs font-black text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={() => setIsEditingNote(false)}
            >
              <X className="size-3.5" />
              Ocultar
            </button>
          </div>
          <textarea
            value={item.note ?? ""}
            maxLength={160}
            rows={2}
            aria-label="Observación del producto"
            placeholder="Ej: sin cebolla, sin salsas..."
            className="w-full resize-none rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm font-medium text-foreground outline-none transition placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-primary/20"
            onBlur={() => setIsEditingNote(false)}
            onChange={(event) => onNoteChange(event.target.value)}
          />
        </div>
      ) : note ? (
        <button
          type="button"
          className="mt-3 flex w-full items-start gap-2 rounded-lg border border-border bg-surface-muted px-3 py-2 text-left text-xs font-semibold text-muted-foreground transition hover:border-primary hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onClick={() => setIsEditingNote(true)}
        >
          <Pencil className="mt-0.5 size-4 shrink-0 text-primary" />
          <span className="min-w-0 truncate">
            <span className="font-black text-foreground">Nota:</span> {note}
          </span>
        </button>
      ) : null}
    </article>
  );
}
