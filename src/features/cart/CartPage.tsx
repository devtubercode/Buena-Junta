import { Link } from "react-router";
import { appRoutes } from "@/app/routes";
import { CartItem } from "@/features/cart/components/CartItem";
import { CustomerOrderForm } from "@/features/cart/components/CustomerOrderForm";
import { OrderSummary } from "@/features/cart/components/OrderSummary";
import { useCartStore } from "@/features/cart/store/useCartStore";
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
} from "@/features/cart/utils/whatsapp";
import { formatCOP } from "@/features/cart/utils/money";
import { EmptyState } from "@/shared/components/EmptyState";
import {
  ArrowLeft,
  ClipboardList,
  MessageCircle,
  ReceiptText,
  ShoppingBag,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { notify } from "@/shared/notifications/notify";

function getValidationErrors(itemCount: number, customerName: string) {
  const errors: string[] = [];

  if (itemCount === 0) {
    errors.push(
      "Tu carrito está vacío. Agrega un producto antes de enviar el pedido.",
    );
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
    const validationErrors = getValidationErrors(
      items.length,
      orderDraft.customerName,
    );

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

      const openedWindow = window.open(
        buildWhatsAppUrl(message),
        "_blank",
        "noopener,noreferrer",
      );

      if (!openedWindow) {
        notify.error("No pudimos abrir WhatsApp. Intenta de nuevo.");
        return;
      }

      notify.whatsapp("Tu pedido está listo para enviarse por WhatsApp.");
    } catch {
      notify.error(
        "No pudimos preparar el mensaje de WhatsApp. Intenta de nuevo.",
      );
    }
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 lg:px-8 lg:py-8">
      <h1 className="sr-only">Carrito</h1>

      <div className="mb-4 rounded-lg border border-primary-border bg-primary-soft p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-elevated">
              <ShoppingCart className="size-5" />
            </span>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">
              Tu pedido
            </p>
          </div>
          <Link
            to={appRoutes.menu}
            className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface px-3 text-xs font-black text-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-4"
          >
            <ArrowLeft className="mr-1.5 size-4" />
            Menú
          </Link>
        </div>

        {items.length > 0 ? (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="flex min-h-10 items-center gap-2 rounded-lg border border-border bg-surface px-3">
              <ShoppingBag className="size-4 shrink-0 text-primary" />
              <p className="min-w-0 truncate text-sm font-black text-foreground">
                <span className="text-muted-foreground">Productos:</span>{" "}
                {totalQuantity}
              </p>
            </div>
            <div className="flex min-h-10 items-center gap-2 rounded-lg border border-border bg-surface px-3">
              <ReceiptText className="size-4 shrink-0 text-primary" />
              <p className="min-w-0 truncate text-sm font-black text-foreground">
                <span className="text-muted-foreground">Total:</span>{" "}
                {formatCOP(totalCents)}
              </p>
            </div>
          </div>
        ) : null}
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
              <ClipboardList className="mr-2 size-5" />
              Ver menú
            </Link>
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <section className="grid gap-3" aria-label="Productos en el carrito">
            {items.map((item) => (
              <CartItem
                key={item.cartItemId ?? item.lineId}
                item={item}
                onIncrement={() => incrementItem(item.lineId)}
                onDecrement={() => {
                  decrementItem(item.lineId);
                }}
                onQuantityChange={(quantity) => {
                  updateQuantity(item.lineId, quantity);
                }}
                onNoteChange={(note) => updateItemNote(item.lineId, note)}
                onVariantChange={(variantKey) =>
                  updateItemVariant(item.lineId, variantKey).status
                }
                onRemove={() => {
                  removeItem(item.lineId);
                  notify.success("Producto eliminado del carrito.");
                }}
              />
            ))}
          </section>

          <aside className="grid gap-4 lg:sticky lg:top-24">
            <CustomerOrderForm draft={orderDraft} onChange={updateOrderDraft} />
            <OrderSummary
              totalCents={totalCents}
              totalQuantity={totalQuantity}
            />

            <div className="grid gap-3">
              <button
                type="button"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-5 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={handleSendOrder}
              >
                <MessageCircle className="mr-2 size-6" />
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
                <Trash2 className="mr-2 size-5" />
                Limpiar carrito
              </button>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
