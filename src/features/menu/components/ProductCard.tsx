import { useState } from "react";
import { ShoppingCart, SlidersHorizontal } from "lucide-react";
import productPlaceholderImage from "@/assets/product-placeholder.svg";
import type { MenuProduct } from "@/features/menu/types/menu.types";
import {
  getProductCardPriceLabel,
  requiresCustomization,
} from "@/features/menu/utils/productHelpers";
import { cn } from "@/shared/utils/cn";

type ProductCardProps = {
  product: MenuProduct;
  quantityInOrder?: number;
  onOpenDetail: () => void;
  onAddOrCustomize: () => void;
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
  quantityInOrder = 0,
  onOpenDetail,
  onAddOrCustomize,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const isUnavailable = !product.is_available;
  const productImage = imageError
    ? getProductImage(product)
    : (product.urlImage ?? getProductImage(product));
  const isPlaceholder = !product.urlImage || imageError;
  const priceLabel = getProductCardPriceLabel(product);
  const isCustomizable = requiresCustomization(product);
  const primaryButtonLabel = isCustomizable ? "Personalizar" : "Pedir";
  const isInOrder = quantityInOrder > 0;
  const hasDescription = product.description.trim().length > 0;
  const tags = product.tags ?? [];

  return (
    <article
      className="group flex h-full min-w-0 flex-row overflow-hidden rounded-2xl border border-border bg-surface shadow-elevated transition hover:shadow-lg focus-within:shadow-lg"
      data-product-id={product.id}
    >
      <div className="relative w-[38%] shrink-0 overflow-hidden bg-surface-muted sm:w-[35%]">
        <img
          src={productImage.src}
          alt={productImage.alt}
          onError={() => setImageError(true)}
          className={cn(
            "h-full w-full transition duration-300 group-hover:scale-[1.03]",
            isPlaceholder
              ? "bg-surface-raised object-contain p-4 sm:p-6"
              : "bg-surface-muted object-cover",
            isUnavailable && "opacity-60 grayscale",
          )}
          loading="lazy"
        />

        {!isUnavailable && tags.length > 0 ? (
          <div className="absolute left-2 top-2 flex max-w-[75%] flex-wrap gap-1">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-primary-foreground shadow-elevated"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        {isUnavailable ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-[1px]">
            <span className="rounded-full bg-surface-raised px-2 py-0.5 font-heading text-[10px] font-black uppercase tracking-wider text-foreground shadow-elevated sm:px-3 sm:py-1 sm:text-xs">
              No disponible
            </span>
          </div>
        ) : null}

        {isInOrder ? (
          <span className="absolute right-1 top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-background bg-primary px-1 text-[10px] font-black text-primary-foreground shadow-elevated sm:right-2 sm:top-2 sm:h-7 sm:min-w-7 sm:px-1.5 sm:text-xs">
            {quantityInOrder}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 flex-1 font-heading text-base font-black leading-tight text-foreground sm:text-lg">
              {product.name}
            </h3>
            {priceLabel ? (
              <p className="shrink-0 font-heading text-base font-black leading-none text-primary sm:text-lg">
                {priceLabel}
              </p>
            ) : (
              <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Precio no disponible
              </p>
            )}
          </div>

          {isCustomizable ? (
            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-primary-soft px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-primary">
              <SlidersHorizontal className="size-3" aria-hidden="true" />
              Personalizable
            </span>
          ) : null}

          {hasDescription ? (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground sm:line-clamp-3">
              {product.description}
            </p>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            type="button"
            onClick={onOpenDetail}
            className="inline-flex min-h-10 items-center justify-center px-2 text-sm font-bold text-primary transition hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={`Ver detalles de ${product.name}`}
          >
            Ver detalles
          </button>

          <button
            type="button"
            disabled={isUnavailable || priceLabel === null}
            aria-label={`${primaryButtonLabel} ${product.name}`}
            onClick={onAddOrCustomize}
            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full bg-primary px-4 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCustomizable ? (
              <SlidersHorizontal className="size-4" aria-hidden="true" />
            ) : (
              <ShoppingCart className="size-4" aria-hidden="true" />
            )}
            <span>{primaryButtonLabel}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
