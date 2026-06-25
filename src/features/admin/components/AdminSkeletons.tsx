import { cn } from "@/shared/utils/cn";

function SkeletonBlock({ className }: { className: string }) {
  return (
    <span
      className={cn(
        "block animate-pulse rounded-md bg-surface-muted",
        className,
      )}
      aria-hidden="true"
    />
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
      aria-hidden="true"
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="grid gap-4 rounded-lg border border-border bg-surface p-5 shadow-elevated"
        >
          <div className="flex items-center justify-between gap-4">
            <SkeletonBlock className="size-11 rounded-lg" />
            <SkeletonBlock className="h-10 w-16" />
          </div>
          <SkeletonBlock className="h-4 w-28" />
        </div>
      ))}
    </div>
  );
}

export function AdminMediaListSkeleton() {
  return (
    <div className="grid gap-3" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 rounded-lg border border-border bg-surface p-2.5 shadow-elevated sm:grid-cols-[84px_minmax(0,1fr)_auto] sm:p-3"
        >
          <SkeletonBlock className="aspect-square w-full rounded-md" />
          <div className="grid content-center gap-3">
            <SkeletonBlock className="h-5 w-44 max-w-full" />
            <SkeletonBlock className="h-3 w-72 max-w-full" />
            <div className="flex gap-1">
              <SkeletonBlock className="h-6 w-20 rounded-full" />
              <SkeletonBlock className="h-6 w-24 rounded-full" />
              <SkeletonBlock className="h-6 w-16 rounded-full" />
            </div>
          </div>
          <div className="col-span-2 flex items-center justify-between gap-2 border-t border-border pt-2 sm:col-span-1 sm:border-t-0 sm:pt-0 sm:justify-end">
            <SkeletonBlock className="h-7 w-16 rounded-full" />
            <div className="flex gap-2">
              <SkeletonBlock className="size-9 rounded-full" />
              <SkeletonBlock className="size-9 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminCategoriesSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-elevated" aria-hidden="true">
      <div className="grid grid-cols-[1fr_70px_80px] gap-3 border-b border-border px-4 py-3 sm:grid-cols-[1fr_90px_80px]">
        <SkeletonBlock className="h-3 w-20" />
        <SkeletonBlock className="h-3 w-14" />
        <span />
      </div>
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[1fr_70px_80px] items-center gap-3 border-b border-border px-4 py-3 last:border-b-0 sm:grid-cols-[1fr_90px_80px]"
        >
          <div className="grid gap-2">
            <SkeletonBlock className="h-4 w-36" />
            <SkeletonBlock className="h-3 w-24" />
          </div>
          <SkeletonBlock className="h-4 w-8" />
          <div className="flex items-center justify-end gap-1">
            <SkeletonBlock className="size-9 rounded-full" />
            <SkeletonBlock className="size-9 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminAdditionsSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-elevated" aria-hidden="true">
      <div className="grid grid-cols-[1fr_90px_80px] gap-3 border-b border-border px-4 py-3 sm:grid-cols-[1fr_120px_80px]">
        <SkeletonBlock className="h-3 w-20" />
        <SkeletonBlock className="h-3 w-14" />
        <span />
      </div>
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[1fr_90px_80px] items-center gap-3 border-b border-border px-4 py-3 last:border-b-0 sm:grid-cols-[1fr_120px_80px]"
        >
          <div className="grid gap-2">
            <SkeletonBlock className="h-4 w-36" />
            <SkeletonBlock className="h-3 w-48" />
          </div>
          <SkeletonBlock className="h-4 w-12" />
          <div className="flex items-center justify-end gap-1">
            <SkeletonBlock className="size-9 rounded-full" />
            <SkeletonBlock className="size-9 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
