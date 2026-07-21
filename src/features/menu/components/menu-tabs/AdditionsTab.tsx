import { AdditionCard } from "@/features/menu/components/AdditionCard";
import { EmptyState } from "@/shared/components/EmptyState";
import type { AdditionRow } from "@/features/admin/types/additions.types";
import { PlusCircle } from "lucide-react";

type AdditionsTabProps = {
  additions: AdditionRow[];
  onAddToOrder: (addition: AdditionRow) => void;
  getQuantityInOrder?: (additionId: string) => number;
  onIncrementAddition?: (addition: AdditionRow) => void;
  onDecrementAddition?: (addition: AdditionRow) => void;
};

export function AdditionsTab({
  additions,
  onAddToOrder,
  getQuantityInOrder,
  onIncrementAddition,
  onDecrementAddition,
}: AdditionsTabProps) {
  return (
    <section
      id="menu-tabpanel-additions"
      role="tabpanel"
      aria-labelledby="menu-tab-additions"
      className="grid gap-4"
    >
      <div>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">
          Extras
        </p>
        <h2 className="mt-2 font-heading text-4xl font-black leading-none text-foreground">
          Adiciones
        </h2>
        <p className="mt-2 text-sm font-medium text-muted-foreground">
          Agrega a tu pedido acompañantes, salsas o complementos.
        </p>
      </div>

      {additions.length === 0 ? (
        <EmptyState
          title="No hay adiciones disponibles"
          description="Por ahora no tenemos adiciones para mostrarte."
          icon={<PlusCircle className="size-8" />}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {additions.map((addition) => (
            <AdditionCard
              key={addition.id}
              addition={addition}
              quantityInOrder={getQuantityInOrder?.(addition.id) ?? 0}
              onAdd={() => onAddToOrder(addition)}
              onIncrement={() => onIncrementAddition?.(addition) ?? onAddToOrder(addition)}
              onDecrement={() => onDecrementAddition?.(addition)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
