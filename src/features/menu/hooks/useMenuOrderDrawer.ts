import { useCallback, useState } from "react";

export type UseMenuOrderDrawerResult = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

/**
 * Hook simple para controlar la apertura y cierre del drawer del pedido
 * desde el menú.
 */
export function useMenuOrderDrawer(): UseMenuOrderDrawerResult {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, open, close };
}
