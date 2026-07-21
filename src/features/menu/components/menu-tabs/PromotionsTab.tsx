import { PromotionCard } from "@/features/menu/components/PromotionCard";
import { EmptyState } from "@/shared/components/EmptyState";
import type { Promotion } from "@/features/home/types/promotion.types";
import { Tag } from "lucide-react";

type PromotionsTabProps = {
  promotions: Promotion[];
  isLoading: boolean;
  onOpenPromotionDetail: (promotion: Promotion) => void;
};

export function PromotionsTab({
  promotions,
  isLoading,
  onOpenPromotionDetail,
}: PromotionsTabProps) {
  return (
    <section
      id="menu-tabpanel-promotions"
      role="tabpanel"
      aria-labelledby="menu-tab-promotions"
      className="grid gap-4"
    >
      <div>
        <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">
          Ofertas especiales
        </p>
        <h2 className="mt-2 font-heading text-4xl font-black leading-none text-foreground">
          Promociones
        </h2>
        <p className="mt-2 text-sm font-medium text-muted-foreground">
          Descubre las promociones activas de esta semana.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="aspect-[4/3] animate-pulse rounded-2xl bg-surface-muted"
            />
          ))}
        </div>
      ) : promotions.length === 0 ? (
        <EmptyState
          title="No hay promociones activas"
          description="Vuelve pronto para conocer nuestras ofertas."
          icon={<Tag className="size-8" />}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {promotions.map((promotion) => (
            <PromotionCard
              key={promotion.slug}
              promotion={promotion}
              onOpenDetail={() => onOpenPromotionDetail(promotion)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
