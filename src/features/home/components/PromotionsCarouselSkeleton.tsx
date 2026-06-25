export const PromotionsCarouselSkeleton = () => {
  return (
    <section
      aria-label="Cargando promociones"
      className="relative -mx-4 overflow-hidden bg-transparent sm:mx-0"
    >
      <div className="flex gap-3 overflow-hidden sm:gap-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <article
            key={index}
            className="grid h-117.5 min-w-[92%] animate-pulse grid-rows-[230px_1fr] overflow-hidden bg-surface shadow-elevated sm:h-115 sm:min-w-[76%] sm:grid-rows-[250px_1fr] md:h-90 md:min-w-[64%] md:grid-cols-[0.78fr_1.22fr] md:grid-rows-1"
          >
            <div className="order-2 space-y-4 p-4 sm:p-5 md:order-1 lg:p-6">
              <div className="flex gap-2">
                <div className="h-7 w-16 rounded-full bg-surface-muted" />
                <div className="h-7 w-28 rounded-full bg-surface-muted" />
              </div>
              <div className="space-y-3">
                <div className="h-9 w-4/5 rounded-full bg-surface-muted" />
                <div className="h-4 w-full rounded-full bg-surface-muted" />
                <div className="h-4 w-2/3 rounded-full bg-surface-muted" />
              </div>
              <div className="pt-10">
                <div className="h-12 w-44 rounded-full bg-surface-muted" />
              </div>
            </div>
            <div className="order-1 bg-surface-muted md:order-2" />
          </article>
        ))}
      </div>
    </section>
  );
};
