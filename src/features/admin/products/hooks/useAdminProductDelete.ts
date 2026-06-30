import type { ReactNode } from "react";
import { useAdminDeleteConfirm } from "@/features/admin/shared/hooks/useAdminDeleteConfirm";
import { deleteProduct } from "@/features/admin/products/services/admin-products.service";
import type { AdminProductListRow } from "@/features/admin/types/products.types";

type UseAdminProductDeleteResult = {
  handleDelete: (product: AdminProductListRow) => Promise<void>;
  ConfirmDialog: () => ReactNode;
};

export function useAdminProductDelete(
  onDeleted: () => Promise<void>,
): UseAdminProductDeleteResult {
  const { confirmDelete, ConfirmDialog } = useAdminDeleteConfirm();

  const handleDelete = async (product: AdminProductListRow) => {
    const deleted = await confirmDelete(
      product,
      deleteProduct,
      product.id,
      "Producto",
    );

    if (deleted) {
      await onDeleted();
    }
  };

  return { handleDelete, ConfirmDialog };
}
