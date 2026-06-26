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
  isNewPromotion: boolean,
) {
  const fetchPromotionDetail = useCallback(
    () => fetchAdminPromotionDetail(isNewPromotion ? null : promotionId),
    [isNewPromotion, promotionId],
  );

  return useAdminResource(fetchPromotionDetail, emptyPromotionDetail);
}
