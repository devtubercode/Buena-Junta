import { Folder, Pencil, Trash2 } from "lucide-react";
import type { CategoryRow } from "@/features/admin/types/categories.types";

type CategoryCardProps = {
  category: CategoryRow;
  onEdit: (category: CategoryRow) => void;
  onDelete: (category: CategoryRow) => void;
};

export function CategoryCard({
  category,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  const subtitle = category.description?.trim() || category.slug;

  return (
    <article className="group flex min-w-0 items-center gap-4 rounded-xl border border-border bg-surface p-3 shadow-elevated transition hover:border-primary/30 hover:shadow-lg">
      <button
        type="button"
        onClick={() => onEdit(category)}
        className="flex min-w-0 flex-1 items-center gap-3 text-left cursor-pointer"
      >
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
          <Folder className="size-6" />
        </div>
        <div className="min-w-0">
          <span className="block truncate font-heading text-base font-black text-foreground sm:text-lg">
            {category.name}
          </span>
          <p className="truncate text-xs font-bold text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </button>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => onEdit(category)}
          className="inline-flex size-11 items-center cursor-pointer justify-center rounded-full border border-border bg-surface-muted text-foreground transition hover:border-primary hover:text-primary"
          aria-label={`Editar ${category.name}`}
        >
          <Pencil className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(category)}
          className="inline-flex size-11 items-center cursor-pointer justify-center rounded-full border border-error-border bg-error-soft text-error transition hover:bg-error hover:text-error-foreground"
          aria-label={`Eliminar ${category.name}`}
        >
          <Trash2 className="size-5" />
        </button>
      </div>
    </article>
  );
}
