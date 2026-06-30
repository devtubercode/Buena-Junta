import { Cookie, Pencil, Trash2 } from "lucide-react";
import type { AdditionRow } from "@/features/admin/types/additions.types";

type AdditionCardProps = {
  addition: AdditionRow;
  onEdit: (addition: AdditionRow) => void;
  onDelete: (addition: AdditionRow) => void;
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO").format(price);
}

export function AdditionCard({
  addition,
  onEdit,
  onDelete,
}: AdditionCardProps) {
  return (
    <article className="group flex min-w-0 flex-row gap-3 rounded-xl border border-border bg-surface p-3 shadow-elevated transition hover:border-primary/30 hover:shadow-lg sm:flex-col">
      <div className="shrink-0 sm:block">
        <div className="flex size-18 items-center justify-center rounded-lg border border-border bg-primary-soft text-primary transition group-hover:border-primary/30 group-hover:bg-primary group-hover:text-primary-foreground sm:aspect-video sm:h-auto sm:w-full">
          <Cookie className="size-7" aria-hidden="true" />
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <button
          type="button"
          onClick={() => onEdit(addition)}
          className="text-left"
        >
          <span className="block break-words font-heading text-base font-black leading-tight text-foreground transition group-hover:text-primary sm:text-lg">
            {addition.name}
          </span>
          <p className="mt-0.5 text-sm font-black text-primary">
            ${formatPrice(addition.price)}
          </p>
        </button>

        {addition.description?.trim() ? (
          <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-relaxed text-muted-foreground sm:text-sm">
            {addition.description.trim()}
          </p>
        ) : null}

        <div className="mt-auto flex items-center justify-end gap-2 border-t border-border pt-2.5 sm:pt-3">
          <button
            type="button"
            onClick={() => onEdit(addition)}
            className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface-muted text-foreground transition hover:border-primary hover:text-primary"
            aria-label={`Editar ${addition.name}`}
          >
            <Pencil className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(addition)}
            className="inline-flex size-11 items-center justify-center rounded-full border border-error-border bg-error-soft text-error transition hover:bg-error hover:text-error-foreground"
            aria-label={`Eliminar ${addition.name}`}
          >
            <Trash2 className="size-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
