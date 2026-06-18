import { BlossomCarousel } from "@blossom-carousel/react";
import "@blossom-carousel/core/style.css";
import { promotions } from "@/features/home/components/promotions/promotions";
import {
  getCurrentWeekday,
  sortPromotionsForWeekday,
} from "@/features/home/components/promotions/promotionSchedule";
import { usePromotionsCarousel } from "@/features/home/components/promotions/usePromotionsCarousel";
import { useMenuFilterStore } from "@/features/menu/store/useMenuFilterStore";

export function PromotionsCarousel() {
  const applyPromotionFilter = useMenuFilterStore(
    (state) => state.applyPromotionFilter,
  );
  const today = getCurrentWeekday();
  const orderedPromotions = sortPromotionsForWeekday(promotions, today);

  const { activePromotion, carouselRef, pauseTemporarily } =
    usePromotionsCarousel({ itemCount: orderedPromotions.length });

  const handlePromotionAction = (promotion: (typeof promotions)[number]) => {
    applyPromotionFilter({
      categoryId: promotion.categoryId,
      promotionId: promotion.id,
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

  return (
    <section
      aria-labelledby="promotions-heading"
      aria-roledescription="carousel"
      className="relative -mx-4 overflow-hidden bg-transparent sm:mx-0"
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
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-0 py-0 scrollbar-none sm:gap-4 [&::-webkit-scrollbar]:hidden"
      >
        {orderedPromotions.map((promotion, index) => (
          <li
            key={promotion.id}
            id={`promotion-slide-${promotion.id}`}
            className="min-w-[92%] list-none snap-center sm:min-w-[76%] lg:min-w-[64%]"
            data-blossom-slide
            aria-current={activePromotion === index}
          >
            <article className="relative grid h-[470px] grid-rows-[230px_1fr] overflow-hidden bg-foreground text-left text-primary-foreground shadow-elevated sm:h-[460px] sm:grid-rows-[250px_1fr] md:h-[360px] md:grid-cols-[0.78fr_1.22fr] md:grid-rows-1">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,122,26,0.38),transparent_34%),linear-gradient(135deg,rgba(50,25,20,0.96),rgba(120,42,20,0.78))]" />

              <div className="relative z-10 order-2 flex min-h-0 flex-col p-4 pb-5 sm:p-5 md:order-1 lg:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-black uppercase tracking-normal text-primary-foreground">
                    {promotion.tag}
                  </span>
                  {promotion.isTodayPromotion ? (
                    <span className="rounded-full border border-primary/60 bg-primary/15 px-3 py-1 text-xs font-black uppercase tracking-normal text-primary">
                      Disponible hoy
                    </span>
                  ) : null}
                  <span className="rounded-full border border-white/30 bg-white/12 px-3 py-1 text-xs font-bold uppercase tracking-normal text-white">
                    {promotion.categoryName}
                  </span>
                </div>

                <div className="mt-3 max-w-xl sm:mt-4">
                  <h3 className="font-heading text-3xl font-black leading-none tracking-normal text-white sm:text-4xl">
                    {promotion.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm font-medium leading-5 text-white/82 sm:text-base sm:leading-6">
                    {promotion.description}
                  </p>
                </div>

                <div className="mt-auto pt-4">
                  <button
                    type="button"
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto sm:min-w-48"
                    onClick={() => handlePromotionAction(promotion)}
                  >
                    Ver promociones
                  </button>
                </div>
              </div>

              <div className="relative z-10 order-1 min-h-0 overflow-hidden bg-surface-muted md:order-2">
                {promotion.image ? (
                  <img
                    src={promotion.image}
                    alt={promotion.imageAlt}
                    className="h-full w-full object-cover object-center"
                  />
                ) : null}
              </div>
            </article>
          </li>
        ))}
      </BlossomCarousel>
    </section>
  );
}
