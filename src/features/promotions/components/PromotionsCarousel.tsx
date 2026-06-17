import { Link } from "react-router";
import { BlossomCarousel } from "@blossom-carousel/react";
import { appRoutes } from "@/app/routes";
import { promotions } from "@/features/promotions/data/promotions";
import { usePromotionsCarousel } from "@/features/promotions/hooks/usePromotionsCarousel";

export function PromotionsCarousel() {
  const {
    activePromotion,
    carouselRef,
    choosePromotion,
    pauseTemporarily,
    showNextPromotion,
    showPreviousPromotion,
  } = usePromotionsCarousel({ itemCount: promotions.length });

  if (promotions.length === 0) {
    return (
      <section className="rounded-lg border border-border bg-surface p-6 shadow-elevated">
        <h2 className="m-0 font-heading text-2xl font-black tracking-normal text-foreground">
          Promociones
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Muy pronto tendremos nuevos especiales disponibles.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="promotions-heading"
      aria-roledescription="carousel"
      className="rounded-lg border border-border bg-surface p-3 shadow-elevated sm:p-4"
      onFocusCapture={pauseTemporarily}
      onPointerDown={pauseTemporarily}
      onTouchStart={pauseTemporarily}
      onWheel={pauseTemporarily}
    >
      <div className="mb-3 flex items-center justify-between gap-3 px-1">
        <div className="text-left">
          <h2
            id="promotions-heading"
            className="m-0 font-heading text-2xl font-bold tracking-normal text-foreground"
          >
            Promociones
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Especiales de la semana.
          </p>
        </div>
      </div>

      <BlossomCarousel
        ref={carouselRef}
        as="ul"
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth p-0 scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {promotions.map((promotion) => (
          <li
            key={promotion.id}
            className="min-w-full list-none snap-start sm:min-w-[70%] lg:min-w-[32%]"
          >
            <article className="grid min-h-90 overflow-hidden rounded-lg border border-border bg-surface-raised text-left sm:min-h-85">
              <div className="relative aspect-16/10 overflow-hidden bg-surface-muted">
                {promotion.image ? (
                  <img
                    src={promotion.image}
                    alt={promotion.imageAlt}
                    className="h-full w-full object-cover"
                  />
                ) : null}
                <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-primary">
                  {promotion.tag}
                </span>
              </div>

              <div className="flex flex-col justify-between gap-5 p-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                    {promotion.weekdayLabel}
                  </p>
                  <h3 className="mt-2 font-heading text-3xl font-bold leading-tight tracking-normal text-foreground">
                    {promotion.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-muted-foreground">
                    {promotion.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">
                        Disponible
                      </p>
                      <p className="font-heading text-2xl font-bold text-primary">
                        {promotion.categoryName}
                      </p>
                    </div>
                    <p className="rounded-full border border-border bg-surface-muted px-3 py-2 text-sm font-semibold text-foreground">
                      {promotion.productCount}{" "}
                      {promotion.productCount === 1 ? "producto" : "productos"}
                    </p>
                  </div>

                  <Link
                    to={appRoutes.menu}
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Ver opciones
                  </Link>
                </div>
              </div>
            </article>
          </li>
        ))}
      </BlossomCarousel>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex gap-2" role="group" aria-label="Elegir promoción">
          {promotions.map((promotion, index) => (
            <button
              key={promotion.id}
              type="button"
              className="h-3 rounded-full border border-primary transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary data-[active=true]:w-8 data-[active=true]:bg-primary data-[active=false]:w-3 data-[active=false]:bg-transparent"
              data-active={activePromotion === index}
              aria-label={`Ver promoción ${index + 1} de ${promotions.length}`}
              aria-current={activePromotion === index}
              onClick={() => choosePromotion(index)}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface text-lg font-bold text-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Promoción anterior"
            onClick={showPreviousPromotion}
          >
            &lt;
          </button>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface text-lg font-bold text-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Siguiente promoción"
            onClick={() => showNextPromotion()}
          >
            &gt;
          </button>
        </div>
      </div>
    </section>
  );
}
