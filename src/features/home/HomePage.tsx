import { MenuSection } from "@/features/menu/components/MenuSection";
import { PromotionsCarousel } from "@/features/home/components/promotions/PromotionsCarousel";

export function HomePage() {
  return (
    <main id="inicio">
      <section className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-5 pt-0 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
        <PromotionsCarousel />
      </section>

      <MenuSection />
    </main>
  );
}
