import { useNavigate, useParams, useSearchParams } from "react-router";
import { appRoutes } from "@/app/routes";
import { AdminDetailShell } from "@/features/admin/shared/components/AdminDetailShell";
import { AdminNotFoundState } from "@/features/admin/shared/state/AdminNotFoundState";
import { PromotionDetailSkeleton } from "@/features/admin/shared/state/AdminSkeletons";
import { usePromotionDetailData } from "@/features/admin/promotions/hooks/usePromotionDetailData";
import { useAdminPromotionForm } from "@/features/admin/promotions/hooks/useAdminPromotionForm";
import { PromotionDetailForm } from "@/features/admin/promotions/components/PromotionDetailForm";
import type { PromotionRow } from "@/features/admin/types/promotions.types";
import { EmptyState } from "@/shared/components/EmptyState";

function getPromotionDetailPath(promotion: Pick<PromotionRow, "id" | "slug">) {
  return `${appRoutes.adminPromotions}/${promotion.slug}?id=${promotion.id}`;
}

export function PromotionDetailPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const promotionId = searchParams.get("id");
  const isNewPromotion = !slug || slug === "nueva";

  const {
    data: promotionDetail,
    isLoading,
    error,
    reload,
  } = usePromotionDetailData(promotionId, isNewPromotion);

  const { categories, products, promotion: selected } = promotionDetail;

  const {
    form,
    isSaving,
    imagePreviewUrl,
    imageAction,
    setSelectedImageFile,
    removeImage,
    toggleWeekday,
    onSubmit,
  } = useAdminPromotionForm({
    selected,
    isNewPromotion,
    onSaved: async (savedPromotion) => {
      await reload();
      navigate(getPromotionDetailPath(savedPromotion), { replace: true });
    },
  });

  if (error) {
    return (
      <EmptyState
        title="No se pudieron cargar los datos"
        description={error.message}
      />
    );
  }

  if (isLoading) return <PromotionDetailSkeleton />;

  if (!isNewPromotion && !selected) {
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
      title={selected ? selected.title : "Nueva promoción"}
      description="Gestiona la información, imagen, vigencia y relaciones de esta promoción."
      backTo={appRoutes.adminPromotions}
    >
      <PromotionDetailForm
        categories={categories}
        products={products}
        selected={selected}
        form={form}
        isSaving={isSaving}
        imagePreviewUrl={imagePreviewUrl}
        imageAction={imageAction}
        onImageFileChange={setSelectedImageFile}
        onRemoveImage={removeImage}
        toggleWeekday={toggleWeekday}
        onSubmit={onSubmit}
      />
    </AdminDetailShell>
  );
}
