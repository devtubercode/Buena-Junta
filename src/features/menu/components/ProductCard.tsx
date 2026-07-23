import { useState } from "react";
import productPlaceholderImage from "@/assets/product-placeholder.svg";
import type { MenuProduct } from "@/features/menu/types/menu.types";
import {
  getProductCardPriceLabel,
  getProductDiscountInfo,
} from "@/features/menu/utils/productHelpers";
import { formatCOP } from "@/features/cart/utils/money";
import { cn } from "@/shared/utils/cn";

type ProductCardProps = {
  product: MenuProduct;
  quantityInOrder?: number;
  onOpenDetail: () => void;
};

export const ProductCard = ({
  product,
  quantityInOrder = 0,
  onOpenDetail,
}: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  const isUnavailable = !product.is_available;
  const productImage = product.urlImage;
  const isPlaceholder = !product.urlImage || imageError;
  const priceLabel = getProductCardPriceLabel(product);
  const discountInfo = getProductDiscountInfo(product);
  const isInOrder = quantityInOrder > 0;
  const hasDescription = product.description.trim().length > 0;

  return (
    <article
      role="button"
      tabIndex={isUnavailable ? -1 : 0}
      onClick={isUnavailable ? undefined : onOpenDetail}
      className={cn(
        "group relative flex h-full min-w-0 flex-row overflow-hidden rounded-2xl border border-border bg-surface shadow-elevated transition duration-200 ease-out min-h-[8rem]",
        !isUnavailable &&
          "cursor-pointer hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-xl hover:ring-1 hover:ring-primary/10 focus-visible:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        isUnavailable && "opacity-70 grayscale",
      )}
      data-product-id={product.id}
      aria-label={
        isUnavailable
          ? `${product.name}, no disponible`
          : `Ver detalles de ${product.name}`
      }
    >
      <div className="relative w-[28%] shrink-0 overflow-hidden bg-surface-muted sm:w-[28%]">
        <img
          src={
            imageError
              ? productPlaceholderImage
              : (productImage?.src ?? productPlaceholderImage)
          }
          alt={productImage?.alt}
          onError={() => setImageError(true)}
          className={cn(
            "h-full w-full transition duration-300 group-hover:scale-[1.03]",
            isPlaceholder
              ? "bg-surface-raised object-cover "
              : "bg-surface-muted object-cover",
          )}
          loading="lazy"
          decoding="async"
        />

        {isUnavailable ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-[1px]">
            <span className="rounded-full bg-surface-raised px-2 py-0.5 font-heading text-[10px] font-black uppercase tracking-wider text-foreground shadow-elevated">
              No disponible
            </span>
          </div>
        ) : null}

        {discountInfo ? (
          <span className="absolute left-1 top-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-black text-white shadow-elevated sm:px-2 sm:py-1 sm:text-xs">
            -{discountInfo.discountPercent}%
          </span>
        ) : null}

        {isInOrder ? (
          <span className="absolute right-1 top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-background bg-primary px-1 text-[10px] font-black text-primary-foreground shadow-elevated">
            {quantityInOrder}
          </span>
        ) : null}
      </div>

      <div className="relative flex flex-1 flex-col gap-1 p-2 sm:p-3">
        <div className="flex flex-1 flex-col justify-start gap-1">
          <div className="flex items-start justify-between gap-1.5">
            <h3 className="line-clamp-1 flex-1 font-heading text-sm font-black leading-tight text-foreground sm:text-base">
              {product.name}
            </h3>
            {discountInfo ? (
              <div className="shrink-0 text-right">
                <p className="font-heading text-sm font-black leading-none text-primary sm:text-base">
                  {formatCOP(discountInfo.salePrice)}
                </p>
                <p className="text-[10px] font-bold leading-none text-muted-foreground line-through sm:text-xs">
                  {formatCOP(discountInfo.originalPrice)}
                </p>
              </div>
            ) : priceLabel ? (
              <p className="shrink-0 font-heading text-sm font-black leading-none text-primary sm:text-base">
                {priceLabel}
              </p>
            ) : (
              <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Precio no disponible
              </p>
            )}
          </div>

          {hasDescription ? (
            <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
              {product.description}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
};
