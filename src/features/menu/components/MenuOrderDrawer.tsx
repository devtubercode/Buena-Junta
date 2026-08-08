import { useState } from "react";
import { X, ShoppingBag, Pizza, ClipboardList, ChefHat, BadgePercent } from "lucide-react";
import { CustomModal } from "@/shared/components/CustomModal";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";
import { QuantityStepper } from "@/shared/components/QuantityStepper";
import { formatCOP } from "@/features/cart/utils/money";
import { MenuOrderForm } from "@/features/menu/components/MenuOrderForm";
import { MenuOrderSummary } from "@/features/menu/components/MenuOrderSummary";
import { cn } from "@/shared/utils/cn";
import { Button } from "@/shared/components/Button";
import { useIsMobile } from "@/shared/hooks/useIsMobile";
import type {
  MenuOrderItem,
  MenuOrderPromotion,
  MenuOrderTopping,
} from "@/store/menu-order/types/menu-order.types";
import type { UseMenuOrderResult } from "@/features/menu/hooks/useMenuOrder";
import productPlaceholderImage from "@/assets/product-placeholder.svg";

type MenuOrderDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  order: UseMenuOrderResult;
};

const formatItemDetails = (item: MenuOrderItem): string => {
  const parts: string[] = [];

  if (item.selectedOptions) {
    parts.push(...Object.values(item.selectedOptions));
  }

  if (item.additionOptions?.length) {
    parts.push(...item.additionOptions.map((addition) => `+${addition.label}`));
  }

  return parts.join(" · ");
};

// ── Product item card ────────────────────────────────────────────────
const OrderItemRow = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: {
  item: MenuOrderItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}) => {
  const image = item.urlImage ?? {
    src: productPlaceholderImage,
    alt: item.name,
  };
  const details = formatItemDetails(item);

  return (
    <li className="rounded-2xl border border-border bg-surface p-3 shadow-sm transition hover:shadow-md sm:p-3">
      <div className="flex gap-3">
        <img
          src={image.src}
          alt={image.alt}
          className="size-14 shrink-0 rounded-xl border border-border object-cover sm:size-16"
          loading="lazy"
          decoding="async"
        />
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="line-clamp-1 font-heading text-sm font-black leading-tight text-foreground sm:text-base">
                {item.name}
              </h3>
              {details ? (
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {details}
                </p>
              ) : null}
            </div>
            <span className="shrink-0 pt-0.5 font-heading text-sm font-black leading-none text-primary sm:text-base">
              {formatCOP(item.price * item.quantity)}
            </span>
          </div>
          <div className="flex justify-end">
            <QuantityStepper
              quantity={item.quantity}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              onRemove={onRemove}
              itemName={item.name}
            />
          </div>
        </div>
      </div>
    </li>
  );
};

// ── Topping row ─────────────────────────────────────────────────────
function ToppingRow({
  topping,
  onIncrement,
  onDecrement,
  onRemove,
}: {
  topping: MenuOrderTopping;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}) {
  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-3 py-2.5 shadow-sm">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <Pizza className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-foreground">
            {topping.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {formatCOP(topping.price)} c/u
          </p>
        </div>
      </div>
      <QuantityStepper
        quantity={topping.quantity}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        onRemove={onRemove}
        itemName={topping.name}
        size="sm"
      />
    </li>
  );
}

