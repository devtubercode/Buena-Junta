import { useCallback, useMemo, useState } from "react";
import { useCartStore } from "@/store/cart/useCartStore";
import {
  buildWhatsAppOrderMessage,
  buildWhatsAppUrl,
} from "@/features/cart/utils/whatsapp";
import { notify } from "@/shared/notifications/notify";

export type WhatsAppCheckoutState = {
  sendOrder: () => boolean;
  canSendOrder: boolean;
  validationError: string | null;
  lastError: string | null;
  clearError: () => void;
};

export function useWhatsAppCheckout(): WhatsAppCheckoutState {
  const items = useCartStore((state) => state.items);
  const orderDraft = useCartStore((state) => state.orderDraft);
  const total = useCartStore((state) => state.getTotal());

  const [lastError, setLastError] = useState<string | null>(null);

  const validationError = useMemo(() => {
    if (items.length === 0) {
      return "Agrega al menos un producto al carrito.";
    }

    if (!orderDraft.customerName.trim()) {
      return "Escribe el nombre del responsable del pedido.";
    }

    return null;
  }, [items.length, orderDraft.customerName]);

  const canSendOrder = validationError === null;

  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  const sendOrder = useCallback(() => {
    setLastError(null);

    if (!canSendOrder) {
      const error = validationError ?? "No se puede enviar el pedido.";
      setLastError(error);
      notify.error(error);
      return false;
    }

    try {
      const message = buildWhatsAppOrderMessage({
        items,
        orderDraft,
        total,
      });

      const openedWindow = window.open(
        buildWhatsAppUrl(message),
        "_blank",
        "noopener,noreferrer",
      );

      if (!openedWindow) {
        const error =
          "No pudimos abrir WhatsApp. Verifica que las ventanas emergentes estén permitidas.";
        setLastError(error);
        notify.error(error);
        return false;
      }

      notify.whatsapp("Pedido preparado para WhatsApp.");
      return true;
    } catch {
      const error =
        "No pudimos preparar el mensaje de WhatsApp. Intenta de nuevo.";
      setLastError(error);
      notify.error(error);
      return false;
    }
  }, [canSendOrder, items, orderDraft, total, validationError]);

  return {
    sendOrder,
    canSendOrder,
    validationError,
    lastError,
    clearError,
  };
}
