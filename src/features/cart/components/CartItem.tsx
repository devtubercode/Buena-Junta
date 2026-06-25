import { useState } from "react";
import type { CartItem as CartItemType } from "@/features/cart/types/cart.types";
import { formatCartItemName } from "@/features/cart/utils/cartCopy";
import { formatCOP } from "@/features/cart/utils/money";
import { QuantityControl } from "@/features/cart/components/QuantityControl";
import { ChevronDown, Pencil, Trash2, X } from "lucide-react";
import { notify } from "@/shared/notifications/notify";
import { cn } from "@/shared/utils/cn";

type CartItemProps = {
  item: CartItemType;
  onIncrement: () => void;
  onDecrement: () => void;
  onQuantityChange: (quantity: number) => void;
  onNoteChange: (note: string) => void;
  onVariantChange: (
    variantKey: string,
  ) => "updated" | "duplicate" | "not-found";
  onRemove: () => void;
};

function getVariantTitle(variantKey?: string) {
  const normalizedKey = formatVariantKey(variantKey);

  if (normalizedKey?.toLocaleLowerCase("es-CO").startsWith("sabor:")) {
    return "Sabor seleccionado";
  }

  return "Opción seleccionada";
}

function getVariantNoun(variantKey?: string) {
  const normalizedKey = formatVariantKey(variantKey);

  return normalizedKey?.toLocaleLowerCase("es-CO").startsWith("sabor:")
    ? "sabor"
    : "opción";
}

function formatVariantKey(variantKey?: string) {
  return variantKey?.replace(/^Sabores:/i, "Sabor:");
}

function getCartItemTitle(item: CartItemType) {
  return formatCartItemName(item.baseName ?? item.name);
}

export function CartItem({
  item,
  onIncrement,
  onDecrement,
  onQuantityChange,
  onNoteChange,
  onVariantChange,
  onRemove,
}: CartItemProps) {
  const [isChangingVariant, setIsChangingVariant] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const hasVariantOptions = Boolean(item.variantOptions?.length);
  const hasAdditionOptions = Boolean(item.additionOptions?.length);
  const note = item.note?.trim() ?? "";
  const title = getCartItemTitle(item);

  const handleVariantChange = (variantKey: string) => {
    if (variantKey === item.variantKey) {
      return;
    }

    const result = onVariantChange(variantKey);

    if (result === "updated") {
      notify.success(
        `${getVariantNoun(variantKey) === "sabor" ? "Sabor" : "Opción"} actualizada.`,
      );
      return;
    }

    if (result === "duplicate") {
      notify.warning(
        `Este producto ya está en el carrito con ese ${getVariantNoun(variantKey)}. Aumenta la cantidad si deseas más unidades.`,
        { duration: 5200 },
      );
      return;
    }

    notify.warning(
      `No pudimos encontrar ese ${getVariantNoun(variantKey)} para este producto.`,
    );
  };

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
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-bold text-muted-foreground">
            <span>{formatCOP(item.unitPrice)} c/u</span>
          </div>
        </div>
        <p className="font-heading text-2xl font-black leading-none text-foreground sm:text-3xl">
          {formatCOP(item.unitPrice * item.quantity)}
        </p>
      </div>

      {hasVariantOptions ? (
        <section className="mt-3 rounded-lg border border-primary-border bg-primary-soft px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <p className="min-w-0 text-xs font-black uppercase tracking-[0.12em] text-primary">
              <span className="sr-only">{getVariantTitle(item.variantKey)}: </span>
              <span className="normal-case tracking-normal text-foreground">
                {formatVariantKey(item.variantKey) ?? "Sin opción"}
              </span>
            </p>
            <button
              type="button"
              className="inline-flex min-h-9 shrink-0 items-center justify-center gap-1 rounded-full border border-primary bg-surface px-3 text-xs font-black text-primary transition hover:bg-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-expanded={isChangingVariant}
              onClick={() => setIsChangingVariant((current) => !current)}
            >
              Cambiar
              <ChevronDown
                className="size-4 transition data-[open=true]:rotate-180"
                data-open={isChangingVariant}
              />
            </button>
          </div>

          {isChangingVariant ? (
            <div className="mt-2 flex max-h-36 flex-wrap gap-2 overflow-y-auto pr-1">
              {item.variantOptions?.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  className="relative min-h-9 rounded-full border px-3 text-xs font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary data-[selected=true]:border-primary data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=false]:border-border data-[selected=false]:bg-surface data-[selected=false]:text-muted-foreground"
                  data-selected={option.key === item.variantKey}
                  onClick={() => handleVariantChange(option.key)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : null}
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
        <QuantityControl
          compact
          quantity={item.quantity}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onChange={onQuantityChange}
        />
        <div className="flex items-center gap-2">
          {!isEditingNote && !note ? (
            <button
              type="button"
              className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-border px-3 text-xs font-black text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={() => setIsEditingNote(true)}
            >
              <Pencil className="size-4" />
              Añadir nota
            </button>
          ) : null}
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