// ── Promotion row ────────────────────────────────────────────────────
function PromotionRow({
  promotion,
  onIncrement,
  onDecrement,
  onRemove,
}: {
  promotion: MenuOrderPromotion;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}) {
  const image = promotion.urlImage ?? {
    src: productPlaceholderImage,
    alt: promotion.name,
  };

  return (
    <li className="flex items-center justify-between gap-3 rounded-xl border border-primary-border bg-primary-soft px-3 py-2.5 shadow-sm">
      <div className="flex min-w-0 items-center gap-2.5">
        <img
          src={image.src}
          alt={image.alt}
          className="size-8 shrink-0 rounded-lg border border-border object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-foreground">
            {promotion.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {formatCOP(promotion.price)} c/u
          </p>
        </div>
      </div>
      <QuantityStepper
        quantity={promotion.quantity}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        onRemove={onRemove}
        itemName={promotion.name}
        size="sm"
      />
    </li>
  );
}

// ── Drawer component ────────────────────────────────────────────────
export function MenuOrderDrawer({
  isOpen,
  onClose,
  order,
}: MenuOrderDrawerProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const isMobile = useIsMobile();

  const hasLines =
    order.items.length > 0 ||
    order.toppings.length > 0 ||
    order.promotions.length > 0;
  const totalQuantity = order.totalQuantity;

  const handleSend = () => {
    setShowConfirm(false);
    order.sendOrder();
    onClose();
  };

  const modalContentConfirm = (
    <div>
      <MenuOrderSummary
        items={order.items}
        toppings={order.toppings}
        promotions={order.promotions}
        total={order.total}
        totalQuantity={order.totalQuantity}
      />
      <div className="pt-3 sm:pt-4">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            radius="full"
            size="lg"
            fullWidth
            onClick={() => setShowConfirm(false)}
          >
            Volver
          </Button>
          <Button
            variant="primary"
            radius="full"
            size="lg"
            fullWidth
            onClick={handleSend}
          >
            Enviar
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-1000 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-1001 flex w-full flex-col bg-gradient-to-b from-background to-surface shadow-elevated transition-transform duration-300 ease-out sm:max-w-md",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-label="Tu pedido"
      >
        {/* ── Header ─────────────────────────────────────── */}
        <header className="flex shrink-0 items-center justify-between border-b border-border bg-surface/80 px-4 py-3 backdrop-blur-sm sm:px-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <ShoppingBag className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-heading text-xl font-black leading-none text-foreground">
                Tu pedido
              </h2>
              {hasLines ? (
                <p className="mt-0.5 text-xs font-bold text-muted-foreground">
                  {totalQuantity}{" "}
                  {totalQuantity === 1 ? "producto" : "productos"}
                </p>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar pedido"
            className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <X className="size-4" />
          </button>
        </header>

        {/* ── Scrollable content ─────────────────────────── */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {!hasLines ? (
            /* ── Empty state ─────────────────────────────── */
            <div className="flex h-full flex-col items-center justify-center px-6 py-12 text-center">
              <div className="relative mx-auto mb-6 inline-flex size-20 items-center justify-center">
                <div className="absolute inset-0 animate-[spin_8s_linear_infinite] rounded-full border-2 border-dashed border-primary/20" />
                <span className="relative inline-flex size-16 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <ShoppingBag className="size-8" aria-hidden="true" />
                </span>
              </div>

              <h3 className="font-heading text-2xl font-black leading-tight text-foreground">
                Tu pedido está vacío
              </h3>
              <p className="mt-2 max-w-56 text-sm leading-relaxed text-muted-foreground">
                Agrega productos del menú para armar tu pedido. Te lo preparamos
                con mucho cariño.
              </p>

              <div className="mt-8 flex items-center justify-center gap-3 self-stretch text-muted-foreground/30">
                <span className="h-px flex-1 bg-border" />
                <ChefHat className="size-4" aria-hidden="true" />
                <span className="h-px flex-1 bg-border" />
              </div>
            </div>
          ) : (
            /* ── Order content ───────────────────────────── */
            <div className="flex flex-col gap-4 p-4 sm:p-5">
              {/* Products section */}
              {order.items.length > 0 && (
                <section aria-label="Productos en el carrito">
                  <ul className="flex flex-col gap-2">
                    {order.items.map((item) => (
                      <OrderItemRow
                        key={item.lineId}
                        item={item}
                        onIncrement={() =>
                          order.actions.incrementItem(item.lineId)
                        }
                        onDecrement={() =>
                          order.actions.decrementItem(item.lineId)
                        }
                        onRemove={() => order.actions.removeItem(item.lineId)}
                      />
                    ))}
                  </ul>
                </section>
              )}

              {/* Toppings section */}
              {order.toppings.length > 0 && (
                <section aria-label="Toppings en el carrito">
                  <h3 className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-muted-foreground">
                    <Pizza className="size-3.5" aria-hidden="true" />
                    Toppings extra
                    <span className="ml-auto rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-black text-primary">
                      {order.toppings.length}
                    </span>
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {order.toppings.map((topping) => (
                      <ToppingRow
                        key={topping.id}
                        topping={topping}
                        onIncrement={() =>
                          order.actions.incrementTopping(topping.id)
                        }
                        onDecrement={() =>
                          order.actions.decrementTopping(topping.id)
                        }
                        onRemove={() => order.actions.removeTopping(topping.id)}
                      />
                    ))}
                  </ul>
                </section>
              )}

              {/* Promotions section */}
              {order.promotions.length > 0 && (
                <section aria-label="Promociones en el carrito">
                  <h3 className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-muted-foreground">
                    <BadgePercent className="size-3.5" aria-hidden="true" />
                    Promociones
                    <span className="ml-auto rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-black text-primary">
                      {order.promotions.length}
                    </span>
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {order.promotions.map((promotion) => (
                      <PromotionRow
                        key={promotion.id}
                        promotion={promotion}
                        onIncrement={() =>
                          order.actions.incrementPromotion(promotion.id)
                        }
                        onDecrement={() =>
                          order.actions.decrementPromotion(promotion.id)
                        }
                        onRemove={() =>
                          order.actions.removePromotion(promotion.id)
                        }
                      />
                    ))}
                  </ul>
                </section>
              )}

              {/* Section divider */}
              <hr className="border-border" />

              {/* Order form section */}
              <section aria-label="Datos del pedido">
                <h3 className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-muted-foreground">
                  <ClipboardList className="size-3.5" aria-hidden="true" />
                  Datos de entrega
                </h3>
                <div className="rounded-2xl border border-border bg-surface p-3 shadow-sm sm:p-4">
                  <MenuOrderForm
                    orderDetails={order.orderDetails}
                    onChangeField={order.actions.updateOrderDetail}
                  />
                </div>
              </section>

              {/* Send button */}
              <Button
                variant="primary"
                radius="full"
                size="lg"
                fullWidth
                disabled={!order.canSendOrder}
                onClick={() => setShowConfirm(true)}
                className="min-h-14 text-base shadow-elevated"
              >
                <span className="flex w-full items-center justify-between gap-2">
                  <span>Enviar pedido</span>
                  <span className="rounded-full bg-white/20 px-3 py-1 font-heading text-base font-black leading-none text-primary-foreground">
                    {formatCOP(order.total)}
                  </span>
                </span>
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* ── Confirmation modal ──────────────────────────── */}
      {isMobile ? (
        <ButtonSheetModal
          isOpen={showConfirm}
          title="¿Enviar pedido por WhatsApp?"
          description="Revisa productos, datos de entrega y pago antes de continuar. Se abrirá WhatsApp con mensaje listo."
          onClose={() => setShowConfirm(false)}
          scrollable={false}
        >
          {modalContentConfirm}
        </ButtonSheetModal>
      ) : (
        <CustomModal
          isOpen={showConfirm}
          title="¿Enviar pedido por WhatsApp?"
          description="Revisa productos, datos de entrega y pago antes de continuar. Se abrirá WhatsApp con mensaje listo."
          onClose={() => setShowConfirm(false)}
          scrollable={false}
        >
          {modalContentConfirm}
        </CustomModal>
      )}
    </>
  );
}
