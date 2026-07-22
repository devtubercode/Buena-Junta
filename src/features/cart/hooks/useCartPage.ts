import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { appRoutes } from "@/app/routes";
import { useCartStore } from "@/store/cart/useCartStore";
import { useWhatsAppCheckout } from "@/features/cart/hooks/useWhatsAppCheckout";
import { formatCartItemName } from "@/features/cart/utils/cartCopy";
import { notify } from "@/shared/notifications/notify";
import type { CartItem, OrderDraft } from "@/features/cart/types/cart.types";

export type CartItemHandler = (item: CartItem) => void;
export type CartItemQuantityHandler = (item: CartItem, quantity: number) => void;

export type CartPageState = {
  items: CartItem[];
  orderDraft: OrderDraft;
  total: number;
  totalQuantity: number;
  isConfirmationOpen: boolean;
  canSendOrder: boolean;
  actions: {
    increment: CartItemHandler;
    decrement: CartItemHandler;
    updateQuantity: CartItemQuantityHandler;
    remove: CartItemHandler;
    sendOrder: () => void;
    confirmOrderSent: () => void;
    dismissConfirmation: () => void;
    clearCart: () => void;
    updateOrderDraft: (draft: Partial<OrderDraft>) => void;
  };
};

export function useCartPage(): CartPageState {
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const orderDraft = useCartStore((state) => state.orderDraft);
  const removeItem = useCartStore((state) => state.removeItem);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const updateOrderDraft = useCartStore((state) => state.updateOrderDraft);
  const clearCart = useCartStore((state) => state.clearCart);
  const clearCurrentOrder = useCartStore((state) => state.clearCurrentOrder);
  const total = useCartStore((state) => state.getTotal());
  const totalQuantity = useCartStore((state) => state.getTotalQuantity());

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const whatsAppCheckout = useWhatsAppCheckout();

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
      notify.success(`${formatCartItemName(item.baseName ?? item.name)} eliminado del carrito.`);
    },
    [removeItem],
  );

  const sendOrder = useCallback(() => {
    const sent = whatsAppCheckout.sendOrder();
    if (sent) {
      setIsConfirmationOpen(true);
    }
  }, [whatsAppCheckout]);

  const confirmOrderSent = useCallback(() => {
    clearCurrentOrder();
    setIsConfirmationOpen(false);
    notify.success("Carrito limpio para un nuevo pedido.");
    navigate(appRoutes.menu);
  }, [clearCurrentOrder, navigate]);

  const dismissConfirmation = useCallback(() => {
    setIsConfirmationOpen(false);
  }, []);

  const clear = useCallback(() => {
    clearCart();
    notify.info("Carrito limpio.");
  }, [clearCart]);

  return {
    items,
    orderDraft,
    total,
    totalQuantity,
    isConfirmationOpen,
    canSendOrder: whatsAppCheckout.canSendOrder,
    actions: {
      increment,
      decrement,
      updateQuantity: updateItemQuantity,
      remove,
      sendOrder,
      confirmOrderSent,
      dismissConfirmation,
      clearCart: clear,
      updateOrderDraft,
    },
  };
}
