export const PromotionsCarouselSkeleton = () => {
  return (
    <section
      aria-label="Cargando promociones"
      className="relative -mx-4 overflow-hidden sm:mx-0"
    >
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 py-2 scrollbar-none sm:gap-5 sm:px-0 sm:py-4 [&::-webkit-scrollbar]:hidden">
        {Array.from({ length: 2 }).map((_, index) => (
          <article
            key={index}
            className="grid h-104 min-w-[90%] animate-pulse grid-rows-[170px_1fr] overflow-hidden border border-(--border)/30 bg-foreground shadow-elevated sm:h-[28rem] sm:min-w-[78%] sm:grid-rows-[190px_1fr] md:h-90 md:min-w-[64%] md:grid-cols-[0.78fr_1.22fr] md:grid-rows-1 lg:min-w-[58%]"
          >
            <div className="relative order-2 flex min-h-0 flex-col justify-between p-4 sm:p-6 md:order-1 lg:p-7">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="h-5 w-20 rounded-full bg-surface-muted sm:h-6 sm:w-24" />
                  <div className="h-5 w-28 rounded-full bg-surface-muted sm:h-6 sm:w-32" />
                </div>
                <div className="mt-3 space-y-2 sm:mt-5">
                  <div className="h-7 w-4/5 rounded-full bg-surface-muted sm:h-8 md:h-10 lg:h-12" />
                  <div className="h-3.5 w-full rounded-full bg-surface-muted sm:h-4" />
                  <div className="hidden h-3.5 w-2/3 rounded-full bg-surface-muted sm:block" />
                </div>
              </div>
              <div className="mt-3 pt-1 sm:mt-5 sm:pt-2">
                <div className="h-12 w-full rounded-full bg-surface-muted sm:w-48" />
              </div>
            </div>
            <div className="order-1 m-2 bg-surface-muted sm:m-3 md:order-2 md:m-4" />
          </article>
        ))}
      </div>

      <div className="mt-3 flex justify-center sm:mt-4">
        <div className="inline-flex items-center gap-1 rounded-full bg-(--promotion-text)/10 px-2 py-1.5 backdrop-blur-sm sm:gap-2 sm:px-3 sm:py-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <span
              key={index}
              className={`block h-2 rounded-full ${
                index === 0 ? "w-6 bg-primary" : "w-2 bg-(--promotion-text)/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
