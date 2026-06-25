import { useCallback } from "react";
import { fetchAdminPromotionDetail } from "@/features/admin/services/admin-promotions.service";
import type { AdminPromotionDetailData } from "@/features/admin/types/admin.types";
import { useAdminResource } from "@/features/admin/hooks/useAdminResource";

const emptyPromotionDetail: AdminPromotionDetailData = {
  categories: [],
  products: [],
  promotion: null,
};

export function usePromotionDetailData(
  promotionId: string | null,
  slug: string | undefined,
  isNewPromotion: boolean,
) {
  const fetchPromotionDetail = useCallback(
    () =>
      fetchAdminPromotionDetail(
        isNewPromotion ? null : promotionId,
        isNewPromotion ? undefined : slug,
      ),
    [isNewPromotion, promotionId, slug],
  );

  return useAdminResource(fetchPromotionDetail, emptyPromotionDetail);
}
