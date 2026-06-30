import { CategoryCard } from "./CategoryCard";
import type { CategoryRow } from "@/features/admin/types/categories.types";

type CategoryListProps = {
  categories: CategoryRow[];
  onEdit: (category: CategoryRow) => void;
  onDelete: (category: CategoryRow) => void;
};

export function CategoryList({
  categories,
  onEdit,
  onDelete,
}: CategoryListProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
