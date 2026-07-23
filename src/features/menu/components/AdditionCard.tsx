import { Plus } from "lucide-react";

import { formatCOP } from "@/features/cart/utils/money";
import type { AdditionRow } from "@/features/admin/types/additions.types";
import { getStorageImageUrl } from "@/shared/services/storage.service";
import { SUPABASE_BUCKETS } from "@/lib/supabase/constants";
import { Button } from "@/shared/components/Button";

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
    <article
      tabIndex={isInOrder ? 0 : undefined}
      onClick={isInOrder ? onAddTopping : undefined}
      className={`relative flex h-full min-h-32 flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-elevated transition ${
        isInOrder
          ? "cursor-pointer border-primary/30 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-xl hover:ring-1 hover:ring-primary/10 focus-visible:border-primary focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
          : "border-border hover:shadow-lg"
      }`}
    >
      {isInOrder ? (
        <span className="absolute right-2 top-2 z-10 inline-flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-background bg-primary px-1.5 text-xs font-black text-primary-foreground shadow-elevated">
          {quantityInOrder}
        </span>
      ) : null}

      {topping.image_path ? (
        <img
          src={getStorageImageUrl(
            topping.image_path,
            SUPABASE_BUCKETS.PRODUCT_IMAGES,
          )}
          alt={topping.name}
          className="aspect-video w-full rounded-t-2xl object-cover"
        />
      ) : null}

      <div className="relative flex flex-1 flex-col gap-1 p-2 sm:p-3">
        <div className="flex flex-1 flex-col justify-start gap-1">
          <div className="flex items-start justify-between gap-1.5">
            <h3 className="line-clamp-1 flex-1 font-heading text-sm font-black leading-tight text-foreground sm:text-base">
              {topping.name}
            </h3>
            <p className="shrink-0 font-heading text-sm font-black leading-none text-primary sm:text-base">
              {formatCOP(topping.price)}
            </p>
          </div>

          {topping.description ? (
            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
              {topping.description}
            </p>
          ) : null}
        </div>

        <Button
          variant="outline"
          size="md"
          radius="sm"
          fullWidth
          icon={<Plus className="size-4" />}
          onClick={onAddTopping}
          aria-label={`Agregar ${topping.name} al pedido`}
        >
          Agregar
        </Button>
      </div>
    </article>
  );
}
