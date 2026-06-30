import { BlossomCarousel } from "@blossom-carousel/react";
import "@blossom-carousel/core/style.css";
import { usePromotionsCarousel } from "@/features/home/hooks/usePromotionCarousel";
import { usePromotionData } from "@/features/home/hooks/usePromotionData";
import { useMenuFilterStore } from "@/store/menu-filter/useMenuFilterStore";

import type { Promotion } from "@/features/home/types/promotion.types";
import { PromotionsCarouselSkeleton } from "./PromotionsCarouselSkeleton";

export const PromotionsCarousel = () => {
  const { promotions, isLoading, error } = usePromotionData();
  const { applyPromotionFilter } = useMenuFilterStore((state) => state);

  const { activePromotion, carouselRef, pauseTemporarily } =
    usePromotionsCarousel({ itemCount: promotions.length });

  const handlePromotionAction = (promotion: Promotion) => {
    applyPromotionFilter({
      categorySlug: promotion.categorySlug,
      promotionSlug: promotion.slug,
    });

    window.setTimeout(() => {
      const menuSection = document.getElementById("menu");
      const headerHeight =
        document.querySelector("header")?.getBoundingClientRect().height ?? 0;

      if (!menuSection) {
        return;
      }

      window.scrollTo({
        top:
          menuSection.getBoundingClientRect().top +
          window.scrollY -
          headerHeight,
        behavior: "smooth",
      });
    }, 0);
  };

  const goToSlide = (index: number) => {
    const carousel = carouselRef.current?.element;
    const slide = carousel?.children[index] as HTMLElement | undefined;
    slide?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  if (isLoading) {
    return <PromotionsCarouselSkeleton />;
  }

  if (error || promotions.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="promotions-heading"
      aria-roledescription="carousel"
      className="relative -mx-4 overflow-hidden sm:mx-0"
      onFocusCapture={pauseTemporarily}
      onPointerDown={pauseTemporarily}
      onTouchStart={pauseTemporarily}
      onWheel={pauseTemporarily}
    >
      <h2 id="promotions-heading" className="sr-only">
        Promociones
      </h2>

      <BlossomCarousel
        ref={carouselRef}
        as="ul"
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth  scrollbar-none sm:gap-5  [&::-webkit-scrollbar]:hidden"
      >
        {promotions.map((promotion, index) => (
          <li
            key={promotion.slug}
            id={`promotion-slide-${promotion.slug}`}
            className="min-w-[90%] list-none snap-center sm:min-w-[78%] lg:min-w-[58%]"
            data-blossom-slide
            aria-current={activePromotion === index}
          >
            <article className="group relative grid h-104 grid-rows-[170px_1fr] overflow-hidden  border border-(--border)/30 bg-foreground shadow-elevated transition duration-300 ease-out hover:-translate-y-1 hover:shadow-2xl motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:h-[28rem] sm:grid-rows-[190px_1fr] md:h-90 md:grid-cols-[0.78fr_1.22fr] md:grid-rows-1">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,var(--promotion-glow),transparent_34%),linear-gradient(135deg,var(--promotion-overlay-start),var(--promotion-overlay-end))]" />

              <div className="relative z-10 order-2 flex min-h-0 flex-col justify-between p-4 sm:p-6 md:order-1 lg:p-7">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-primary-foreground shadow-sm sm:px-3 sm:py-1 sm:text-xs">
                      {promotion.tag}
                    </span>

                    {promotion.isTodayPromotion ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-(--promotion-text)/25 bg-(--promotion-text)/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-(--promotion-text) sm:px-3 sm:py-1 sm:text-xs">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75 motion-reduce:animate-none" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                        </span>
                        Disponible hoy
                      </span>
                    ) : null}

                    <span className="rounded-full border border-(--promotion-text)/25 bg-(--promotion-text)/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-(--promotion-text) sm:px-3 sm:py-1 sm:text-xs">
                      {promotion.categoryName}
                    </span>
                  </div>

                  <div className="mt-3 max-w-xl sm:mt-5">
                    <h3 className="font-heading text-xl font-black uppercase leading-tight tracking-tight text-(--promotion-text) text-balance sm:text-2xl md:text-3xl lg:text-[2.75rem]">
                      {promotion.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-xs font-medium leading-relaxed text-(--promotion-text)/80 sm:line-clamp-4 sm:text-sm sm:leading-6 md:line-clamp-none md:text-base md:leading-6">
                      {promotion.description}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-1 sm:mt-5 sm:pt-2">
                  <button
                    type="button"
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-black uppercase tracking-wide text-primary-foreground shadow-elevated transition-all duration-200 hover:scale-[1.02] hover:opacity-95 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98] motion-reduce:transition-none sm:w-auto sm:min-w-48"
                    onClick={() => handlePromotionAction(promotion)}
                  >
                    Ver promociones
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 10a.75.75 0 01.75-.75h10.638l-3.478-3.48a.75.75 0 111.061-1.06l4.769 4.77a.75.75 0 010 1.06l-4.769 4.77a.75.75 0 11-1.061-1.06l3.478-3.48H3.75A.75.75 0 013 10z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="relative z-10 order-1 m-2 overflow-hidden rounded-md bg-surface-muted sm:m-3 md:order-2 md:m-4">
                {promotion.image ? (
                  <img
                    src={promotion.image}
                    alt={promotion.imageAlt}
                    className="h-full w-full object-cover object-center transition duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                ) : null}
              </div>
            </article>
          </li>
        ))}
      </BlossomCarousel>

      <div className="mt-0 flex justify-center sm:mt-0">
        <div
          className="inline-flex items-center gap-1 rounded-full bg-(--promotion-text)/10 px-2 py-1.5 backdrop-blur-sm sm:gap-2 sm:px-3 sm:py-2"
          role="tablist"
          aria-label="Indicadores de promociones"
        >
          {promotions.map((promotion, index) => (
            <button
              key={promotion.slug}
              type="button"
              role="tab"
              aria-selected={activePromotion === index}
              aria-label={`Ir a promoción ${index + 1}: ${promotion.title}`}
              onClick={() => goToSlide(index)}
              className="relative flex h-11 min-w-11 items-center justify-center rounded-full transition-colors focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary sm:min-w-12"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-300 ${
                  activePromotion === index
                    ? "w-6 bg-primary"
                    : "w-2 bg-(--promotion-text)/40 hover:bg-(--promotion-text)/60"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
