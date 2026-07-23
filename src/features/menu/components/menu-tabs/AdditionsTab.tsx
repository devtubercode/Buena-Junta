import { AdditionCard } from "@/features/menu/components/AdditionCard";
import { EmptyState } from "@/shared/components/EmptyState";
import type { AdditionRow } from "@/features/admin/types/additions.types";
import { PlusCircle } from "lucide-react";

type AdditionsTabProps = {
  additions: AdditionRow[];
  onAddTopping: (addition: AdditionRow) => void;
  getToppingQuantity?: (toppingId: string) => number;
};

export const AdditionsTab = ({
  additions,
  onAddTopping,
  getToppingQuantity,
}: AdditionsTabProps) => {
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
          Toppings
        </h2>
        <p className="mt-2 text-sm font-medium text-muted-foreground">
          Personaliza tu pedido con toppings extra.
        </p>
      </div>

      {additions.length === 0 ? (
        <EmptyState
          title="No hay toppings disponibles"
          description="Por ahora no tenemos toppings para mostrarte."
          icon={<PlusCircle className="size-8" />}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {additions.map((addition) => (
            <AdditionCard
              key={addition.id}
              topping={addition}
              quantityInOrder={getToppingQuantity?.(addition.id) ?? 0}
              onAddTopping={() => onAddTopping(addition)}
            />
          ))}
        </div>
      )}
    </section>
  );
};
