import { Link } from "react-router";
import { Edit3, ImageIcon, Layers, List, Trash2 } from "lucide-react";
import { appRoutes } from "@/app/routes";
import { SUPABASE_BUCKETS } from "@/lib/supabase/constants";
import { getStorageImageUrl } from "@/shared/services/storage.service";
import { cn } from "@/shared/utils/cn";
import type { AdminProductListRow } from "@/features/admin/types/products.types";

type AdminProductCardProps = {
  product: AdminProductListRow;
  onDelete: (product: AdminProductListRow) => void;
};

type StatusBadgeProps = {
  isAvailable: boolean;
};

type InfoBadgeProps = {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  variant?: "default" | "primary";
};

const StatusBadge = ({ isAvailable }: StatusBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wide",
        isAvailable
          ? "border border-success-border bg-success-soft text-success"
          : "border border-border bg-surface-muted text-muted-foreground",
      )}
    >
      {isAvailable ? "Activo" : "Oculto"}
    </span>
  );
};

const InfoBadge = ({
  icon: Icon,
  children,
  variant = "default",
}: InfoBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-black",
        variant === "primary"
          ? "bg-primary-soft text-primary"
          : "bg-surface-muted text-muted-foreground",
      )}
    >
      <Icon className="size-3.5" />
      {children}
    </span>
  );
};

export const AdminProductCard = ({
  product,
  onDelete,
}: AdminProductCardProps) => {
  const productDetailPath = `${appRoutes.adminProducts}/${product.slug}`;

  const imageUrl = product.image_path
    ? getStorageImageUrl(product.image_path, SUPABASE_BUCKETS.PRODUCT_IMAGES)
    : null;

  const quantityGroups = product.product_option_groups?.length ?? 0;
  const quantityVariants = product.product_variants?.length ?? 0;
  const hasVariants = quantityVariants > 0;
  const hasOptionGroups = quantityGroups > 0;

  return (
    <article className="group flex min-w-0 flex-row gap-3 rounded-xl border border-border bg-surface p-3 shadow-elevated transition hover:border-primary/30 hover:shadow-lg sm:flex-col">
      <Link to={productDetailPath} className="shrink-0 sm:block">
        <div className="flex size-18 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface-muted text-muted-foreground transition group-hover:border-primary/30 sm:aspect-video sm:h-auto sm:w-full">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="size-full object-cover"
              loading="lazy"
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
              to={productDetailPath}
              className="block font-heading text-base font-black leading-tight text-foreground transition hover:text-primary sm:text-lg"
            >
              {product.name}
            </Link>
          </div>
          <StatusBadge isAvailable={product.is_available} />
        </div>

        {product.price && (
          <p className="mt-1.5 text-sm font-black text-primary">{`$${product.price.toLocaleString("es-CO")}`}</p>
        )}

        <div className="my-2 flex flex-wrap gap-1.5">
          {hasVariants ? (
            <InfoBadge icon={Layers}>
              {quantityVariants}{" "}
              {quantityVariants === 1 ? "variante" : "variantes"}
            </InfoBadge>
          ) : null}
          {hasOptionGroups ? (
            <InfoBadge icon={List} variant="primary">
              {quantityGroups} {quantityGroups === 1 ? "opción" : "opciones"}
            </InfoBadge>
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-end gap-2 border-t border-border pt-2.5 sm:pt-3">
          <Link
            to={productDetailPath}
            className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface-muted text-foreground transition hover:border-primary hover:text-primary"
            aria-label={`Editar ${product.name}`}
          >
            <Edit3 className="size-5" />
          </Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-error-border bg-error-soft text-error transition hover:bg-error hover:text-error-foreground"
            onClick={() => onDelete(product)}
            aria-label={`Eliminar ${product.name}`}
          >
            <Trash2 className="size-5" />
          </button>
        </div>
      </div>
    </article>
  );
};
