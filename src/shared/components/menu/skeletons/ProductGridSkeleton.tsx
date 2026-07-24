export const ProductGridSkeleton = ({ count = 4 }: { count?: number }) => {
  return (
    <div
      className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <article
          key={index}
          className="flex min-h-[8rem] min-w-0 flex-row overflow-hidden rounded-2xl border border-border bg-surface shadow-elevated"
        >
          <div className="w-[28%] shrink-0 animate-pulse bg-surface-muted" />
          <div className="flex flex-1 flex-col gap-1 p-2 sm:p-3">
            <div className="flex flex-1 flex-col justify-start gap-1">
              <div className="flex items-start justify-between gap-1.5">
                <div className="h-4 w-3/5 animate-pulse rounded-full bg-surface-muted sm:h-5" />
                <div className="h-4 w-16 shrink-0 animate-pulse rounded-full bg-surface-muted sm:h-5" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-full animate-pulse rounded-full bg-surface-muted" />
                <div className="h-3 w-4/5 animate-pulse rounded-full bg-surface-muted" />
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
