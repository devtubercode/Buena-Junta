import { MenuSection } from "@/features/menu/components/MenuSection";
import { PromotionsCarousel } from "@/features/promotions/components/PromotionsCarousel";

export function HomePage() {
  return (
    <main id="inicio">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-7 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <PromotionsCarousel />
      </section>

      <MenuSection />
    </main>
  );
}
