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

export function AdminProductsSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]"
      aria-hidden="true"
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="flex min-w-0 flex-row gap-3 rounded-xl border border-border bg-surface p-3 shadow-elevated sm:flex-col"
        >
          <SkeletonBlock className="size-18 shrink-0 rounded-lg sm:aspect-video sm:h-auto sm:w-full" />

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex min-w-0 items-start justify-between gap-2">
              <div className="grid min-w-0 gap-2">
                <SkeletonBlock className="h-5 w-36 max-w-full rounded-md" />
                <SkeletonBlock className="h-3 w-24 max-w-full rounded-md" />
              </div>
              <SkeletonBlock className="h-6 w-14 shrink-0 rounded-full" />
            </div>

            <SkeletonBlock className="mt-1.5 h-4 w-16 rounded-md" />

            <div className="mt-2 flex flex-wrap gap-1.5">
              <SkeletonBlock className="h-5 w-16 rounded-full" />
              <SkeletonBlock className="h-5 w-20 rounded-full" />
            </div>

            <div className="mt-auto flex items-center justify-end gap-2 border-t border-border pt-2.5 sm:pt-3">
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
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]"
      aria-hidden="true"
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-surface p-3 shadow-elevated"
        >
          <SkeletonBlock className="size-12 shrink-0 rounded-xl" />
          <div className="grid min-w-0 flex-1 gap-2">
            <SkeletonBlock className="h-5 w-36 max-w-full rounded-md" />
            <SkeletonBlock className="h-3 w-24 max-w-full rounded-md" />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <SkeletonBlock className="size-9 rounded-full" />
            <SkeletonBlock className="size-9 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminPromotionsSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]"
      aria-hidden="true"
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="flex min-w-0 flex-row gap-3 rounded-xl border border-border bg-surface p-3 shadow-elevated sm:flex-col"
        >
          <SkeletonBlock className="size-18 shrink-0 rounded-lg sm:aspect-video sm:h-auto sm:w-full" />

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex min-w-0 items-start justify-between gap-2">
              <div className="grid min-w-0 gap-2">
                <SkeletonBlock className="h-5 w-36 max-w-full rounded-md" />
                <SkeletonBlock className="h-3 w-28 max-w-full rounded-md" />
              </div>
              <SkeletonBlock className="h-6 w-14 shrink-0 rounded-full" />
            </div>

            <SkeletonBlock className="mt-1.5 h-4 w-full max-w-[12rem] rounded-md" />

            <div className="mt-auto flex items-center justify-end gap-2 border-t border-border pt-2.5 sm:pt-3">
              <SkeletonBlock className="size-11 rounded-full" />
              <SkeletonBlock className="size-11 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminPromotionDetailSkeleton() {
  return (
    <div
      className="grid min-w-0 max-w-full gap-4 xl:grid-cols-[minmax(0,1fr)_420px] xl:gap-5"
      aria-hidden="true"
    >
      <div className="grid min-w-0 content-start gap-4">
        <section className="grid min-w-0 content-start gap-4 rounded-xl border border-border bg-surface p-3 shadow-elevated sm:p-5">
          <div className="border-b border-border pb-3">
            <SkeletonBlock className="h-6 w-48 max-w-full rounded-md" />
            <SkeletonBlock className="mt-2 h-3 w-64 max-w-full rounded-md" />
          </div>
          <SkeletonBlock className="h-11 w-full rounded-lg" />
          <SkeletonBlock className="h-11 w-full rounded-lg" />
          <SkeletonBlock className="h-24 w-full rounded-lg" />
        </section>

        <section className="grid min-w-0 content-start gap-4 rounded-xl border border-border bg-surface p-3 shadow-elevated sm:p-5">
          <div className="border-b border-border pb-3">
            <SkeletonBlock className="h-6 w-32 max-w-full rounded-md" />
            <SkeletonBlock className="mt-2 h-3 w-56 max-w-full rounded-md" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SkeletonBlock className="h-11 w-full rounded-lg" />
            <SkeletonBlock className="h-11 w-full rounded-lg" />
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <SkeletonBlock
                key={index}
                className="h-10 w-12 rounded-full"
              />
            ))}
          </div>
        </section>

        <section className="grid min-w-0 content-start gap-4 rounded-xl border border-border bg-surface p-3 shadow-elevated sm:p-5">
          <div className="border-b border-border pb-3">
            <SkeletonBlock className="h-6 w-36 max-w-full rounded-md" />
            <SkeletonBlock className="mt-2 h-3 w-64 max-w-full rounded-md" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SkeletonBlock className="h-11 w-full rounded-lg" />
            <SkeletonBlock className="h-11 w-full rounded-lg" />
          </div>
        </section>

        <section className="grid min-w-0 content-start gap-4 rounded-xl border border-border bg-surface p-3 shadow-elevated sm:p-5">
          <div className="border-b border-border pb-3">
            <SkeletonBlock className="h-6 w-28 max-w-full rounded-md" />
            <SkeletonBlock className="mt-2 h-3 w-60 max-w-full rounded-md" />
          </div>
          <SkeletonBlock className="h-24 w-full rounded-lg" />
        </section>
      </div>

      <div className="grid min-w-0 content-start gap-4">
        <section className="grid min-w-0 content-start gap-4 rounded-xl border border-border bg-surface p-3 shadow-elevated sm:p-5">
          <div className="border-b border-border pb-3">
            <SkeletonBlock className="h-6 w-40 max-w-full rounded-md" />
            <SkeletonBlock className="mt-2 h-3 w-56 max-w-full rounded-md" />
          </div>
          <SkeletonBlock className="aspect-video w-full rounded-lg" />
          <SkeletonBlock className="h-14 w-full rounded-xl" />
          <SkeletonBlock className="h-12 w-full rounded-full" />
        </section>
      </div>
    </div>
  );
}

