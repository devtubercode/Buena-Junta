import { useState } from "react";
import type { WhatsAppOrderItem as WhatsAppOrderItemType } from "@/store/whatsapp/types/whatsapp-order.types";
import { QuantityStepper } from "@/shared/components/QuantityStepper";
import { formatCOP } from "@/features/cart/utils/money";
import { SquarePen, Trash2, Check } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { TextArea } from "@/shared/components/TextArea";

type WhatsAppOrderItemProps = {
  item: WhatsAppOrderItemType;
  onIncrement: () => void;
  onDecrement: () => void;
  onQuantityChange: (quantity: number) => void;
  onNoteChange: (note: string) => void;
  onRemove: () => void;
};

function OrderItemDetails({ item }: { item: WhatsAppOrderItemType }) {
  const hasSelectedVariant = Boolean(item.variantKey);
  const hasSelectedOptions =
    item.selectedOptions && Object.keys(item.selectedOptions).length > 0;
  const hasSelectedAdditions =
    item.additionOptions && item.additionOptions.length > 0;

  if (!hasSelectedVariant && !hasSelectedOptions && !hasSelectedAdditions) {
    return null;
  }

  return (
    <div className="mt-1.5 grid gap-1.5">
      {hasSelectedVariant ? (
        <span className="inline-flex w-fit items-center rounded-full border border-primary-border bg-primary-soft px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-primary">
          {item.variantKey}
        </span>
      ) : null}

      {hasSelectedOptions ? (
        <div className="flex flex-wrap gap-x-2 gap-y-0.5">
          {Object.entries(item.selectedOptions!).map(
            ([groupName, optionName]) => (
              <span
                key={groupName}
                className="text-[11px] font-bold text-foreground"
              >
                <span className="text-primary">{groupName}:</span> {optionName}
              </span>
            ),
          )}
        </div>
      ) : null}

      {hasSelectedAdditions ? (
        <div className="flex flex-wrap gap-1">
          {item.additionOptions?.map((addition) => (
            <span
              key={addition.key}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] font-bold text-foreground"
            >
              <span>{addition.label}</span>
              <span className="text-primary">
                {formatCOP(addition.unitPrice)}
              </span>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function WhatsAppOrderItem({
  item,
  onIncrement,
  onDecrement,
  onQuantityChange,
  onNoteChange,
  onRemove,
}: WhatsAppOrderItemProps) {
  const title = item.baseName ?? item.name;
  const [isNoteOpen, setIsNoteOpen] = useState(Boolean(item.note));
  const note = item.note ?? "";

  const handleDeleteNote = () => {
    onNoteChange("");
    setIsNoteOpen(false);
  };

  return (
    <article className="rounded-2xl border border-border bg-surface p-3 shadow-sm transition hover:shadow-md sm:p-4">
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
            className="aspect-square w-16 rounded-lg border border-border object-cover sm:w-20"
            loading="lazy"
          />
        ) : null}

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 min-w-0 font-heading text-base font-black leading-tight text-foreground sm:text-lg">
              {title}
            </h3>
            <p className="shrink-0 font-heading text-base font-black leading-none text-primary sm:text-lg">
              {formatCOP(item.unitPrice * item.quantity)}
            </p>
          </div>

          <OrderItemDetails item={item} />

          <div className="mt-2 flex items-center justify-between gap-2">
            <QuantityStepper
              size="sm"
              quantity={item.quantity}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              onChange={onQuantityChange}
              className="border-primary-border"
            />
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-error hover:text-error focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
              aria-label={`Eliminar ${title} del pedido`}
              title="Eliminar"
              onClick={onRemove}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 border-t border-border pt-3">
        {!isNoteOpen ? (
          note ? (
            <button
              type="button"
              onClick={() => setIsNoteOpen(true)}
              className="flex w-full items-start gap-2 text-left transition hover:text-primary focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Editar nota"
              aria-expanded={false}
            >
              <SquarePen className="mt-0.5 size-3.5 shrink-0 text-primary" />
              <span className="line-clamp-2 text-sm font-medium text-foreground">
                {note}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsNoteOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground transition hover:text-primary focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label="Agregar nota"
              aria-expanded={false}
            >
              <SquarePen className="size-3.5" />
              Agregar nota
            </button>
          )
        ) : (
          <div className="rounded-lg border border-border bg-surface-muted p-2">
            <label className="block">
              <span className="mb-1 block text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                Nota
              </span>
              <TextArea
                value={note}
                onChange={(event) => onNoteChange(event.target.value)}
                maxLength={160}
                rows={2}
                placeholder="Ej: sin cebolla..."
                className="min-h-16"
                aria-label="Nota del producto"
              />
            </label>
            <div className="mt-1.5 flex items-center justify-end gap-2">
              {note ? (
                <button
                  type="button"
                  onClick={handleDeleteNote}
                  className="text-xs font-bold text-muted-foreground transition hover:text-error focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
                >
                  Eliminar
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setIsNoteOpen(false)}
                className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-black text-primary-foreground transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Check className="size-3" />
                Listo
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
