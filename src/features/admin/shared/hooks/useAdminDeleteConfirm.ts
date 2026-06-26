import { notify } from "@/shared/notifications/notify";

export function useAdminDeleteConfirm() {
  const confirmDelete = async <T extends { name: string }>(
    item: T,
    deleteFn: (id: string) => Promise<void>,
    id: string,
    itemLabel: string,
  ) => {
    if (!window.confirm(`¿Eliminar ${item.name}?`)) {
      return;
    }

    try {
      await deleteFn(id);
      notify.success(`${itemLabel} eliminado.`);
      return true;
    } catch (error) {
      notify.error(error instanceof Error ? error.message : String(error));
      return false;
    }
  };

  return { confirmDelete };
}
