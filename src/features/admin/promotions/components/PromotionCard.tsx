import { Link } from "react-router";
import { Edit3, ImageIcon, Trash2 } from "lucide-react";
import { appRoutes } from "@/app/routes";
import { SUPABASE_BUCKETS } from "@/lib/supabase/constants";
import { getStorageImageUrl } from "@/shared/services/storage.service";
import { cn } from "@/shared/utils/cn";
import { PromotionStatusBadge } from "./PromotionStatusBadge";
import { getPromotionStatus } from "@/features/admin/promotions/utils/promotionFilters";
import type { AdminPromotionListRow } from "@/features/admin/types/promotions.types";

type PromotionCardProps = {
  promotion: AdminPromotionListRow;
  onDelete: (promotion: AdminPromotionListRow) => void;
};

function getPromotionDetailPath(promotion: AdminPromotionListRow) {
  return `${appRoutes.adminPromotions}/${promotion.slug}?id=${promotion.id}`;
}

export function PromotionCard({ promotion, onDelete }: PromotionCardProps) {
  const imageUrl = promotion.image_path
    ? getStorageImageUrl(
        promotion.image_path,
        SUPABASE_BUCKETS.PROMOTION_IMAGES,
      )
    : null;

  const categoryName = promotion.categories?.name;
  const productName = promotion.products?.name;
  const status = getPromotionStatus(promotion);

  const relationLabel = [categoryName, productName]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="group flex min-w-0 flex-row gap-3 rounded-xl border border-border bg-surface p-3 shadow-elevated transition hover:border-primary/30 hover:shadow-lg sm:flex-col">
      <Link
        to={getPromotionDetailPath(promotion)}
        className="shrink-0 sm:block"
      >
        <div
          className={cn(
            "flex size-18 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface-muted text-muted-foreground transition group-hover:border-primary/30 sm:aspect-video sm:h-auto sm:w-full",
            status === "expired" && "opacity-60",
          )}
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
        </div>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={getPromotionDetailPath(promotion)}
              className="block truncate font-heading text-base font-black leading-tight text-foreground transition hover:text-primary sm:text-lg"
            >
              {promotion.title}
            </Link>
            <p className="mt-0.5 truncate text-xs font-bold text-muted-foreground">
              {promotion.slug}
              {relationLabel ? ` · ${relationLabel}` : ""}
            </p>
          </div>
          <PromotionStatusBadge status={status} />
        </div>

        {promotion.description ? (
          <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-relaxed text-muted-foreground sm:text-sm">
            {promotion.description}
          </p>
        ) : null}

        <div className="mt-auto flex items-center justify-end gap-2 border-t border-border pt-2.5 sm:pt-3">
          <Link
            to={getPromotionDetailPath(promotion)}
            className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface-muted text-foreground transition hover:border-primary hover:text-primary"
            aria-label={`Editar ${promotion.title}`}
          >
            <Edit3 className="size-5" />
          </Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-error-border bg-error-soft text-error transition hover:bg-error hover:text-error-foreground"
            onClick={() => onDelete(promotion)}
            aria-label={`Eliminar ${promotion.title}`}
          >
            <Trash2 className="size-5" />
          </button>
        </div>
      </div>
    </article>
  );
}
