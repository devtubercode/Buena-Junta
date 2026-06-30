import { Link } from "react-router";
import { Plus } from "lucide-react";
import { appRoutes } from "@/app/routes";
import { AdminDataState } from "@/features/admin/shared/state/AdminDataState";
import { AdminSection } from "@/features/admin/shared/components/AdminSection";
import { AdminPromotionsSkeleton } from "@/features/admin/shared/state/AdminSkeletons";
import { usePromotionsData } from "@/features/admin/promotions/hooks/usePromotionsData";
import { useAdminPromotionFilters } from "@/features/admin/promotions/hooks/useAdminPromotionFilters";
import { useAdminDeleteConfirm } from "@/features/admin/shared/hooks/useAdminDeleteConfirm";
import { PromotionsToolbar } from "@/features/admin/promotions/components/PromotionsToolbar";
import { PromotionList } from "@/features/admin/promotions/components/PromotionList";
import { PromotionEmptyState } from "@/features/admin/promotions/components/PromotionEmptyState";
import { deletePromotion } from "@/features/admin/promotions/services/admin-promotions.service";
import type { AdminPromotionListRow } from "@/features/admin/types/promotions.types";

export function PromotionsPage() {
  const { data: promotions, isLoading, error, reload } = usePromotionsData();
  const { confirmDelete, ConfirmDialog } = useAdminDeleteConfirm();

  const {
    statusFilter,
    setStatusFilter,
    filteredPromotions,
    activeFiltersCount,
  } = useAdminPromotionFilters(promotions);

  const handleDelete = async (promotion: AdminPromotionListRow) => {
    const deleted = await confirmDelete(
      promotion,
      deletePromotion,
      promotion.id,
      "Promoción",
    );

    if (deleted) {
      await reload();
    }
  };

  const clearFilters = () => {
    setStatusFilter("all");
  };

  if (error) {
    return <AdminDataState isLoading={false} error={error} />;
  }

  if (isLoading) {
    return (
      <AdminSection
        title="Promociones"
        description="Consulta promociones del menú y entra a cada promoción para editar vigencia, imagen y relaciones."
      >
        <AdminPromotionsSkeleton />
      </AdminSection>
    );
  }

  const hasPromotions = promotions.length > 0;
  const hasFilteredPromotions = filteredPromotions.length > 0;

  return (
    <AdminSection
      title="Promociones"
      description="Consulta promociones del menú y entra a cada promoción para editar vigencia, imagen y relaciones."
      actions={
        <Link
          to={`${appRoutes.adminPromotions}/nueva`}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90"
        >
          <Plus className="size-4" />
          Nueva promoción
        </Link>
      }
    >
      {hasPromotions ? (
        <PromotionsToolbar
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          activeFiltersCount={activeFiltersCount}
          onClearFilters={clearFilters}
          resultCount={filteredPromotions.length}
        />
      ) : null}

      {!hasPromotions ? (
        <PromotionEmptyState type="empty" />
      ) : !hasFilteredPromotions ? (
        <PromotionEmptyState
          type="no-results"
          onClearFilters={clearFilters}
        />
      ) : (
        <PromotionList
          promotions={filteredPromotions}
          onDelete={handleDelete}
        />
      )}

      <ConfirmDialog />
    </AdminSection>
  );
}
