import { AdditionCard } from "./AdditionCard";
import type { AdditionRow } from "@/features/admin/types/additions.types";

type AdditionListProps = {
  additions: AdditionRow[];
  onEdit: (addition: AdditionRow) => void;
  onDelete: (addition: AdditionRow) => void;
};

export function AdditionList({
  additions,
  onEdit,
  onDelete,
}: AdditionListProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
      {additions.map((addition) => (
        <AdditionCard
          key={addition.id}
          addition={addition}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
