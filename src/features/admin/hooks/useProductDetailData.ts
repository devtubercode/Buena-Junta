import { useCallback } from "react";
import { fetchAdminProductDetail } from "@/features/admin/services/admin-products.service";
import type { AdminProductDetailData } from "@/features/admin/types/admin.types";
import { useAdminResource } from "@/features/admin/hooks/useAdminResource";

const emptyProductDetail: AdminProductDetailData = {
  product: null,
  product_variants: [],
  product_additions: [],
  product_option_groups: [],
};

export function useProductDetailData(
  productId: string | null,
  isNewProduct: boolean,
) {
  const fetchProductDetail = useCallback(() => {
    if (!productId || isNewProduct) {
      return Promise.resolve(emptyProductDetail);
    }

    return fetchAdminProductDetail(productId);
  }, [isNewProduct, productId]);

  const enabled = Boolean(productId) && !isNewProduct;

  return useAdminResource(fetchProductDetail, emptyProductDetail, { enabled });
}
