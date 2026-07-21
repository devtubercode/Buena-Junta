import { useCallback, useMemo } from "react";
import { useWhatsAppOrderStore } from "@/store/whatsapp/useWhatsAppOrderStore";
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
} from "@/features/cart/utils/whatsapp";
import { notify } from "@/shared/notifications/notify";
import type {
  AddWhatsAppOrderItemInput,
  WhatsAppOrderItem,
} from "@/store/whatsapp/types/whatsapp-order.types";

export type UseWhatsAppOrderResult = {
  items: WhatsAppOrderItem[];
  total: number;
  totalQuantity: number;
  customerName: string;
  generalNotes: string;
  canSendOrder: boolean;
  validationError: string | null;
  actions: {
    addItem: (input: AddWhatsAppOrderItemInput) => void;
    removeItem: (lineId: string) => void;
    incrementItem: (lineId: string) => void;
    decrementItem: (lineId: string) => void;
    updateQuantity: (lineId: string, quantity: number) => void;
    updateItemNote: (lineId: string, note: string) => void;
    updateCustomerName: (name: string) => void;
    updateGeneralNotes: (notes: string) => void;
    clearOrder: () => void;
    sendOrder: () => void;
  };
};

const EMPTY_ORDER_DRAFT = {
  customerName: "",
  table: "",
  generalNotes: "",
};

/**
 * Hook que expone el pedido por WhatsApp junto con utilidades de UI.
 *
 * Encapsula:
 * - Lectura del store con selectores atómicos.
 * - Cálculo de totales.
 * - Validación mínima para enviar el pedido.
 * - Envío por WhatsApp (mensaje + URL) y limpieza del pedido.
 */
export function useWhatsAppOrder(): UseWhatsAppOrderResult {
  const items = useWhatsAppOrderStore((state) => state.items);
  const customerName = useWhatsAppOrderStore((state) => state.customerName);
  const generalNotes = useWhatsAppOrderStore((state) => state.generalNotes);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
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

  const addItem = useCallback(
    (input: AddWhatsAppOrderItemInput) => {
      useWhatsAppOrderStore.getState().addItem(input);
    },
    [],
  );

  const removeItem = useCallback((lineId: string) => {
    useWhatsAppOrderStore.getState().removeItem(lineId);
  }, []);

  const incrementItem = useCallback((lineId: string) => {
    useWhatsAppOrderStore.getState().incrementItem(lineId);
  }, []);

  const decrementItem = useCallback((lineId: string) => {
    useWhatsAppOrderStore.getState().decrementItem(lineId);
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    useWhatsAppOrderStore.getState().updateQuantity(lineId, quantity);
  }, []);

  const updateItemNote = useCallback((lineId: string, note: string) => {
    useWhatsAppOrderStore.getState().updateItemNote(lineId, note);
  }, []);

  const updateCustomerName = useCallback((name: string) => {
    useWhatsAppOrderStore.getState().updateCustomerName(name);
  }, []);

  const updateGeneralNotes = useCallback((notes: string) => {
    useWhatsAppOrderStore.getState().updateGeneralNotes(notes);
  }, []);

  const clearOrder = useCallback(() => {
    useWhatsAppOrderStore.getState().clearOrder();
  }, []);

  const sendOrder = useCallback(() => {
    if (!canSendOrder) {
      notify.error(validationError ?? "No se puede enviar el pedido.");
      return;
    }

    try {
      const message = buildWhatsAppOrderMessage({
        items,
        orderDraft: { ...EMPTY_ORDER_DRAFT, customerName, generalNotes },
        total,
      });

      const openedWindow = window.open(
        buildWhatsAppUrl(message),
        "_blank",
        "noopener,noreferrer",
      );

      if (!openedWindow) {
        notify.error(
          "No pudimos abrir WhatsApp. Verifica que las ventanas emergentes estén permitidas.",
        );
        return;
      }

      notify.whatsapp("Pedido preparado para WhatsApp.");
      clearOrder();
    } catch {
      notify.error(
        "No pudimos preparar el mensaje de WhatsApp. Intenta de nuevo.",
      );
    }
  }, [canSendOrder, items, customerName, generalNotes, total, validationError, clearOrder]);

  return {
    items,
    total,
    totalQuantity,
    customerName,
    generalNotes,
    canSendOrder,
    validationError,
    actions: {
      addItem,
      removeItem,
      incrementItem,
      decrementItem,
      updateQuantity,
      updateItemNote,
      updateCustomerName,
      updateGeneralNotes,
      clearOrder,
      sendOrder,
    },
  };
}
