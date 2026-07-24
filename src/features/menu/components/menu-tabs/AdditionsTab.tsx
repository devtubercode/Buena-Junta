import { AdditionCard } from "@/features/menu/components/AdditionCard";
import { EmptyState } from "@/shared/components/EmptyState";
import { ProductGridSkeleton } from "@/shared/components/menu/skeletons/ProductGridSkeleton";
import type { AdditionRow } from "@/features/admin/types/additions.types";
import { AlertCircle } from "lucide-react";

type AdditionsTabProps = {
  additions: AdditionRow[];
  isLoading?: boolean;
  error?: Error | null;
  onAddTopping: (addition: AdditionRow) => void;
  getToppingQuantity?: (toppingId: string) => number;
};

export const AdditionsTab = ({
  additions,
  isLoading = false,
  error = null,
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

      {isLoading ? (
        <ProductGridSkeleton count={3} />
      ) : error ? (
        <EmptyState
          title="Error al cargar toppings"
          description="No pudimos cargar los toppings. Intenta de nuevo más tarde."
          icon={<AlertCircle className="size-8" />}
        />
      ) : additions.length === 0 ? (
        <EmptyState
          title="No hay toppings disponibles"
          description="Por ahora no tenemos toppings para mostrarte."
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
