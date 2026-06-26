import { EmptyState } from "@/shared/components/EmptyState";

type AdminDataStateProps = {
  isLoading: boolean;
  error: Error | null;
};

export function AdminDataState({ isLoading, error }: AdminDataStateProps) {
  if (isLoading) {
    return (
      <div
        className="grid gap-3 rounded-lg border border-border bg-surface p-5 shadow-elevated"
        aria-hidden="true"
      >
        <span className="block h-5 w-40 animate-pulse rounded-md bg-surface-muted" />
        <span className="block h-4 w-full max-w-md animate-pulse rounded-md bg-surface-muted" />
        <span className="block h-4 w-3/4 max-w-sm animate-pulse rounded-md bg-surface-muted" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="No se pudieron cargar los datos"
        description={error.message}
      />
    );
  }

  return null;
}
