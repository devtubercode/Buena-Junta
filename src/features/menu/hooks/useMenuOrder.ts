import { useCallback, useMemo } from "react";
import { useMenuOrderStore } from "@/store/menu-order/useMenuOrderStore";
import { useWhatsAppOrderSender } from "@/features/menu/hooks/useWhatsAppOrderSender";
import type {
  AddMenuOrderAdditionInput,
  AddMenuOrderItemInput,
  MenuOrderAddition,
  MenuOrderItem,
} from "@/store/menu-order/types/menu-order.types";

export type UseMenuOrderResult = {
  items: MenuOrderItem[];
  additions: MenuOrderAddition[];
  total: number;
  totalQuantity: number;
  customerName: string;
  generalObservation: string;
  canSendOrder: boolean;
  validationError: string | null;
  actions: {
    addItem: (input: AddMenuOrderItemInput) => void;
    addAddition: (input: AddMenuOrderAdditionInput) => void;
    removeItem: (lineId: string) => void;
    removeAddition: (lineId: string) => void;
    incrementItem: (lineId: string) => void;
    incrementAddition: (lineId: string) => void;
    decrementItem: (lineId: string) => void;
    decrementAddition: (lineId: string) => void;
    updateItemQuantity: (lineId: string, quantity: number) => void;
    updateAdditionQuantity: (lineId: string, quantity: number) => void;
    updateCustomerName: (name: string) => void;
    updateGeneralObservation: (observation: string) => void;
    clearOrder: () => void;
  };
  /** Envío por WhatsApp (canal final, no parte del estado del pedido). */
  sendOrder: () => void;
};

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
export function useMenuOrder(): UseMenuOrderResult {
  const items = useMenuOrderStore((state) => state.items);
  const additions = useMenuOrderStore((state) => state.additions);
  const customerName = useMenuOrderStore((state) => state.customerName);
  const generalObservation = useMenuOrderStore((state) => state.generalObservation);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const validationError = useMemo(() => {
    if (items.length === 0) {
      return "Agrega al menos un producto al pedido.";
    }

    if (!customerName.trim()) {
      return "Escribe el nombre del responsable del pedido.";
    }

    return null;
  }, [items.length, customerName]);

  const canSendOrder = validationError === null;

  const addItem = useCallback((input: AddMenuOrderItemInput) => {
    useMenuOrderStore.getState().addItem(input);
  }, []);

  const addAddition = useCallback((input: AddMenuOrderAdditionInput) => {
    useMenuOrderStore.getState().addAddition(input);
  }, []);

  const removeItem = useCallback((lineId: string) => {
    useMenuOrderStore.getState().removeItem(lineId);
  }, []);

  const removeAddition = useCallback((lineId: string) => {
    useMenuOrderStore.getState().removeAddition(lineId);
  }, []);

  const incrementItem = useCallback((lineId: string) => {
    useMenuOrderStore.getState().incrementItem(lineId);
  }, []);

  const incrementAddition = useCallback((lineId: string) => {
    useMenuOrderStore.getState().incrementAddition(lineId);
  }, []);

  const decrementItem = useCallback((lineId: string) => {
    useMenuOrderStore.getState().decrementItem(lineId);
  }, []);

  const decrementAddition = useCallback((lineId: string) => {
    useMenuOrderStore.getState().decrementAddition(lineId);
  }, []);

  const updateItemQuantity = useCallback((lineId: string, quantity: number) => {
    useMenuOrderStore.getState().updateItemQuantity(lineId, quantity);
  }, []);

  const updateAdditionQuantity = useCallback(
    (lineId: string, quantity: number) => {
      useMenuOrderStore.getState().updateAdditionQuantity(lineId, quantity);
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
  }, []);

  const { sendOrder } = useWhatsAppOrderSender({
    items,
    additions,
    customerName,
    generalObservation,
    total,
    clearOrder,
    canSendOrder,
    validationError,
  });

  return {
    items,
    additions,
    total,
    totalQuantity,
    customerName,
    generalObservation,
    canSendOrder,
    validationError,
    actions: {
      addItem,
      addAddition,
      removeItem,
      removeAddition,
      incrementItem,
      incrementAddition,
      decrementItem,
      decrementAddition,
      updateItemQuantity,
      updateAdditionQuantity,
      updateCustomerName,
      updateGeneralObservation,
      clearOrder,
    },
    sendOrder,
  };
}
