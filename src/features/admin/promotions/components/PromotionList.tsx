import { PromotionCard } from "./PromotionCard";
import type { AdminPromotionListRow } from "@/features/admin/types/promotions.types";

type PromotionListProps = {
  promotions: AdminPromotionListRow[];
  onDelete: (promotion: AdminPromotionListRow) => void;
};

export function PromotionList({ promotions, onDelete }: PromotionListProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
      {promotions.map((promotion) => (
        <PromotionCard
          key={promotion.id}
          promotion={promotion}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
