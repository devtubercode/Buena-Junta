import type { ReactNode } from "react";
import { useAdminDeleteConfirm } from "@/features/admin/shared/hooks/useAdminDeleteConfirm";
import { deleteCategory } from "@/features/admin/categories/services/admin-categories.service";
import type { CategoryRow } from "@/features/admin/types/categories.types";

type UseAdminCategoryDeleteResult = {
  handleDelete: (category: CategoryRow) => Promise<void>;
  ConfirmDialog: () => ReactNode;
};

export function useAdminCategoryDelete(
  onDeleted: () => Promise<void>,
): UseAdminCategoryDeleteResult {
  const { confirmDelete, ConfirmDialog } = useAdminDeleteConfirm();

  const handleDelete = async (category: CategoryRow) => {
    const deleted = await confirmDelete({
      item: category,
      deleteFn: deleteCategory,
      id: category.id,
      itemLabel: "Categoría",
    });

    if (deleted) {
      await onDeleted();
    }
  };

  return { handleDelete, ConfirmDialog };
}
