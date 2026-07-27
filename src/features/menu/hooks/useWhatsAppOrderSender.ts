import { useCallback } from "react";
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
} from "@/features/menu/utils/whatsappMessage";
import { notify } from "@/shared/notifications/notify";
import type {
  MenuOrderDetails,
  MenuOrderItem,
  MenuOrderTopping,
} from "@/store/menu-order/types/menu-order.types";

type UseWhatsAppOrderSenderInput = {
  items: MenuOrderItem[];
  toppings: MenuOrderTopping[];
  orderDetails: MenuOrderDetails;
  total: number;
  totalQuantity: number;
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

function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}

/**
 * Hook encargado del canal final de envío por WhatsApp.
 *
 * No gestiona el estado del pedido: solo recibe los datos necesarios,
 * construye el mensaje y abre WhatsApp. La lógica de orden permanece en
 * `useMenuOrder`.
 *
 * En dispositivos móviles (especialmente Safari iOS) window.open puede
 * retornar null aunque se abra correctamente. Por eso en mobile usamos
 * window.location.href como fallback y no mostramos error si retorna null.
 */
export function useWhatsAppOrderSender({
  items,
  toppings,
  orderDetails,
  total,
  totalQuantity,
  clearOrder,
}: UseWhatsAppOrderSenderInput): UseWhatsAppOrderSenderResult {
  const sendOrder = useCallback(() => {
    try {
      const url = buildWhatsAppUrl(
        buildWhatsAppOrderMessage({
          items: [...items, ...toppings.map(toppingToMessageItem)],
          orderDraft: orderDetails,
          total,
          totalQuantity,
        }),
      );

      const isMobile = isMobileDevice();

      if (isMobile) {
        window.location.href = url;
      } else {
        const openedWindow = window.open(url, "_blank", "noopener,noreferrer");

        if (!openedWindow) {
          notify.error(
            "No pudimos abrir WhatsApp. Verifica que las ventanas emergentes estén permitidas.",
          );
          return;
        }
      }

      clearOrder();
      notify.whatsapp("Pedido preparado para WhatsApp.");
    } catch {
      notify.error(
        "No pudimos preparar el mensaje de WhatsApp. Intenta de nuevo.",
      );
    }
  }, [
    items,
    toppings,
    orderDetails,
    total,
    totalQuantity,
    clearOrder,
  ]);

  return { sendOrder };
}