export function AdminAdditionsSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]"
      aria-hidden="true"
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="flex min-w-0 flex-row gap-3 rounded-xl border border-border bg-surface p-3 shadow-elevated sm:flex-col"
        >
          <SkeletonBlock className="size-18 shrink-0 rounded-lg sm:aspect-video sm:h-auto sm:w-full" />

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="grid min-w-0 gap-2">
              <SkeletonBlock className="h-5 w-36 max-w-full rounded-md" />
              <SkeletonBlock className="h-4 w-20 max-w-full rounded-md" />
            </div>

            <SkeletonBlock className="mt-1.5 h-4 w-full max-w-[12rem] rounded-md" />

            <div className="mt-auto flex items-center justify-end gap-2 border-t border-border pt-2.5 sm:pt-3">
              <SkeletonBlock className="size-11 rounded-full" />
              <SkeletonBlock className="size-11 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminProductDetailSkeleton() {
  return (
    <div
      className="grid min-w-0 max-w-full gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(500px,0.46fr)]"
      aria-hidden="true"
    >
      {/* Formulario — columna izquierda */}
      <section className="grid min-w-0 content-start gap-4 rounded-xl border border-border bg-surface p-3 shadow-elevated sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-3">
          <div className="grid gap-2">
            <SkeletonBlock className="h-6 w-48 max-w-full rounded-md" />
            <SkeletonBlock className="h-3 w-64 max-w-full rounded-md" />
          </div>
          <SkeletonBlock className="h-7 w-24 rounded-full" />
        </div>

        <SkeletonBlock className="h-11 w-full rounded-lg" />

        <div className="grid gap-4 sm:grid-cols-2 items-start">
          <SkeletonBlock className="h-11 w-full rounded-lg" />
          <SkeletonBlock className="h-11 w-full rounded-lg" />
        </div>

        <SkeletonBlock className="h-28 w-full rounded-lg" />
        <SkeletonBlock className="aspect-video w-full rounded-lg" />
        <SkeletonBlock className="h-11 w-full rounded-lg" />
        <SkeletonBlock className="h-11 w-full rounded-lg" />
        <SkeletonBlock className="h-6 w-56 max-w-full rounded-md" />
        <SkeletonBlock className="h-12 w-full rounded-full sm:w-40" />
      </section>

      {/* Columna derecha + secciones debajo */}
      <div className="flex flex-col gap-2">
        {/* Variantes */}
        <section className="grid h-fit min-w-0 content-start gap-4 rounded-xl border border-border bg-surface p-3 shadow-elevated sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="grid gap-2">
              <SkeletonBlock className="h-6 w-32 max-w-full rounded-md" />
              <SkeletonBlock className="h-3 w-16 max-w-full rounded-md" />
            </div>
            <SkeletonBlock className="h-11 w-24 rounded-full" />
          </div>

          <div className="grid gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface-muted p-3 sm:p-4"
              >
                <div className="grid min-w-0 flex-1 gap-2">
                  <SkeletonBlock className="h-5 w-36 max-w-full rounded-md" />
                  <SkeletonBlock className="h-3 w-24 max-w-full rounded-md" />
                </div>
                <div className="flex items-center gap-1">
                  <SkeletonBlock className="size-9 rounded-full" />
                  <SkeletonBlock className="size-9 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Grupos de opciones */}
        <section className="grid h-fit min-w-0 content-start gap-4 rounded-xl border border-border bg-surface p-3 shadow-elevated sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="grid gap-2">
              <SkeletonBlock className="h-6 w-44 max-w-full rounded-md" />
              <SkeletonBlock className="h-3 w-16 max-w-full rounded-md" />
            </div>
            <SkeletonBlock className="h-11 w-28 rounded-full" />
          </div>

          <div className="grid gap-4">
            {Array.from({ length: 2 }).map((_, groupIndex) => (
              <article
                key={groupIndex}
                className="grid gap-4 rounded-xl border border-border bg-surface-muted p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="grid gap-2">
                    <SkeletonBlock className="h-5 w-32 max-w-full rounded-md" />
                    <div className="flex flex-wrap gap-2">
                      <SkeletonBlock className="h-5 w-16 rounded-full" />
                      <SkeletonBlock className="h-5 w-14 rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <SkeletonBlock className="size-9 rounded-full" />
                    <SkeletonBlock className="size-9 rounded-full" />
                  </div>
                </div>

                <div className="grid gap-2">
                  {Array.from({ length: 3 }).map((_, valueIndex) => (
                    <div
                      key={valueIndex}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-2.5"
                    >
                      <SkeletonBlock className="h-4 w-28 max-w-full rounded-md" />
                      <div className="flex items-center gap-1">
                        <SkeletonBlock className="size-8 rounded-full" />
                        <SkeletonBlock className="size-8 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Adiciones */}
        <section className="grid h-fit min-w-0 content-start gap-4 rounded-xl border border-border bg-surface p-3 shadow-elevated sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="grid gap-2">
              <SkeletonBlock className="h-6 w-28 max-w-full rounded-md" />
              <SkeletonBlock className="h-3 w-16 max-w-full rounded-md" />
            </div>
            <SkeletonBlock className="h-11 w-24 rounded-full" />
          </div>

          <div className="grid gap-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface-muted p-3 sm:p-4"
              >
                <div className="grid min-w-0 flex-1 gap-2">
                  <SkeletonBlock className="h-5 w-36 max-w-full rounded-md" />
                  <SkeletonBlock className="h-3 w-24 max-w-full rounded-md" />
                </div>
                <div className="flex items-center gap-1">
                  <SkeletonBlock className="size-9 rounded-full" />
                  <SkeletonBlock className="size-9 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
