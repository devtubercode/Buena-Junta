import { useState } from "react";
import { ShoppingCart, SlidersHorizontal } from "lucide-react";
import productPlaceholderImage from "@/assets/product-placeholder.svg";
import type { MenuProduct } from "@/features/menu/types/menu.types";
import {
  getProductButtonLabel,
  getProductCardPriceLabel,
  isSimpleProduct,
  requiresCustomization,
  hasAdditions,
  hasRequiredOptions,
} from "@/features/menu/utils/productHelpers";
import { cn } from "@/shared/utils/cn";

type ProductCardProps = {
  product: MenuProduct;
  quantityInCart?: number;
  onQuickAdd: () => void;
  onOpenCustomization: () => void;
};

function getProductImage(product: MenuProduct) {
  return (
    product.urlImage ?? {
      src: productPlaceholderImage,
      alt: `Imagen de referencia para ${product.name}`,
    }
  );
}

function getBadges(product: MenuProduct) {
  const badges: { label: string; variant: "required" | "additions" }[] = [];

  if (hasRequiredOptions(product)) {
    badges.push({ label: "Requiere selección", variant: "required" });
  }

  if (hasAdditions(product)) {
    badges.push({ label: "Adiciones disponibles", variant: "additions" });
  }

  return badges;
}

export function ProductCard({
  product,
  quantityInCart = 0,
  onQuickAdd,
  onOpenCustomization,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const isUnavailable = !product.is_available;
  const productImage = imageError
    ? getProductImage(product)
    : (product.urlImage ?? getProductImage(product));
  const isPlaceholder = !product.urlImage || imageError;
  const priceLabel = getProductCardPriceLabel(product);
  const buttonLabel = getProductButtonLabel(product, true);
  const badges = getBadges(product);
  const isInCart = quantityInCart > 0;
  const isSimple = isSimpleProduct(product);
  const showAddedBadge = isSimple && isInCart;

  return (
    <article
      className="group flex h-auto flex-row overflow-hidden rounded-2xl border border-border bg-surface shadow-elevated transition sm:h-full sm:flex-col"
      data-product-id={product.id}
    >
      <div className="relative aspect-square w-28 shrink-0 overflow-hidden bg-surface-muted sm:aspect-4/3 sm:w-full">
        <img
          src={productImage.src}
          alt={productImage.alt}
          onError={() => setImageError(true)}
          className={cn(
            "h-full w-full transition duration-300 group-hover:scale-[1.02]",
            isPlaceholder
              ? "bg-surface-raised object-contain p-3 sm:p-6"
              : "bg-surface-muted object-cover",
            isUnavailable && "opacity-60 grayscale",
          )}
          loading="lazy"
        />

        {isUnavailable ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-[1px]">
            <span className="rounded-full bg-surface-raised px-2 py-0.5 font-heading text-[10px] font-black uppercase tracking-wider text-foreground shadow-elevated sm:px-3 sm:py-1 sm:text-xs">
              No disponible
            </span>
          </div>
        ) : null}

        {showAddedBadge ? (
          <span className="absolute right-1 top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-background bg-primary px-1 text-[10px] font-black text-primary-foreground shadow-elevated sm:right-2 sm:top-2 sm:h-7 sm:min-w-7 sm:px-1.5 sm:text-xs">
            {quantityInCart}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-2.5 sm:p-4">
        <h3 className="line-clamp-1 font-heading text-base font-black leading-tight text-foreground sm:line-clamp-2 sm:text-lg md:text-xl">
          {product.name}
        </h3>

        <p className="mt-0.5  text-xs leading-relaxed text-muted-foreground sm:mt-1 sm:text-sm">
          {product.description}
        </p>

        {badges.length > 0 ? (
          <div className="mt-1.5 flex flex-wrap gap-1 sm:mt-2 sm:gap-1.5">
            {badges.map((badge) => (
              <span
                key={badge.label}
                className={cn(
                  "inline-flex items-center rounded-full px-1.5 py-0 text-[9px] font-black uppercase tracking-wide sm:px-2 sm:py-0.5 sm:text-[10px]",
                  badge.variant === "required"
                    ? "bg-warning-soft text-warning"
                    : "bg-primary-soft text-primary",
                )}
              >
                {badge.label}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-2 pt-2 sm:flex-row sm:items-end sm:justify-between sm:pt-3">
          <div className="min-w-0">
            {priceLabel ? (
              <p className="font-heading text-base font-black leading-none text-primary sm:text-xl md:text-2xl">
                {priceLabel}
              </p>
            ) : (
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground sm:text-xs">
                Precio no disponible
              </p>
            )}
          </div>

          <button
            type="button"
            disabled={isUnavailable || priceLabel === null}
            aria-label={buttonLabel}
            onClick={() => {
              if (requiresCustomization(product)) {
                onOpenCustomization();
              } else {
                onQuickAdd();
              }
            }}
            className="relative inline-flex min-h-9 w-auto shrink-0 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-11 sm:gap-2 sm:px-4"
          >
            {showAddedBadge ? (
              <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-foreground px-1 text-[9px] font-black text-primary shadow-sm sm:h-5 sm:min-w-5 sm:px-1.5 sm:text-[10px]">
                {quantityInCart}
              </span>
            ) : null}
            {requiresCustomization(product) ? (
              <SlidersHorizontal className="size-4 shrink-0" />
            ) : (
              <ShoppingCart className="size-4 shrink-0" />
            )}
            <span className="hidden truncate sm:inline">{buttonLabel}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
