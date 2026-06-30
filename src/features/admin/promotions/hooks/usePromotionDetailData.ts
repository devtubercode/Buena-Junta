import { useCallback } from "react";
import { fetchAdminPromotionDetail } from "@/features/admin/promotions/services/admin-promotions.service";
import type { AdminPromotionDetailData } from "@/features/admin/types/promotions.types";
import { useAdminResource } from "@/features/admin/shared/hooks/useAdminResource";

const emptyPromotionDetail: AdminPromotionDetailData = {
  categories: [],
  products: [],
  promotion: null,
};

export function usePromotionDetailData(
  promotionId: string | null,
  isNewPromotion: boolean,
) {
  const fetchPromotionDetail = useCallback(() => {
    if (!promotionId || isNewPromotion) {
      return Promise.resolve(emptyPromotionDetail);
    }

    return fetchAdminPromotionDetail(promotionId);
  }, [isNewPromotion, promotionId]);

  const enabled = Boolean(promotionId) && !isNewPromotion;

  return useAdminResource(fetchPromotionDetail, emptyPromotionDetail, {
    enabled,
  });
}
