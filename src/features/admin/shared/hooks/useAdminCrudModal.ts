import { useState } from "react";

export function useAdminCrudModal<TItem>() {
  const [selected, setSelected] = useState<TItem | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openNew = () => {
    setSelected(null);
    setIsOpen(true);
  };

  const openEdit = (item: TItem) => {
    setSelected(item);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return {
    selected,
    isOpen,
    openNew,
    openEdit,
    close,
  };
}

