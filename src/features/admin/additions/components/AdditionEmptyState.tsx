import { Plus, Cookie } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState";

type AdditionEmptyStateProps = {
  onCreate?: () => void;
};

export function AdditionEmptyState({ onCreate }: AdditionEmptyStateProps) {
  return (
    <EmptyState
      title="No hay adiciones"
      description="Crea la primera adición para ofrecer complementos en tu menú."
      icon={<Cookie className="size-8" />}
      action={
        <button
          type="button"
          onClick={onCreate}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-sm font-black text-primary-foreground transition hover:opacity-90"
        >
          <Plus className="size-4" />
          Crear primera adición
        </button>
      }
    />
  );
}
