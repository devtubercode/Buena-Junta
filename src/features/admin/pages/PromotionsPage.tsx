import { Link } from "react-router";
import { Edit3, ImageIcon, Plus, Trash2 } from "lucide-react";
import { appRoutes } from "@/app/routes";
import { AdminDataState } from "@/features/admin/components/AdminDataState";
import { AdminSection } from "@/features/admin/components/AdminSection";
import { AdminMediaListSkeleton } from "@/features/admin/components/AdminSkeletons";
import { usePromotionsData } from "@/features/admin/hooks/usePromotionsData";
import { notify } from "@/shared/notifications/notify";
import { deletePromotion } from "@/features/admin/services/admin-promotions.service";
import { SUPABASE_BUCKETS } from "@/lib/supabase/constants";
import { getStorageImageUrl } from "@/shared/services/storage.service";
import type { AdminPromotionListRow } from "@/features/admin/types/admin.types";

function getPromotionDetailPath(promotion: AdminPromotionListRow) {
  return `${appRoutes.adminPromotions}/${promotion.slug}?id=${promotion.id}`;
}

export function PromotionsPage() {
  const {
    data: promotions,
    isLoading,
    error,
    reload,
  } = usePromotionsData();

  const handleDelete = async (promotion: AdminPromotionListRow) => {
    if (!window.confirm(`Eliminar ${promotion.title}?`)) {
      return;
    }

    try {
      await deletePromotion(promotion.id);
      notify.success("Promoción eliminada.");
      await reload();
    } catch (error) {
      notify.error(error instanceof Error ? error.message : String(error));
    }
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
        <AdminMediaListSkeleton />
      </AdminSection>
    );
  }

  return (
    <AdminSection
      title="Promociones"
      description="Consulta promociones del menú y entra a cada promoción para editar vigencia, imagen y relaciones."
      actions={
        <Link
          to={`${appRoutes.adminPromotions}/nueva`}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-primary px-4 text-sm font-black text-primary-foreground"
        >
          <Plus className="size-4" />
          Nueva
        </Link>
      }
    >
      <div className="grid gap-3">
        {promotions.map((promotion) => {
          const imageUrl = promotion.image_path
            ? getStorageImageUrl(
                promotion.image_path,
                SUPABASE_BUCKETS.PROMOTION_IMAGES,
              )
            : null;
          const categoryName = promotion.categories?.name;
          const productName = promotion.products?.name;

          return (
            <article
              key={promotion.id}
              className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 rounded-lg border border-border bg-surface p-2.5 shadow-elevated sm:grid-cols-[84px_minmax(0,1fr)_auto] sm:p-3"
            >
              <Link
                to={getPromotionDetailPath(promotion)}
                className="flex aspect-square items-center justify-center overflow-hidden rounded-md border border-border bg-surface-muted text-muted-foreground"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={promotion.title}
                    className="size-full object-cover"
                  />
                ) : (
                  <ImageIcon className="size-7" />
                )}
              </Link>

              <div className="min-w-0 self-center">
                <Link
                  to={getPromotionDetailPath(promotion)}
                  className="block text-base font-black leading-tight text-foreground transition hover:text-primary sm:text-lg"
                >
                  {promotion.title}
                </Link>
                <p className="mt-1 text-xs font-bold leading-5 text-muted-foreground">
                  {promotion.slug}
                  {categoryName ? ` · ${categoryName}` : ""}
                  {productName ? ` · ${productName}` : ""}
                </p>
                {promotion.description ? (
                  <p className="mt-1 text-xs font-bold leading-5 text-muted-foreground sm:text-sm">
                    {promotion.description}
                  </p>
                ) : null}
              </div>

              <div className="col-span-2 flex items-center justify-between gap-2 border-t border-border pt-2 sm:col-span-1 sm:border-t-0 sm:pt-0 sm:justify-end">
                <span
                  className="rounded-full px-2.5 py-1 text-[11px] font-black sm:text-xs"
                  data-available={promotion.is_active}
                >
                  {promotion.is_active ? "Activa" : "Oculta"}
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    to={getPromotionDetailPath(promotion)}
                    className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-surface-muted text-foreground transition hover:border-primary"
                    aria-label={`Editar ${promotion.title}`}
                  >
                    <Edit3 className="size-4" />
                  </Link>
                  <button
                    type="button"
                    className="inline-flex size-9 items-center justify-center rounded-full border border-error-border bg-error-soft text-error"
                    onClick={() => void handleDelete(promotion)}
                    aria-label={`Eliminar ${promotion.title}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </AdminSection>
  );
}
