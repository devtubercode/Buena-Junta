import type { Promotion } from "@/features/home/types/promotion.types";
import { CalendarDays, Tag } from "lucide-react";
import { cn } from "@/shared/utils/cn";

type PromotionCardProps = {
  promotion: Promotion;
  onOpenDetail: () => void;
};

export function PromotionCard({ promotion, onOpenDetail }: PromotionCardProps) {
  const image = promotion.image
    ? { src: promotion.image, alt: promotion.imageAlt }
    : undefined;
  const hasImage = Boolean(image?.src);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-surface shadow-elevated transition hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-muted">
        {hasImage ? (
          <img
            src={image?.src}
            alt={image?.alt ?? promotion.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary-soft text-primary">
            <Tag className="size-12" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-foreground/80 to-transparent p-4 pt-16">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide",
              promotion.isTodayPromotion
                ? "bg-success text-success-foreground"
                : "bg-primary text-primary-foreground",
            )}
          >
            {promotion.isTodayPromotion ? "Hoy" : promotion.dayLabel}
          </span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
          {promotion.categoryName ?? "Promoción"}
        </p>
        <h3 className="mt-1 font-heading text-xl font-black leading-tight text-foreground">
          {promotion.title}
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
          <CalendarDays className="size-3.5" />
          {promotion.dayLabel}
        </p>

        <button
          type="button"
          onClick={onOpenDetail}
          className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-black text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label={`Ver detalle de ${promotion.title}`}
        >
          Ver detalle
        </button>
      </div>
    </article>
  );
}
