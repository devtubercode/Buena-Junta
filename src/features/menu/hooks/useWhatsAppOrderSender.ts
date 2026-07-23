import { useCallback } from "react";
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
} from "@/shared/utils/whatsappMessage";
import { notify } from "@/shared/notifications/notify";
import type {
  MenuOrderItem,
  MenuOrderTopping,
} from "@/store/menu-order/types/menu-order.types";

type UseWhatsAppOrderSenderInput = {
  items: MenuOrderItem[];
  toppings: MenuOrderTopping[];
  customerName: string;
  generalObservation: string;
  total: number;
  clearOrder: () => void;
};

type UseWhatsAppOrderSenderResult = {
  sendOrder: () => void;
};

function toppingToMessageItem(topping: MenuOrderTopping): {
  name: string;
  price: number;
  quantity: number;
  variantKey?: string;
  selectedOptions?: Record<string, string>;
  additionOptions?: Array<{ key: string; label: string; unitPrice: number }>;
} {
  return {
    name: topping.name,
    price: topping.price,
    quantity: topping.quantity,
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
  toppings,
  customerName,
  generalObservation,
  total,
  clearOrder,
}: UseWhatsAppOrderSenderInput): UseWhatsAppOrderSenderResult {
  const sendOrder = useCallback(() => {
    try {
      const message = buildWhatsAppOrderMessage({
        items: [...items, ...toppings.map(toppingToMessageItem)],
        orderDraft: {
          customerName,
          table: "",
          generalObservation,
        },
        total,
      });

      clearOrder();

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
    } catch {
      notify.error(
        "No pudimos preparar el mensaje de WhatsApp. Intenta de nuevo.",
      );
    }
  }, [items, toppings, customerName, generalObservation, total, clearOrder]);

  return { sendOrder };
}
