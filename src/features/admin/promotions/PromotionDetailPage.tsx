import { useNavigate, useParams } from "react-router";
import { appRoutes } from "@/app/routes";
import { AdminDetailShell } from "@/features/admin/shared/components/AdminDetailShell";
import { AdminNotFoundState } from "@/features/admin/shared/state/AdminNotFoundState";
import { PromotionDetailSkeleton } from "@/features/admin/shared/state/AdminSkeletons";
import { PromotionDetailForm } from "@/features/admin/promotions/components/PromotionDetailForm";
import type {
  AdminPromotionDetailData,
  PromotionRow,
} from "@/features/admin/types/promotions.types";
import { EmptyState } from "@/shared/components/EmptyState";
import { useCallback } from "react";
import { fetchAdminPromotionDetail } from "./services/admin-promotions.service";
import { useAdminResource } from "../shared/hooks/useAdminResource";

const emptyPromotionDetail: AdminPromotionDetailData = {
  categories: [],
  products: [],
  promotion: null,
};

export const PromotionDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const isNewPromotion = !slug || slug === "new";

  const fetchPromotionDetail = useCallback(() => {
    return fetchAdminPromotionDetail(isNewPromotion ? undefined : slug!);
  }, [slug, isNewPromotion]);

  const {
    data: promotionDetail,
    setData: setPromotionDetail,
    isLoading,
    error,
  } = useAdminResource(fetchPromotionDetail, emptyPromotionDetail);

  const handlePromotionSaved = (promotionSaved: PromotionRow) => {
    const goToNew = `/admin/promociones/${promotionSaved.slug}`;
    setPromotionDetail({ ...promotionDetail, promotion: promotionSaved });

    if (isNewPromotion) navigate(goToNew, { replace: true });
  };

  if (error) {
    return (
      <EmptyState
        title="No se pudieron cargar los datos"
        description={error.message}
      />
    );
  }

  if (isLoading) return <PromotionDetailSkeleton />;

  if (!isNewPromotion && !promotionDetail.promotion) {
    return (
      <AdminNotFoundState
        title="Promoción no encontrada"
        description="No se encontró una promoción con ese identificador."
        backTo={appRoutes.adminPromotions}
      />
    );
  }

  return (
    <AdminDetailShell
      title={
        promotionDetail.promotion
          ? promotionDetail.promotion.title
          : "Nueva promoción"
      }
      description="Gestiona la información, imagen, vigencia y relaciones de esta promoción."
      backTo={appRoutes.adminPromotions}
    >
      <PromotionDetailForm
        categories={promotionDetail.categories}
        products={promotionDetail.products}
        promotion={promotionDetail.promotion}
        onChangePromotionSaved={handlePromotionSaved}
      />
    </AdminDetailShell>
  );
};
