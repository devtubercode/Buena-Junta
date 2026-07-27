import { useState } from "react";
import { X, ShoppingBag } from "lucide-react";
import { CustomModal } from "@/shared/components/CustomModal";
import { QuantityStepper } from "@/shared/components/QuantityStepper";
import { formatCOP } from "@/features/cart/utils/money";
import { MenuOrderForm } from "@/features/menu/components/MenuOrderForm";
import { MenuOrderSummary } from "@/features/menu/components/MenuOrderSummary";
import { cn } from "@/shared/utils/cn";
import { Button } from "@/shared/components/Button";
import type {
  MenuOrderItem,
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

  if (item.variantKey) {
    parts.push(item.variantKey);
  }

  if (item.selectedOptions) {
    parts.push(...Object.values(item.selectedOptions));
  }

  if (item.additionOptions?.length) {
    parts.push(...item.additionOptions.map((addition) => `+${addition.label}`));
  }

  return parts.join(" · ");
};

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
    <li className="flex gap-3 py-3">
      <img
        src={image.src}
        alt={image.alt}
        className="size-12 shrink-0 rounded-md object-cover sm:size-14"
        loading="lazy"
        decoding="async"
      />
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold leading-tight text-foreground sm:text-base">
              {item.name}
            </h3>
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
        <div className="mt-2 flex justify-end">
          <QuantityStepper
            quantity={item.quantity}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            onRemove={onRemove}
            itemName={item.name}
          />
        </div>
      </div>
    </li>
  );
};

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
    <li className="flex items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <h3 className="truncate text-sm font-bold leading-tight text-foreground sm:text-base">
          {topping.name}
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatCOP(topping.price)} c/u
        </p>
      </div>
      <QuantityStepper
        quantity={topping.quantity}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        onRemove={onRemove}
        itemName={topping.name}
      />
    </li>
  );
}

export function MenuOrderDrawer({
  isOpen,
  onClose,
  order,
}: MenuOrderDrawerProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const hasLines = order.items.length > 0 || order.toppings.length > 0;

  const handleSend = () => {
    setShowConfirm(false);
    order.sendOrder();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-1000 bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-1001 flex w-full flex-col bg-background shadow-elevated transition-transform duration-300 ease-out sm:max-w-md",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-label="Pedido"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-lg font-black text-foreground">Tu pedido</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar pedido"
            className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition hover:bg-black/5 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content - scrollable */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4">
          {!hasLines ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 inline-flex rounded-full bg-surface p-4">
                <ShoppingBag
                  className="size-10 text-muted-foreground"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-lg font-black text-foreground">
                Tu pedido está vacío
              </h3>
              <p className="mt-1 max-w-48 text-sm text-muted-foreground">
                Agrega productos del menú para armar tu pedido
              </p>
            </div>
          ) : (
            <div className="py-2">
              {order.items.length > 0 && (
                <section aria-label="Productos en el carrito" className="max-h-[50vh] overflow-y-auto">
                  <ul className="divide-y divide-border">
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

              {order.toppings.length > 0 && (
                <section className="mt-4" aria-label="Toppings en el carrito">
                  <h3 className="mb-1 text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Toppings
                  </h3>
                  <ul className="divide-y divide-border">
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

              <div className="mt-4 border-t border-border pt-4">
                <div className="grid gap-3">
                  <MenuOrderForm
                    orderDetails={order.orderDetails}
                    onChangeField={order.actions.updateOrderDetail}
                    compact={false}
                  />
                  <button
                    type="button"
                    disabled={!order.canSendOrder}
                    onClick={() => setShowConfirm(true)}
                    className="inline-flex min-h-12 w-full items-center justify-between gap-2 rounded-xl bg-green-600 px-4 text-sm font-black text-white shadow-md transition hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:cursor-not-allowed disabled:bg-muted-foreground/30 disabled:text-muted-foreground disabled:shadow-none"
                  >
                    <span>Enviar pedido</span>
                    <span className="rounded-lg bg-white/20 px-2 py-1 text-base">
                      {formatCOP(order.total)}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Confirmation modal */}
      <CustomModal
        isOpen={showConfirm}
        title="¿Enviar pedido por WhatsApp?"
        description="Revisa productos, datos de entrega y pago antes de continuar. Se abrirá WhatsApp con mensaje listo."
        onClose={() => setShowConfirm(false)}
      >
        <div className="grid gap-3 p-3 sm:p-4">
          <MenuOrderSummary
            total={order.total}
            totalQuantity={order.totalQuantity}
          />
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
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Enviar
            </Button>
          </div>
        </div>
      </CustomModal>
    </>
  );
}
