import { useCallback } from "react";
import { fetchAdminProductsList } from "@/features/admin/services/admin-products.service";
import type { AdminProductListRow } from "@/features/admin/types/admin.types";
import { useAdminResource } from "@/features/admin/hooks/useAdminResource";

export function useProductsData() {
  const fetchProducts = useCallback(() => fetchAdminProductsList(), []);

  return useAdminResource<AdminProductListRow[]>(fetchProducts, []);
}
