import { Cookie, Pencil, Trash2 } from "lucide-react";
import type { AdditionRow } from "@/features/admin/types/additions.types";
import { getStorageImageUrl } from "@/shared/services/storage.service";
import { SUPABASE_BUCKETS } from "@/lib/supabase/constants";

type AdditionCardProps = {
  addition: AdditionRow;
  onEdit: (addition: AdditionRow) => void;
  onDelete: (addition: AdditionRow) => void;
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO").format(price);
}

function AdditionImage({ addition }: { addition: AdditionRow }) {
  if (addition.image_path) {
    return (
      <img
        src={getStorageImageUrl(addition.image_path, SUPABASE_BUCKETS.PRODUCT_IMAGES)}
        alt={addition.name}
        className="size-12 shrink-0 rounded-xl object-cover"
      />
    );
  }

  return (
    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
      <Cookie className="size-6" aria-hidden="true" />
    </div>
  );
}

export function AdditionCard({
  addition,
  onEdit,
  onDelete,
}: AdditionCardProps) {
  return (
    <article className="group flex min-w-0 items-center gap-4 rounded-xl border border-border bg-surface p-3 shadow-elevated transition hover:border-primary/30 hover:shadow-lg">
      <button
        type="button"
        onClick={() => onEdit(addition)}
        className="flex min-w-0 flex-1 items-center gap-3 text-left cursor-pointer"
      >
        <AdditionImage addition={addition} />
        <div className="min-w-0">
          <span className="block truncate font-heading text-base font-black text-foreground sm:text-lg">
            {addition.name}
          </span>
          <p className="mt-0.5 text-sm font-black text-primary">
            ${formatPrice(addition.price)}
          </p>
          {addition.description?.trim() ? (
            <p className="mt-0.5 truncate text-xs font-medium text-muted-foreground">
              {addition.description.trim()}
            </p>
          ) : null}
        </div>
      </button>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => onEdit(addition)}
          className="inline-flex size-11 items-center cursor-pointer justify-center rounded-full border border-border bg-surface-muted text-foreground transition hover:border-primary hover:text-primary"
          aria-label={`Editar ${addition.name}`}
        >
          <Pencil className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(addition)}
          className="inline-flex size-11 items-center cursor-pointer justify-center rounded-full border border-error-border bg-error-soft text-error transition hover:bg-error hover:text-error-foreground"
          aria-label={`Eliminar ${addition.name}`}
        >
          <Trash2 className="size-5" />
        </button>
      </div>
    </article>
  );
}
