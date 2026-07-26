import { useCallback } from "react";
import { useCartStore } from "@/store/cart/useCartStore";
import { notify } from "@/shared/notifications/notify";
import { formatProductName } from "@/shared/utils/formatProductName";
import type { CartItem, OrderDraft } from "@/features/cart/types/cart.types";

export type CartItemHandler = (item: CartItem) => void;
export type CartItemQuantityHandler = (
  item: CartItem,
  quantity: number,
) => void;

export type CartPageState = {
  items: CartItem[];
  orderDraft: OrderDraft;
  total: number;
  totalQuantity: number;
  actions: {
    increment: CartItemHandler;
    decrement: CartItemHandler;
    updateQuantity: CartItemQuantityHandler;
    remove: CartItemHandler;
    clearCart: () => void;
    updateOrderDraft: (draft: Partial<OrderDraft>) => void;
  };
};

export function useCartPage(): CartPageState {
  const items = useCartStore((state) => state.items);
  const orderDraft = useCartStore((state) => state.orderDraft);
  const removeItem = useCartStore((state) => state.removeItem);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const updateOrderDraft = useCartStore((state) => state.updateOrderDraft);
  const clearCart = useCartStore((state) => state.clearCart);
  const total = useCartStore((state) => state.getTotal());
  const totalQuantity = useCartStore((state) => state.getTotalQuantity());

  const increment = useCallback(
    (item: CartItem) => incrementItem(item.lineId),
    [incrementItem],
  );

  const decrement = useCallback(
    (item: CartItem) => decrementItem(item.lineId),
    [decrementItem],
  );

  const updateItemQuantity = useCallback(
    (item: CartItem, quantity: number) => updateQuantity(item.lineId, quantity),
    [updateQuantity],
  );

  const remove = useCallback(
    (item: CartItem) => {
      removeItem(item.lineId);
      notify.success(
        `${formatProductName(item.baseName ?? item.name)} eliminado del carrito.`,
      );
    },
    [removeItem],
  );

  const clear = useCallback(() => {
    clearCart();
    notify.info("Carrito limpio.");
  }, [clearCart]);

  return {
    items,
    orderDraft,
    total,
    totalQuantity,
    actions: {
      increment,
      decrement,
      updateQuantity: updateItemQuantity,
      remove,
      clearCart: clear,
      updateOrderDraft,
    },
  };
}
