export const ProductGridSkeleton = ({ count = 4 }: { count?: number }) => {
  return (
    <div className="grid gap-3 lg:grid-cols-2" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <article
          key={index}
          className="grid grid-cols-[104px_minmax(0,1fr)] gap-3 rounded-lg border border-border bg-surface p-2 shadow-elevated sm:grid-cols-[116px_minmax(0,1fr)]"
        >
          <div className="h-full min-h-28 w-full animate-pulse rounded-md bg-surface-muted" />
          <div className="flex min-w-0 flex-col space-y-2 py-1 pr-1">
            <div className="h-7 w-4/5 animate-pulse rounded-full bg-surface-muted" />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded-full bg-surface-muted" />
              <div className="h-4 w-3/4 animate-pulse rounded-full bg-surface-muted" />
            </div>
            <div className="flex gap-2 overflow-hidden">
              <div className="h-8 w-16 shrink-0 animate-pulse rounded-md bg-surface-muted" />
              <div className="h-8 w-16 shrink-0 animate-pulse rounded-md bg-surface-muted" />
            </div>
            <div className="mt-auto flex items-end justify-between gap-2 pt-2">
              <div className="h-7 w-20 animate-pulse rounded-full bg-surface-muted" />
              <div className="h-10 w-28 animate-pulse rounded-md bg-surface-muted" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
