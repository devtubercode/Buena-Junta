import { useState } from "react";
import type { CartItem as CartItemType } from "@/features/cart/types";
import { formatCartItemName } from "@/features/cart/utils/cartCopy";
import { formatCOP } from "@/features/cart/utils/money";
import { QuantityControl } from "@/features/cart/components/QuantityControl";
import { TrashIcon } from "@/shared/icons";
import { notify } from "@/shared/notifications/notify";

type CartItemProps = {
  item: CartItemType;
  onIncrement: () => void;
  onDecrement: () => void;
  onQuantityChange: (quantity: number) => void;
  onNoteChange: (note: string) => void;
  onVariantChange: (variantKey: string) => "updated" | "duplicate" | "not-found";
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

  return normalizedKey?.toLocaleLowerCase("es-CO").startsWith("sabor:") ? "sabor" : "opción";
}

function formatVariantKey(variantKey?: string) {
  return variantKey?.replace(/^Sabores:/i, "Sabor:");
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
  const hasVariantOptions = Boolean(item.variantOptions?.length);

  const handleVariantChange = (variantKey: string) => {
    if (variantKey === item.variantKey) {
      return;
    }

    const result = onVariantChange(variantKey);

    if (result === "updated") {
      notify.success(`${getVariantNoun(variantKey) === "sabor" ? "Sabor" : "Opción"} actualizada.`);
      return;
    }

    if (result === "duplicate") {
      notify.warning(
        `Este producto ya está en el carrito con ese ${getVariantNoun(variantKey)}. Aumenta la cantidad si deseas más unidades.`,
        { duration: 5200 },
      );
      return;
    }

    notify.warning(`No pudimos encontrar ese ${getVariantNoun(variantKey)} para este producto.`);
  };

  return (
    <article className="rounded-lg border border-border bg-surface p-4 shadow-elevated">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-2xl font-black leading-tight text-foreground">
            {formatCartItemName(item.name)}
          </h3>
          <p className="mt-1 text-sm font-bold text-primary">
            {formatCOP(item.unitPriceCents)} c/u
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs font-black text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          onClick={onRemove}
        >
          <TrashIcon className="size-4" />
          Eliminar
        </button>
      </div>

      {hasVariantOptions ? (
        <section className="mt-4 rounded-lg border border-primary-border bg-primary-soft p-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-primary">
                {getVariantTitle(item.variantKey)}
              </p>
              <p className="mt-1 text-sm font-black text-foreground">
                {formatVariantKey(item.variantKey) ?? "Sin opción"}
              </p>
            </div>
            <button
              type="button"
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-primary bg-surface px-4 text-xs font-black text-primary transition hover:bg-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={() => setIsChangingVariant((current) => !current)}
            >
              {isChangingVariant ? "Ocultar" : "Cambiar opción"}
            </button>
          </div>

          {isChangingVariant ? (
            <div className="mt-3 flex max-h-40 flex-wrap gap-2 overflow-y-auto pr-1">
              {item.variantOptions?.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  className="relative min-h-10 rounded-full border px-3 text-xs font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary data-[selected=true]:border-primary data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground data-[selected=false]:border-border data-[selected=false]:bg-surface data-[selected=false]:text-muted-foreground"
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

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <QuantityControl
          quantity={item.quantity}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onChange={onQuantityChange}
        />
        <p className="font-heading text-2xl font-black text-foreground">
          {formatCOP(item.unitPriceCents * item.quantity)}
        </p>
      </div>

      <label className="mt-4 block">
        <span className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
          Observación del producto
        </span>
        <textarea
          value={item.note ?? ""}
          maxLength={160}
          rows={2}
          placeholder="Ej: sin cebolla, sin salsas..."
          className="w-full resize-none rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm font-medium text-foreground outline-none transition placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-primary/20"
          onChange={(event) => onNoteChange(event.target.value)}
        />
      </label>
    </article>
  );
}
