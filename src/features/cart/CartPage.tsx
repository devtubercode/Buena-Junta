import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { appRoutes } from "@/app/routes";
import { CartItem } from "@/features/cart/components/CartItem";
import { CustomerOrderForm } from "@/features/cart/components/CustomerOrderForm";
import { OrderSummary } from "@/features/cart/components/OrderSummary";
import { useCartStore } from "@/features/cart/store/useCartStore";
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
} from "@/features/cart/utils/whatsapp";

import { AppModal } from "@/shared/components/AppModal";
import { EmptyState } from "@/shared/components/EmptyState";
import { ClipboardList, Trash2 } from "lucide-react";
import { notify } from "@/shared/notifications/notify";
import { WhatsappIcon } from "@/shared/icons";

export function CartPage() {
  const navigate = useNavigate();
  const [isOrderConfirmationOpen, setIsOrderConfirmationOpen] = useState(false);
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
  const clearCurrentOrder = useCartStore((state) => state.clearCurrentOrder);
  const total = useCartStore((state) => state.getTotal());
  const totalQuantity = useCartStore((state) => state.getTotalQuantity());

  const handleSendOrder = () => {
    try {
      const message = buildWhatsAppOrderMessage({
        items,
        orderDraft,
        total,
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

      setIsOrderConfirmationOpen(true);
      notify.whatsapp("Pedido preparado para WhatsApp.");
    } catch {
      notify.error(
        "No pudimos preparar el mensaje de WhatsApp. Intenta de nuevo.",
      );
    }
  };

  const handleConfirmOrderSent = () => {
    clearCurrentOrder();
    setIsOrderConfirmationOpen(false);
    notify.success("Carrito limpio para un nuevo pedido.");
    navigate(appRoutes.menu);
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6 lg:px-8 lg:py-8">
      <h1 className="sr-only">Carrito</h1>

      <p className="text-lg font-black uppercase tracking-[0.16em] text-primary pb-3">
        Tu pedido
      </p>

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
              total={total}
              totalQuantity={totalQuantity}
            />

            <div className="grid gap-3">
              <button
                type="button"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-5 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={handleSendOrder}
              >
                <WhatsappIcon className="mr-2 size-6" />
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

      <AppModal
        isOpen={isOrderConfirmationOpen}
        title="¿Ya enviaste tu pedido?"
        description="Se abrió WhatsApp con tu pedido preparado. Para que podamos empezar a elaborarlo, debes presionar Enviar dentro de WhatsApp."
        icon={<WhatsappIcon className="size-6" />}
        primaryActionLabel="Ya envié el pedido"
        secondaryActionLabel="Volver al carrito"
        onPrimaryAction={handleConfirmOrderSent}
        onSecondaryAction={() => setIsOrderConfirmationOpen(false)}
        onClose={() => setIsOrderConfirmationOpen(false)}
      >
        <div className="grid gap-2">
          <p>
            Cuando hayas enviado el mensaje, toca “Ya envié el pedido” para
            limpiar tu carrito y empezar un nuevo pedido.
          </p>
          <p>
            Si ya lo enviaste y olvidaste agregar algo, crea un nuevo pedido con
            el mismo responsable y mesa para que podamos identificarlo.
          </p>
        </div>
      </AppModal>
    </main>
  );
}
