import { formatCOP } from "@/features/cart/utils/money";
import productPlaceholderImage from "@/assets/product-placeholder.svg";
import type { MenuImage } from "@/features/menu/types/menu.types";
import type {
  MenuOrderItem,
  MenuOrderPromotion,
  MenuOrderTopping,
} from "@/store/menu-order/types/menu-order.types";

const formatItemDetails = (item: MenuOrderItem): string => {
  const parts: string[] = [];

  if (item.selectedOptions) {
    parts.push(...Object.values(item.selectedOptions));
  }

  if (item.additionOptions?.length) {
    parts.push(...item.additionOptions.map((a) => `+${a.label}`));
  }

  return parts.join(" · ");
};

type MenuOrderSummaryProps = {
  items: MenuOrderItem[];
  toppings: MenuOrderTopping[];
  promotions: MenuOrderPromotion[];
  total: number;
  totalQuantity: number;
};

export function MenuOrderSummary({
  items,
  toppings,
  promotions,
  total,
  totalQuantity,
}: MenuOrderSummaryProps) {
  const hasItems = items.length > 0;
  const hasToppings = toppings.length > 0;
  const hasPromotions = promotions.length > 0;

  return (
    <section
      aria-label="Resumen del pedido"
      className="rounded-xl border border-border bg-surface"
    >
      {/* Totals — always visible at top */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-5">
        <p className="text-sm text-muted-foreground">
          Productos:{" "}
          <span className="font-heading font-black text-foreground">
            {totalQuantity}
          </span>
        </p>
        <div className="text-right">
          <span className="block text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
            Total
          </span>
          <span className="font-heading text-xl font-black leading-none text-primary sm:text-2xl">
            {formatCOP(total)}
          </span>
        </div>
      </div>

      {/* Scrollable items / toppings */}
      <div className="max-h-[30dvh] overflow-y-auto border-t border-border sm:max-h-[30dvh]">
        {hasItems && (
          <div className="px-4 py-3 sm:px-5 sm:py-4">
            <h3 className="mb-2 text-xs font-black uppercase tracking-wider text-muted-foreground">
              Productos
            </h3>
            <ul role="list" className="divide-y divide-border">
              {items.map((item) => {
                const image: MenuImage | { src: string; alt: string } =
                  item.urlImage ?? {
                    src: productPlaceholderImage,
                    alt: item.name,
                  };
                const details = formatItemDetails(item);

                return (
                  <li
                    key={item.lineId}
                    className="flex gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="size-10 shrink-0 rounded-md object-cover sm:size-12"
                      loading="lazy"
                      decoding="async"
                    />

                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="truncate text-sm font-bold text-foreground sm:text-base">
                            {item.name}
                          </h4>
                          {details ? (
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {details}
                            </p>
                          ) : null}
                        </div>
                        <span className="shrink-0 text-sm font-black text-foreground sm:text-base">
                          {formatCOP(item.price * item.quantity)}
                        </span>
                      </div>

                      {item.quantity > 1 && (
                        <span
                          className="mt-1.5 inline-flex w-fit items-center gap-1 rounded-full bg-muted/50 px-2 py-0.5 text-xs font-medium text-muted-foreground"
                          aria-label={`${item.quantity} unidades`}
                        >
                          <span aria-hidden="true">×</span>
                          {item.quantity}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {hasItems && hasToppings && <hr className="border-border" />}

        {hasToppings && (
          <div className="px-4 py-3 sm:px-5 sm:py-4">
            <h3 className="mb-2 text-xs font-black uppercase tracking-wider text-muted-foreground">
              Toppings
            </h3>
            <ul role="list" className="divide-y divide-border">
              {toppings.map((topping) => (
                <li
                  key={topping.id}
                  className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-medium text-foreground">
                      {topping.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {formatCOP(topping.price)} c/u
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-sm font-black text-foreground">
                      {formatCOP(topping.price * topping.quantity)}
                    </span>
                    <span className="ml-1.5 text-xs text-muted-foreground">
                      ×{topping.quantity}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(hasItems || hasToppings) && hasPromotions && (
          <hr className="border-border" />
        )}

        {hasPromotions && (
          <div className="px-4 py-3 sm:px-5 sm:py-4">
            <h3 className="mb-2 text-xs font-black uppercase tracking-wider text-muted-foreground">
              Promociones
            </h3>
            <ul role="list" className="divide-y divide-border">
              {promotions.map((promotion) => {
                const image: MenuImage | { src: string; alt: string } =
                  promotion.urlImage ?? {
                    src: productPlaceholderImage,
                    alt: promotion.name,
                  };

                return (
                  <li
                    key={promotion.id}
                    className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="size-9 shrink-0 rounded-md object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-bold text-foreground">
                          {promotion.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {formatCOP(promotion.price)} c/u
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-sm font-black text-foreground">
                        {formatCOP(promotion.price * promotion.quantity)}
                      </span>
                      <span className="ml-1.5 text-xs text-muted-foreground">
                        ×{promotion.quantity}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
