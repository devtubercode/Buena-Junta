import { useCallback, useState } from "react";

export type UseWhatsAppOrderDrawerResult = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

/**
 * Hook simple para controlar la apertura y cierre del drawer del pedido
 * por WhatsApp.
 */
export function useWhatsAppOrderDrawer(): UseWhatsAppOrderDrawerResult {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, open, close };
}
