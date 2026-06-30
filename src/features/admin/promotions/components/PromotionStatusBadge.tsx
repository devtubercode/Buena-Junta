import { cn } from "@/shared/utils/cn";
import type { PromotionVisualStatus } from "@/features/admin/promotions/utils/promotionFilters";

type PromotionStatusBadgeProps = {
  status: PromotionVisualStatus;
};

const statusConfig: Record<
  PromotionVisualStatus,
  { label: string; className: string }
> = {
  active: {
    label: "Activa",
    className:
      "border-success-border bg-success-soft text-success",
  },
  scheduled: {
    label: "Programada",
    className: "border-info-border bg-info-soft text-info",
  },
  expired: {
    label: "Vencida",
    className:
      "border-warning-border bg-warning-soft text-warning",
  },
  inactive: {
    label: "Inactiva",
    className:
      "border-border bg-surface-muted text-muted-foreground",
  },
};

export function PromotionStatusBadge({ status }: PromotionStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-black uppercase tracking-wide",
        config.className,
      )}
    >
      {config.label}
    </span>
  );
}
