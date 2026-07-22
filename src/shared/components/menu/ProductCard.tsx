import { useState } from "react";
import productPlaceholderImage from "@/assets/product-placeholder.svg";
import type { MenuProduct } from "@/features/menu/types/menu.types";
import { getProductCardPriceLabel } from "@/features/menu/utils/productHelpers";
import { cn } from "@/shared/utils/cn";

type ProductCardProps = {
  product: MenuProduct;
  quantityInCart?: number;
  onOpenDetail: () => void;
};

function getProductImage(product: MenuProduct) {
  return (
    product.urlImage ?? {
      src: productPlaceholderImage,
      alt: `Imagen de referencia para ${product.name}`,
    }
  );
}

export function ProductCard({
  product,
  quantityInCart = 0,
  onOpenDetail,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const isUnavailable = !product.is_available;
  const productImage = imageError
    ? getProductImage(product)
    : (product.urlImage ?? getProductImage(product));
  const isPlaceholder = !product.urlImage || imageError;
  const priceLabel = getProductCardPriceLabel(product);
  const isInCart = quantityInCart > 0;
  const hasDescription = product.description.trim().length > 0;

  return (
    <article
      role="button"
      tabIndex={isUnavailable ? -1 : 0}
      onClick={isUnavailable ? undefined : onOpenDetail}
      onKeyDown={(event) => {
        if (isUnavailable) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenDetail();
        }
      }}
      className={cn(
        "group flex h-auto flex-row overflow-hidden rounded-2xl border border-border bg-surface shadow-elevated transition duration-200 ease-out sm:h-full sm:flex-col",
        !isUnavailable &&
          "cursor-pointer hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-xl hover:ring-1 hover:ring-primary/10 focus-visible:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        isUnavailable && "opacity-60 grayscale",
      )}
      data-product-id={product.id}
      aria-label={
        isUnavailable
          ? `${product.name}, no disponible`
          : `Ver detalles de ${product.name}`
      }
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

        {isInCart ? (
          <span className="absolute right-1 top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-background bg-primary px-1 text-[10px] font-black text-primary-foreground shadow-elevated sm:right-2 sm:top-2 sm:h-7 sm:min-w-7 sm:px-1.5 sm:text-xs">
            {quantityInCart}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-2.5 sm:p-4">
        <h3 className="line-clamp-1 font-heading text-base font-black leading-tight text-foreground sm:line-clamp-2 sm:text-lg md:text-xl">
          {product.name}
        </h3>

        {hasDescription ? (
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:mt-1 sm:text-sm">
            {product.description}
          </p>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-2 pt-2 sm:pt-3">
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
        </div>
      </div>
    </article>
  );
}
