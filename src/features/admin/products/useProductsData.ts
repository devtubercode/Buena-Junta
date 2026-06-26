import { useCallback } from "react";
import { fetchAdminProductsList } from "@/features/admin/products/services/admin-products.service";
import type { AdminProductListRow } from "@/features/admin/types/products.types";
import { useAdminResource } from "@/features/admin/shared/hooks/useAdminResource";

export function useProductsData() {
  const fetchProducts = useCallback(() => fetchAdminProductsList(), []);

  return useAdminResource<AdminProductListRow[]>(fetchProducts, []);
}
