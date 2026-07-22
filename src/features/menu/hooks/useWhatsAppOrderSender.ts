import { useCallback } from "react";
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
} from "@/shared/utils/whatsappMessage";
import { notify } from "@/shared/notifications/notify";
import type {
  MenuOrderAddition,
  MenuOrderItem,
} from "@/store/menu-order/types/menu-order.types";

type UseWhatsAppOrderSenderInput = {
  items: MenuOrderItem[];
  additions: MenuOrderAddition[];
  customerName: string;
  generalObservation: string;
  total: number;
  clearOrder: () => void;
  canSendOrder: boolean;
  validationError: string | null;
};

type UseWhatsAppOrderSenderResult = {
  sendOrder: () => void;
};

function additionToMessageItem(
  addition: MenuOrderAddition,
): {
  name: string;
  price: number;
  quantity: number;
  variantKey?: string;
  selectedOptions?: Record<string, string>;
  additionOptions?: Array<{ key: string; label: string; unitPrice: number }>;
} {
  return {
    name: addition.name,
    price: addition.price,
    quantity: addition.quantity,
  };
}

/**
 * Hook encargado del canal final de envío por WhatsApp.
 *
 * No gestiona el estado del pedido: solo recibe los datos necesarios,
 * construye el mensaje y abre WhatsApp. La lógica de orden permanece en
 * `useMenuOrder`.
 */
export function useWhatsAppOrderSender({
  items,
  additions,
  customerName,
  generalObservation,
  total,
  clearOrder,
  canSendOrder,
  validationError,
}: UseWhatsAppOrderSenderInput): UseWhatsAppOrderSenderResult {
  const sendOrder = useCallback(() => {
    if (!canSendOrder) {
      notify.error(validationError ?? "No se puede enviar el pedido.");
      return;
    }

    try {
      const message = buildWhatsAppOrderMessage({
        items: [...items, ...additions.map(additionToMessageItem)],
        orderDraft: {
          customerName,
          table: "",
          generalObservation,
        },
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
  }, [
    canSendOrder,
    items,
    additions,
    customerName,
    generalObservation,
    total,
    validationError,
    clearOrder,
  ]);

  return { sendOrder };
}
