export const ProductGridSkeleton = ({ count = 4 }: { count?: number }) => {
  return (
    <div
      className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, index) => (
        <article
          key={index}
          className="flex h-full min-w-0 flex-row overflow-hidden rounded-2xl border border-border bg-surface shadow-elevated"
        >
          <div className="w-[38%] shrink-0 animate-pulse bg-surface-muted sm:w-[35%]" />
          <div className="flex flex-1 flex-col justify-between p-3 sm:p-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="h-5 w-2/3 animate-pulse rounded-full bg-surface-muted" />
                <div className="h-5 w-16 animate-pulse rounded-full bg-surface-muted" />
              </div>
              <div className="h-4 w-20 animate-pulse rounded-full bg-surface-muted" />
              <div className="space-y-1.5">
                <div className="h-4 w-full animate-pulse rounded-full bg-surface-muted" />
                <div className="h-4 w-3/4 animate-pulse rounded-full bg-surface-muted" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 pt-3">
              <div className="h-5 w-20 animate-pulse rounded-full bg-surface-muted" />
              <div className="h-10 w-28 animate-pulse rounded-full bg-surface-muted" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
