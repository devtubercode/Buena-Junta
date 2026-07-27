import { Link } from "react-router";
import { appRoutes } from "@/app/routes";
import { CartItem } from "@/features/cart/components/CartItem";
import { CustomerOrderForm } from "@/features/cart/components/CustomerOrderForm";
import { OrderSummary } from "@/features/cart/components/OrderSummary";
import { CartCheckout } from "@/features/cart/components/CartCheckout";
import { CartEmpty } from "@/features/cart/components/CartEmpty";
import { useCartPage } from "@/features/cart/hooks/useCartPage";

import { ChevronLeft } from "lucide-react";

export const CartPage = () => {
  const { items, orderDetails, total, totalQuantity, actions } = useCartPage();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6 lg:px-8 lg:py-8">
      <div className="mb-4 flex items-center gap-3 lg:mb-6">
        <Link
          to={appRoutes.home}
          className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ChevronLeft className="size-5" />
          <span className="sr-only">Volver al inicio</span>
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
            className="grid gap-3 sm:gap-4 max-h-[60vh] overflow-y-auto"
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
                onRemove={() => actions.remove(item)}
              />
            ))}
          </section>

          <aside className="grid gap-4 lg:sticky lg:top-24">
            <OrderSummary total={total} totalQuantity={totalQuantity} />
            <CustomerOrderForm
              orderDetails={orderDetails}
              onChangeField={actions.updateOrderDetail}
            />
            <CartCheckout onClearCart={actions.clearCart} />
          </aside>
        </div>
      )}
    </main>
  );
};
