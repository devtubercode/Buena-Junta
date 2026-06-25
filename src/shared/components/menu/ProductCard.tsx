import { useState } from "react";
import { ShoppingCart, SlidersHorizontal, Check } from "lucide-react";
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
  const productImage = imageError ? getProductImage(product) : (product.urlImage ?? getProductImage(product));
  const priceLabel = getProductCardPriceLabel(product);
  const buttonLabel = getProductButtonLabel(product, true);
  const badges = getBadges(product);
  const isInCart = quantityInCart > 0;
  const isSimple = isSimpleProduct(product);
  const showAddedBadge = isSimple && isInCart;

  return (
    <article
      className="grid grid-cols-[104px_minmax(0,1fr)] gap-3 rounded-lg border border-border bg-surface p-2 shadow-elevated sm:grid-cols-[116px_minmax(0,1fr)]"
      data-product-id={product.id}
    >
      <img
        src={productImage.src}
        alt={productImage.alt}
        onError={() => setImageError(true)}
        className={cn(
          "h-full min-h-28 w-full rounded-md border border-border object-cover",
          product.urlImage && !imageError
            ? "bg-surface-muted"
            : "bg-surface-raised object-contain p-2",
        )}
        loading="lazy"
      />

      <div className="flex min-w-0 flex-col py-1 pr-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="line-clamp-2 font-heading text-[1.55rem] font-black leading-[0.98] text-foreground">
              {product.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm font-medium leading-5 text-muted-foreground">
              {product.description}
            </p>
          </div>
          {showAddedBadge ? (
            <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-success p-1 text-success-foreground shadow-elevated">
              <Check className="size-3.5" />
            </span>
          ) : null}
        </div>

        {badges.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {badges.map((badge) => (
              <span
                key={badge.label}
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide",
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

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="min-w-0">
            {priceLabel ? (
              <p className="font-heading text-[1.55rem] font-black leading-none text-primary">
                {priceLabel}
              </p>
            ) : (
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Precio no disponible
              </p>
            )}
          </div>

          <button
            type="button"
            disabled={isUnavailable || priceLabel === null}
            onClick={() => {
              if (requiresCustomization(product)) {
                onOpenCustomization();
              } else {
                onQuickAdd();
              }
            }}
            className="relative inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md bg-primary px-3.5 text-[13px] font-black text-primary-foreground shadow-elevated transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {showAddedBadge ? (
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full border border-background bg-success text-[9px] font-black text-success-foreground shadow-elevated">
                {quantityInCart}
              </span>
            ) : null}
            {requiresCustomization(product) ? (
              <SlidersHorizontal className="size-4" />
            ) : (
              <ShoppingCart className="size-4" />
            )}
            {buttonLabel}
          </button>
        </div>
      </div>
    </article>
  );
}
