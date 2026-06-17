import { Link } from "react-router";
import { appRoutes } from "@/app/routes";
import { CartItem } from "@/features/cart/components/CartItem";
import { CustomerOrderForm } from "@/features/cart/components/CustomerOrderForm";
import { OrderSummary } from "@/features/cart/components/OrderSummary";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { buildWhatsAppOrderMessage, buildWhatsAppUrl } from "@/features/cart/utils/whatsapp";
import { EmptyState } from "@/shared/components/EmptyState";
import { ArrowLeftIcon, MenuBoardIcon, TrashIcon, WhatsAppIcon } from "@/shared/icons";
import { notify } from "@/shared/notifications/notify";

function getValidationErrors(itemCount: number, customerName: string) {
  const errors: string[] = [];

  if (itemCount === 0) {
    errors.push("Tu carrito está vacío. Agrega un producto antes de enviar el pedido.");
  }

  if (!customerName.trim()) {
    errors.push("Ingresa el nombre del responsable del pedido.");
  }

  return errors;
}

export function CartPage() {
  const items = useCartStore((state) => state.items);
  const orderDraft = useCartStore((state) => state.orderDraft);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const updateItemNote = useCartStore((state) => state.updateItemNote);
  const updateItemVariant = useCartStore((state) => state.updateItemVariant);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateOrderDraft = useCartStore((state) => state.updateOrderDraft);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalCents = useCartStore((state) => state.getTotal());
  const totalQuantity = useCartStore((state) => state.getTotalQuantity());

  const handleSendOrder = () => {
    const validationErrors = getValidationErrors(items.length, orderDraft.customerName);

    if (validationErrors.length > 0) {
      notify.warning(validationErrors[0]);
      return;
    }

    try {
      const message = buildWhatsAppOrderMessage({
        items,
        orderDraft,
        totalCents,
      });

      const openedWindow = window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");

      if (!openedWindow) {
        notify.error("No pudimos abrir WhatsApp. Intenta de nuevo.");
        return;
      }

      notify.whatsapp("Tu pedido está listo para enviarse por WhatsApp.");
    } catch {
      notify.error("No pudimos preparar el mensaje de WhatsApp. Intenta de nuevo.");
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-primary">
            Tu pedido
          </p>
          <h1 className="m-0 font-heading text-5xl font-black leading-none text-foreground">
            Carrito
          </h1>
        </div>
        <Link
          to={appRoutes.menu}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-surface px-5 text-sm font-black text-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ArrowLeftIcon className="mr-2 size-5" />
          Seguir comprando
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Tu carrito está vacío"
          description="Agrega un producto desde el menú para preparar tu pedido."
          action={
            <Link
              to={appRoutes.menu}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-black text-primary-foreground shadow-elevated"
            >
              <MenuBoardIcon className="mr-2 size-5" />
              Ver menú
            </Link>
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <section className="grid gap-4" aria-label="Productos en el carrito">
            {items.map((item) => (
              <CartItem
                key={item.cartItemId ?? item.lineId}
                item={item}
                onIncrement={() => {
                  incrementItem(item.lineId);
                  notify.info("Cantidad actualizada.");
                }}
                onDecrement={() => {
                  decrementItem(item.lineId);
                  notify.info("Cantidad actualizada.");
                }}
                onQuantityChange={(quantity) => {
                  updateQuantity(item.lineId, quantity);
                  notify.info("Cantidad actualizada.");
                }}
                onNoteChange={(note) => updateItemNote(item.lineId, note)}
                onVariantChange={(variantKey) => updateItemVariant(item.lineId, variantKey).status}
                onRemove={() => {
                  removeItem(item.lineId);
                  notify.success("Producto eliminado del carrito.");
                }}
              />
            ))}
          </section>

          <aside className="grid gap-4 lg:sticky lg:top-24">
            <CustomerOrderForm draft={orderDraft} onChange={updateOrderDraft} />
            <OrderSummary totalCents={totalCents} totalQuantity={totalQuantity} />

            <div className="grid gap-3">
              <button
                type="button"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-5 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={handleSendOrder}
              >
                <WhatsAppIcon className="mr-2 size-6" />
                Enviar pedido por WhatsApp
              </button>
              <button
                type="button"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-surface px-5 text-sm font-black text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={() => {
                  clearCart();
                  notify.info("Carrito limpio.");
                }}
              >
                <TrashIcon className="mr-2 size-5" />
                Limpiar carrito
              </button>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
