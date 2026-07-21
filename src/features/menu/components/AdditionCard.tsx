import { QuantityStepper } from "@/shared/components/QuantityStepper";
import { formatCOP } from "@/features/cart/utils/money";
import { Plus } from "lucide-react";
import type { AdditionRow } from "@/features/admin/types/additions.types";

type AdditionCardProps = {
  addition: AdditionRow;
  quantityInOrder?: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
};

export function AdditionCard({
  addition,
  quantityInOrder = 0,
  onAdd,
  onIncrement,
  onDecrement,
}: AdditionCardProps) {
  const isInOrder = quantityInOrder > 0;

  return (
    <article className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-4 shadow-elevated transition hover:shadow-lg">
      <div>
        <h3 className="font-heading text-lg font-black leading-tight text-foreground sm:text-xl">
          {addition.name}
        </h3>
        {addition.description ? (
          <p className="mt-1 text-xs font-medium leading-relaxed text-muted-foreground sm:text-sm">
            {addition.description}
          </p>
        ) : null}
        <p className="mt-2 font-heading text-xl font-black leading-none text-primary sm:text-2xl">
          {formatCOP(addition.price)}
        </p>
      </div>

      <div className="mt-4">
        {isInOrder ? (
          <div className="flex flex-col gap-2">
            <QuantityStepper
              quantity={quantityInOrder}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              size="sm"
            />
            <p className="text-xs font-medium text-muted-foreground">
              Puedes aumentar o disminuir la cantidad
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={`Agregar ${addition.name} al pedido`}
          >
            <Plus className="size-4" />
            Agregar
          </button>
        )}
      </div>
    </article>
  );
}
