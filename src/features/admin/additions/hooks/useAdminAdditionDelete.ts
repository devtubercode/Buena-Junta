import type { ReactNode } from "react";
import { useAdminDeleteConfirm } from "@/features/admin/shared/hooks/useAdminDeleteConfirm";
import { deleteAddition } from "@/features/admin/additions/services/admin-additions.service";
import type { AdditionRow } from "@/features/admin/types/additions.types";

type UseAdminAdditionDeleteResult = {
  handleDelete: (addition: AdditionRow) => Promise<void>;
  ConfirmDialog: () => ReactNode;
};

export function useAdminAdditionDelete(
  onDeleted: () => Promise<void>,
): UseAdminAdditionDeleteResult {
  const { confirmDelete, ConfirmDialog } = useAdminDeleteConfirm();

  const handleDelete = async (addition: AdditionRow) => {
    const deleted = await confirmDelete(
      addition,
      deleteAddition,
      addition.id,
      "Adición",
    );

    if (deleted) {
      await onDeleted();
    }
  };

  return { handleDelete, ConfirmDialog };
}
