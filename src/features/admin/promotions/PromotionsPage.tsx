import { Link } from "react-router";
import { Plus } from "lucide-react";
import { appRoutes } from "@/app/routes";
import { Button } from "@/shared/components/Button";
import { AdminSection } from "@/features/admin/shared/components/AdminSection";
import { PromotionsSkeleton } from "@/features/admin/shared/state/AdminSkeletons";
import { useAdminResource } from "@/features/admin/shared/hooks/useAdminResource";
import { useAdminDeleteConfirm } from "@/features/admin/shared/hooks/useAdminDeleteConfirm";
import { PromotionStatusFilter } from "@/features/admin/promotions/components/PromotionStatusFilter";
import { PromotionCard } from "@/features/admin/promotions/components/PromotionCard";
import { PromotionEmptyState } from "@/features/admin/promotions/components/PromotionEmptyState";
import {
  deletePromotion,
  fetchAdminPromotionsList,
} from "@/features/admin/promotions/services/admin-promotions.service";
import { useAdminPromotionFilters } from "@/features/admin/promotions/hooks/useAdminPromotionFilters";
import type { AdminPromotionListRow } from "@/features/admin/types/promotions.types";
import { EmptyState } from "@/shared/components/EmptyState";

export const PromotionsPage = () => {
  const {
    data: promotions,
    setData: setPromotions,
    isLoading,
    error,
  } = useAdminResource<AdminPromotionListRow[]>(fetchAdminPromotionsList, []);

  const {
    statusFilter,
    setStatusFilter,
    filteredPromotions,
    activeFiltersCount,
  } = useAdminPromotionFilters(promotions);

  const { confirmDelete, ConfirmDialog: ConfirmPromotionDeleteDialog } =
    useAdminDeleteConfirm();

  const hasPromotions = promotions.length > 0;
  const hasFilteredPromotions = filteredPromotions.length > 0;

  const onDeletePromotion = async (promotion: AdminPromotionListRow) => {
    const deleted = await confirmDelete<AdminPromotionListRow>({
      item: promotion,
      deleteFn: deletePromotion,
      id: promotion.id,
      itemLabel: "Promoción",
    });

    if (deleted) {
      setPromotions((prev) => prev.filter((p) => p.id !== promotion.id));
    }
  };

  const clearFilters = () => setStatusFilter("all");

  if (error) {
    return (
      <EmptyState
        title="No se pudieron cargar los datos"
        description={error.message}
      />
    );
  }

  if (isLoading) return <PromotionsSkeleton />;

  return (
    <AdminSection
      title="Promociones"
      description="Consulta promociones del menú y entra a cada promoción para editar vigencia, imagen y relaciones."
      actions={
        <Link
          to={`${appRoutes.adminPromotions}/new`}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90"
        >
          <Plus className="size-4" />
          Nuevo
        </Link>
      }
    >
      {hasPromotions ? (
        <div className="grid min-w-0 gap-4">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <PromotionStatusFilter
              value={statusFilter}
              onChange={setStatusFilter}
            />
            {activeFiltersCount > 0 ? (
              <Button
                type="button"
                variant="outline"
                radius="full"
                onClick={clearFilters}
              >
                Limpiar filtros
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      {!hasPromotions ? (
        <PromotionEmptyState type="empty" />
      ) : !hasFilteredPromotions ? (
        <PromotionEmptyState type="no-results" />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
          {filteredPromotions.map((promotion) => (
            <PromotionCard
              key={promotion.id}
              promotion={promotion}
              onDelete={onDeletePromotion}
            />
          ))}
        </div>
      )}

      <ConfirmPromotionDeleteDialog />
    </AdminSection>
  );
};
