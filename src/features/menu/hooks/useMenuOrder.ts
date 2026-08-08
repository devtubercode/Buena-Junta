import { useCallback, useMemo } from "react";
import { useMenuOrderStore } from "@/store/menu-order/useMenuOrderStore";
import { useWhatsAppOrderSender } from "@/features/menu/hooks/useWhatsAppOrderSender";
import type {
  AddMenuOrderItemInput,
  MenuOrderDetails,
  MenuOrderPromotion,
  MenuOrderTopping,
} from "@/store/menu-order/types/menu-order.types";

/**
 * Hook que expone el pedido del menú junto con utilidades de UI.
 *
 * Encapsula:
 * - Lectura del store con selectores atómicos.
 * - Cálculo de totales.
 * - Validación mínima para enviar el pedido.
 * - Composición del envío por WhatsApp (la lógica de envío vive en
 *   `useWhatsAppOrderSender`).
 */
export function useMenuOrder() {
  const items = useMenuOrderStore((state) => state.items);
  const toppings = useMenuOrderStore((state) => state.toppings);
  const promotions = useMenuOrderStore((state) => state.promotions);
  const orderDetails = useMenuOrderStore((state) => state.orderDetails);

  const total = useMemo(
    () =>
      items.reduce((sum, item) => sum + item.price * item.quantity, 0) +
      toppings.reduce((sum, topping) => sum + topping.price * topping.quantity, 0) +
      promotions.reduce(
        (sum, promotion) => sum + promotion.price * promotion.quantity,
        0,
      ),
    [items, toppings, promotions],
  );

  const totalQuantity = useMemo(
    () =>
      items.reduce((sum, item) => sum + item.quantity, 0) +
      toppings.reduce((sum, topping) => sum + topping.quantity, 0) +
      promotions.reduce((sum, promotion) => sum + promotion.quantity, 0),
    [items, toppings, promotions],
  );

  const { customerName, fulfillmentType, table, deliveryAddress } = orderDetails;

  const validationError = useMemo(() => {
    if (!customerName.trim()) {
      return "Escribe nombre de quien hace pedido.";
    }

    if (fulfillmentType === "table" && !table.trim()) {
      return "Escribe número o referencia de mesa.";
    }

    if (fulfillmentType === "delivery" && !deliveryAddress.trim()) {
      return "Escribe dirección de entrega para domicilio.";
    }

    return null;
  }, [customerName, deliveryAddress, fulfillmentType, table]);

  const canSendOrder = validationError === null;

  const addItem = useCallback((input: AddMenuOrderItemInput) => {
    useMenuOrderStore.getState().addItem(input);
  }, []);

  const addTopping = useCallback((input: MenuOrderTopping) => {
    useMenuOrderStore.getState().addTopping(input);
  }, []);

  const addPromotion = useCallback((input: MenuOrderPromotion) => {
    useMenuOrderStore.getState().addPromotion(input);
  }, []);

  const removeItem = useCallback((lineId: string) => {
    useMenuOrderStore.getState().removeItem(lineId);
  }, []);

  const removeTopping = useCallback((id: string) => {
    useMenuOrderStore.getState().removeTopping(id);
  }, []);

  const removePromotion = useCallback((id: string) => {
    useMenuOrderStore.getState().removePromotion(id);
  }, []);

  const incrementItem = useCallback((lineId: string) => {
    useMenuOrderStore.getState().incrementItem(lineId);
  }, []);

  const incrementTopping = useCallback((id: string) => {
    useMenuOrderStore.getState().incrementTopping(id);
  }, []);

  const incrementPromotion = useCallback((id: string) => {
    useMenuOrderStore.getState().incrementPromotion(id);
  }, []);

  const decrementItem = useCallback((lineId: string) => {
    useMenuOrderStore.getState().decrementItem(lineId);
  }, []);

  const decrementTopping = useCallback((id: string) => {
    useMenuOrderStore.getState().decrementTopping(id);
  }, []);

  const decrementPromotion = useCallback((id: string) => {
    useMenuOrderStore.getState().decrementPromotion(id);
  }, []);

  const updateItemQuantity = useCallback((lineId: string, quantity: number) => {
    useMenuOrderStore.getState().updateItemQuantity(lineId, quantity);
  }, []);

  const updateToppingQuantity = useCallback(
    (id: string, quantity: number) => {
      useMenuOrderStore.getState().updateToppingQuantity(id, quantity);
    },
    [],
  );

  const updatePromotionQuantity = useCallback(
    (id: string, quantity: number) => {
      useMenuOrderStore.getState().updatePromotionQuantity(id, quantity);
    },
    [],
  );

  const updateOrderDetail = useCallback(
    <K extends keyof MenuOrderDetails>(key: K, value: MenuOrderDetails[K]) => {
      useMenuOrderStore.getState().updateOrderDetail(key, value);
    },
    [],
  );

  const updateOrderDetails = useCallback(
    (draft: Partial<MenuOrderDetails>) => {
      const store = useMenuOrderStore.getState();

      for (const [key, value] of Object.entries(draft) as Array<
        [keyof MenuOrderDetails, MenuOrderDetails[keyof MenuOrderDetails]]
      >) {
        store.updateOrderDetail(key, value);
      }
    },
    [],
  );

  const clearOrder = useCallback(() => {
    useMenuOrderStore.getState().clearOrder();
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("buenajunta-menu-order");
    }
  }, []);

  const { sendOrder } = useWhatsAppOrderSender({
    items,
    toppings,
    promotions,
    orderDetails,
    total,
    totalQuantity,
    clearOrder,
  });

  return {
    items,
    toppings,
    promotions,
    total,
    totalQuantity,
    orderDetails,
    canSendOrder,
    actions: {
      addItem,
      addTopping,
      addPromotion,
      removeItem,
      removeTopping,
      removePromotion,
      incrementItem,
      incrementTopping,
      incrementPromotion,
      decrementItem,
      decrementTopping,
      decrementPromotion,
      updateItemQuantity,
      updateToppingQuantity,
      updatePromotionQuantity,
      updateOrderDetail,
      updateOrderDetails,
      clearOrder,
    },
    sendOrder,
  };
}

export type UseMenuOrderResult = ReturnType<typeof useMenuOrder>;
