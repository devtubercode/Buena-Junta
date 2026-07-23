import { useCallback, useMemo } from "react";
import { useMenuOrderStore } from "@/store/menu-order/useMenuOrderStore";
import { useWhatsAppOrderSender } from "@/features/menu/hooks/useWhatsAppOrderSender";
import type {
  AddMenuOrderItemInput,
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
  const customerName = useMenuOrderStore((state) => state.customerName);
  const generalObservation = useMenuOrderStore(
    (state) => state.generalObservation,
  );

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const totalQuantity = useMemo(
    () =>
      items.reduce((sum, item) => sum + item.quantity, 0) +
      toppings.reduce((sum, topping) => sum + topping.quantity, 0),
    [items, toppings],
  );

  const validationError = useMemo(() => {
    if (!customerName.trim()) {
      return "Escribe el nombre del responsable del pedido.";
    }

    return null;
  }, [customerName]);

  const canSendOrder = validationError === null;

  const addItem = useCallback((input: AddMenuOrderItemInput) => {
    useMenuOrderStore.getState().addItem(input);
  }, []);

  const addTopping = useCallback((input: MenuOrderTopping) => {
    useMenuOrderStore.getState().addTopping(input);
  }, []);

  const removeItem = useCallback((lineId: string) => {
    useMenuOrderStore.getState().removeItem(lineId);
  }, []);

  const removeTopping = useCallback((id: string) => {
    useMenuOrderStore.getState().removeTopping(id);
  }, []);

  const incrementItem = useCallback((lineId: string) => {
    useMenuOrderStore.getState().incrementItem(lineId);
  }, []);

  const incrementTopping = useCallback((id: string) => {
    useMenuOrderStore.getState().incrementTopping(id);
  }, []);

  const decrementItem = useCallback((lineId: string) => {
    useMenuOrderStore.getState().decrementItem(lineId);
  }, []);

  const decrementTopping = useCallback((id: string) => {
    useMenuOrderStore.getState().decrementTopping(id);
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

  const updateCustomerName = useCallback((name: string) => {
    useMenuOrderStore.getState().updateCustomerName(name);
  }, []);

  const updateGeneralObservation = useCallback((observation: string) => {
    useMenuOrderStore.getState().updateGeneralObservation(observation);
  }, []);

  const clearOrder = useCallback(() => {
    useMenuOrderStore.getState().clearOrder();
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("buenajunta-menu-order");
    }
  }, []);

  const { sendOrder } = useWhatsAppOrderSender({
    items,
    toppings,
    customerName,
    generalObservation,
    total,
    clearOrder,
  });

  return {
    items,
    toppings,
    total,
    totalQuantity,
    customerName,
    generalObservation,
    canSendOrder,
    actions: {
      addItem,
      addTopping,
      removeItem,
      removeTopping,
      incrementItem,
      incrementTopping,
      decrementItem,
      decrementTopping,
      updateItemQuantity,
      updateToppingQuantity,
      updateCustomerName,
      updateGeneralObservation,
      clearOrder,
    },
    sendOrder,
  };
}

export type UseMenuOrderResult = ReturnType<typeof useMenuOrder>;
