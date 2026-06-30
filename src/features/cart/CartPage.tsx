import { Link } from "react-router";
import { appRoutes } from "@/app/routes";
import { CartItem } from "@/features/cart/components/CartItem";
import { CustomerOrderForm } from "@/features/cart/components/CustomerOrderForm";
import { OrderSummary } from "@/features/cart/components/OrderSummary";
import { CartCheckout } from "@/features/cart/components/CartCheckout";
import { CartEmpty } from "@/features/cart/components/CartEmpty";
import { useCartPage } from "@/features/cart/hooks/useCartPage";

import { CustomModal } from "@/shared/components/CustomModal";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";
import { ChevronLeft } from "lucide-react";
import { WhatsappIcon } from "@/shared/icons";
import { ProductCustomizationModal } from "@/features/menu/components/ProductCustomizationModal";
import { ProductCustomizationForm } from "@/features/menu/components/ProductCustomizationForm";

export function CartPage() {
  const {
    items,
    orderDraft,
    total,
    totalQuantity,
    editingItem,
    editingProduct,
    isConfirmationOpen,
    canSendOrder,
    actions,
  } = useCartPage();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-4 flex items-center gap-3 lg:mb-6">
        <Link
          to={appRoutes.menu}
          className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ChevronLeft className="size-5" />
          <span className="sr-only">Volver al menú</span>
        </Link>
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">
            Tu pedido
          </p>
          <h1 className="font-heading text-3xl font-black leading-none text-foreground sm:text-4xl">
            Carrito
          </h1>
        </div>
      </div>

      {items.length === 0 ? (
        <CartEmpty />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_420px] lg:items-start">
          <section
            className="grid gap-3 sm:gap-4"
            aria-label="Productos en el carrito"
          >
            {items.map((item) => (
              <CartItem
                key={item.cartItemId ?? item.lineId}
                item={item}
                onIncrement={() => actions.increment(item)}
                onDecrement={() => actions.decrement(item)}
                onQuantityChange={(quantity) =>
                  actions.updateQuantity(item, quantity)
                }
                onNoteChange={(note) => actions.updateNote(item, note)}
                onEdit={() => actions.editItem(item)}
                onRemove={() => actions.remove(item)}
              />
            ))}
          </section>

          <aside className="grid gap-4 lg:sticky lg:top-24">
            <OrderSummary total={total} totalQuantity={totalQuantity} />
            <CustomerOrderForm
              draft={orderDraft}
              onChange={actions.updateOrderDraft}
            />
            <CartCheckout
              canSendOrder={canSendOrder}
              onSendOrder={actions.sendOrder}
              onClearCart={actions.clearCart}
            />
          </aside>
        </div>
      )}

      <CustomModal
        isOpen={isConfirmationOpen}
        title="¿Ya enviaste tu pedido?"
        description="Se abrió WhatsApp con tu pedido preparado. Para que podamos empezar a elaborarlo, debes presionar Enviar dentro de WhatsApp."
        icon={<WhatsappIcon className="size-6" />}
        contentClassName="max-w-lg"
        onClose={actions.dismissConfirmation}
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
        <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
          <button
            type="button"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-5 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={actions.confirmOrderSent}
          >
            Ya envié el pedido
          </button>
          <button
            type="button"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-surface px-5 text-sm font-black text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={actions.dismissConfirmation}
          >
            Volver al carrito
          </button>
        </div>
      </CustomModal>

      {editingProduct ? (
        <>
          <div className="hidden sm:block">
            <ProductCustomizationModal
              product={editingProduct}
              initialCartItem={editingItem ?? undefined}
              isOpen={Boolean(editingProduct)}
              onClose={actions.closeEdit}
              onAdd={actions.saveEdit}
            />
          </div>
          <div className="sm:hidden">
            <ButtonSheetModal
              isOpen={Boolean(editingProduct)}
              title=""
              description=""
              contentClassName="max-w-lg p-0 sm:p-1"
              onClose={actions.closeEdit}
            >
              <div className="p-3">
                <ProductCustomizationForm
                  product={editingProduct}
                  initialCartItem={editingItem ?? undefined}
                  submitLabel={
                    editingItem ? "Guardar cambios" : "Agregar al carrito"
                  }
                  onSubmit={actions.saveEdit}
                  onClose={actions.closeEdit}
                />
              </div>
            </ButtonSheetModal>
          </div>
        </>
      ) : null}
    </main>
  );
}
