import { CustomModal } from "@/shared/components/CustomModal";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";
import { CalendarDays, Tag } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import type { Promotion } from "@/features/home/types/promotion.types";

type PromotionDetailModalProps = {
  promotion: Promotion;
  isOpen: boolean;
  onClose: () => void;
};

export function PromotionDetailModal({
  promotion,
  isOpen,
  onClose,
}: PromotionDetailModalProps) {
  const image = promotion.image
    ? { src: promotion.image, alt: promotion.imageAlt }
    : undefined;
  const hasImage = Boolean(image?.src);

  const content = (
    <div className="grid gap-4">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-surface-muted sm:aspect-[16/10]">
        {hasImage ? (
          <img
            src={image?.src}
            alt={image?.alt ?? promotion.title}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary-soft text-primary">
            <Tag className="size-16" />
          </div>
        )}
      </div>

      <div>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide",
            promotion.isTodayPromotion
              ? "bg-success text-success-foreground"
              : "bg-primary text-primary-foreground",
          )}
        >
          {promotion.isTodayPromotion ? "Vigente hoy" : promotion.dayLabel}
        </span>
        <h3 className="mt-2 font-heading text-2xl font-black leading-tight text-foreground sm:text-3xl">
          {promotion.title}
        </h3>
        {promotion.categoryName ? (
          <p className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
            {promotion.categoryName}
          </p>
        ) : null}
      </div>

      <p className="text-sm font-medium leading-6 text-muted-foreground">
        {promotion.description}
      </p>

      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-primary">
          <CalendarDays className="size-4" />
          Vigencia
        </p>
        <p className="mt-1 text-sm font-bold text-foreground">
          {promotion.dayLabel}
        </p>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden sm:block">
        <CustomModal
          isOpen={isOpen}
          title={promotion.title}
          description={promotion.categoryName}
          contentClassName="max-w-lg"
          onClose={onClose}
        >
          {content}
        </CustomModal>
      </div>
      <div className="sm:hidden">
        <ButtonSheetModal
          isOpen={isOpen}
          title={promotion.title}
          description={promotion.categoryName}
          contentClassName="max-w-lg"
          onClose={onClose}
        >
          {content}
        </ButtonSheetModal>
      </div>
    </>
  );
}
