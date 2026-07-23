import { formatCOP } from "@/features/cart/utils/money";
import { Plus, Check } from "lucide-react";
import type { AdditionRow } from "@/features/admin/types/additions.types";

type AdditionCardProps = {
  topping: AdditionRow;
  quantityInOrder?: number;
  onAddTopping: () => void;
};

export function AdditionCard({
  topping,
  quantityInOrder = 0,
  onAddTopping,
}: AdditionCardProps) {
  const isInOrder = quantityInOrder > 0;

  return (
    <article className="relative flex flex-col rounded-2xl border border-border bg-surface p-4 shadow-elevated transition hover:shadow-lg">
      {isInOrder ? (
        <span className="absolute right-2 top-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-background bg-primary px-1.5 text-xs font-black text-primary-foreground shadow-elevated">
          {quantityInOrder}
        </span>
      ) : null}

      <div>
        <h3 className="font-heading text-lg font-black leading-tight text-foreground sm:text-xl">
          {topping.name}
        </h3>
        {topping.description ? (
          <p className="mt-1 text-xs font-medium leading-relaxed text-muted-foreground sm:text-sm">
            {topping.description}
          </p>
        ) : null}
        <p className="mt-2 font-heading text-xl font-black leading-none text-primary sm:text-2xl">
          {formatCOP(topping.price)}
        </p>
      </div>

      <div className="mt-4">
        {isInOrder ? (
          <button
            type="button"
            disabled
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-green-600/30 bg-green-50 px-4 text-sm font-black text-green-700"
          >
            <Check className="size-4" />
            Agregado
          </button>
        ) : (
          <button
            type="button"
            onClick={onAddTopping}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={`Agregar ${topping.name} al pedido`}
          >
            <Plus className="size-4" />
            Agregar
          </button>
        )}
      </div>
    </article>
  );
}
