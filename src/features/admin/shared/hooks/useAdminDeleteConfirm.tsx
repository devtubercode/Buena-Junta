import { useCallback, useRef, useState } from "react";
import { AdminConfirmDialog } from "@/features/admin/shared/components/AdminConfirmDialog";
import { notify } from "@/shared/notifications/notify";

type DeleteConfig = {
  id: string;
  name: string;
  itemLabel: string;
  deleteFn: (id: string) => Promise<void>;
};

type confirmDeleteArguments<T> = {
  item: T;
  deleteFn: (id: string) => Promise<void>;
  id: string;
  itemLabel: string;
};

export function useAdminDeleteConfirm() {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<DeleteConfig | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirmDelete = <T extends { name?: string; title?: string }>({
    item,
    deleteFn,
    id,
    itemLabel,
  }: confirmDeleteArguments<T>): Promise<boolean> => {
    const name = item.name ?? item.title ?? "";
    setConfig({ id, name, itemLabel, deleteFn });
    setIsOpen(true);

    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  };

  const handleClose = useCallback((confirmed: boolean) => {
    setIsOpen(false);
    resolveRef.current?.(confirmed);
    resolveRef.current = null;
    setConfig(null);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!config) {
      return;
    }

    setIsDeleting(true);

    try {
      await config.deleteFn(config.id);
      notify.success(`${config.itemLabel} eliminado.`);
      handleClose(true);
    } catch (error) {
      notify.error(error instanceof Error ? error.message : String(error));
      handleClose(false);
    } finally {
      setIsDeleting(false);
    }
  }, [config, handleClose]);

  const ConfirmDialog = useCallback(() => {
    return (
      <AdminConfirmDialog
        isOpen={isOpen}
        title={`¿Eliminar ${config?.name ?? ""}?`}
        description={`La ${config?.itemLabel.toLowerCase() ?? "entrada"} se eliminará de forma permanente. Esta acción no se puede deshacer.`}
        confirmLabel={`Eliminar ${config?.itemLabel.toLowerCase() ?? ""}`}
        cancelLabel="Cancelar"
        isConfirming={isDeleting}
        onConfirm={handleConfirm}
        onCancel={() => handleClose(false)}
      />
    );
  }, [isOpen, config, isDeleting, handleConfirm, handleClose]);

  return { confirmDelete, ConfirmDialog };
}
