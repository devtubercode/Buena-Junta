import { CustomModal } from "@/shared/components/CustomModal";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";
import { CalendarDays, ShoppingCart, Tag } from "lucide-react";
import { formatCOP } from "@/features/cart/utils/money";
import type { Promotion } from "@/features/home/types/promotion.types";

type PromotionDetailModalProps = {
  promotion: Promotion;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: () => void;
};

export function PromotionDetailModal({
  promotion,
  isOpen,
  onClose,
  onAddToCart,
}: PromotionDetailModalProps) {
  const image = promotion.image
    ? { src: promotion.image, alt: promotion.imageAlt }
    : undefined;
  const hasImage = Boolean(image?.src);

  const hasDiscount =
    promotion.originalPrice !== null &&
    promotion.originalPrice > promotion.promotionPrice;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((promotion.originalPrice! - promotion.promotionPrice) /
          promotion.originalPrice!) *
          100,
      )
    : null;

  const handleAddToCart = () => {
    onAddToCart?.();
    onClose();
  };

  const content = (
    <div className="grid gap-5 sm:pt-1">
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-surface-muted sm:aspect-auto sm:max-h-36">
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

      {/* Badge + Label */}
      <div className="flex flex-wrap items-center gap-2">
        {promotion.isTodayPromotion ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-success-foreground shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            Hoy
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-primary px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-primary-foreground shadow-sm">
            {promotion.dayLabel}
          </span>
        )}
        <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary-soft px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-primary">
          Oferta
        </span>
      </div>

      {/* Price section */}
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
          Precio promocional
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <span className="font-heading text-3xl font-black leading-none text-primary">
            {formatCOP(promotion.promotionPrice)}
          </span>
          {hasDiscount && discountPercentage !== null ? (
            <>
              <span className="mb-0.5 text-sm font-bold leading-none text-muted-foreground line-through">
                {formatCOP(promotion.originalPrice!)}
              </span>
              <span className="mb-0.5 inline-flex items-center rounded-full bg-success px-2 py-0.5 text-[10px] font-black leading-none text-success-foreground">
                -{discountPercentage}%
              </span>
            </>
          ) : null}
        </div>
      </div>

      {/* Validity */}
      <div className="rounded-xl border border-border bg-surface p-4">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-primary">
          <CalendarDays className="size-4" />
          Vigencia
        </p>
        <p className="mt-1 text-sm font-bold text-foreground">
          {promotion.dayLabel}
        </p>
      </div>

      {/* Add to cart button */}
      {onAddToCart ? (
        <button
          type="button"
          onClick={handleAddToCart}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-black uppercase tracking-wide text-primary-foreground shadow-elevated transition-all duration-200 hover:scale-[1.02] hover:opacity-95 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:scale-100"
        >
          <ShoppingCart className="size-4" aria-hidden="true" />
          Agregar al carrito
        </button>
      ) : null}
    </div>
  );

  return (
    <>
      <div className="hidden sm:block">
        <CustomModal
          isOpen={isOpen}
          title={promotion.title}
          description={promotion.description ?? "Oferta especial"}
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
          description={promotion.description ?? "Oferta especial"}
          contentClassName="max-w-lg"
          onClose={onClose}
        >
          {content}
        </ButtonSheetModal>
      </div>
    </>
  );
}
