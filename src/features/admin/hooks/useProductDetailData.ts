import { useCallback } from "react";
import { fetchAdminProductDetail } from "@/features/admin/services/admin-products.service";
import type { AdminProductDetailData } from "@/features/admin/types/admin.types";
import { useAdminResource } from "@/features/admin/hooks/useAdminResource";

const emptyProductDetail: AdminProductDetailData = {
  categories: [],
  option_groups: [],
  product_option_group_ids: [],
  product: null,
  product_variants: [],
  additions: [],
  product_addition_ids: [],
};

export function useProductDetailData(
  productId: string | null,
  slug: string | undefined,
  isNewProduct: boolean,
) {
  const fetchProductDetail = useCallback(
    () =>
      fetchAdminProductDetail(
        isNewProduct ? null : productId,
        isNewProduct ? undefined : slug,
      ),
    [isNewProduct, productId, slug],
  );

  return useAdminResource(fetchProductDetail, emptyProductDetail);
}
