import { ClipboardList } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import type { CategoryRow } from "@/features/admin/types/categories.types";

type AdminProductCategoryFilterProps = {
  categories: CategoryRow[];
  selectedCategoryId: string | null;
  onChange: (categoryId: string | null) => void;
};

const chipBaseClass =
  "group inline-flex shrink-0 snap-start items-center gap-1.5 whitespace-nowrap rounded-full border font-black leading-none transition focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-95";

const chipSizeClass = "min-h-10 px-3 text-xs sm:min-h-11 sm:px-4 sm:text-sm";

const chipActiveClass =
  "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/25";

const chipInactiveClass =
  "border-border bg-surface text-muted-foreground hover:border-primary/60 hover:bg-surface-muted hover:text-foreground";

function CategoryChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      data-active={active}
      onClick={onClick}
      className={cn(
        chipBaseClass,
        chipSizeClass,
        active ? chipActiveClass : chipInactiveClass,
      )}
    >
      {children}
    </button>
  );
}

export function AdminProductCategoryFilter({
  categories,
  selectedCategoryId,
  onChange,
}: AdminProductCategoryFilterProps) {
  return (
    <nav
      aria-label="Filtrar productos por categoría"
      className="relative min-w-0 -mx-4 sm:mx-0"
    >
      <div className="flex min-w-0 gap-2 overflow-x-auto px-4 pb-1 pt-1 [-ms-overflow-style:none] scrollbar-none snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden">
        <CategoryChip
          active={selectedCategoryId === null}
          onClick={() => onChange(null)}
        >
          <ClipboardList className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-110 group-data-[active=true]:scale-110" />
          Todos
        </CategoryChip>

        {categories.map((category) => (
          <CategoryChip
            key={category.id}
            active={selectedCategoryId === category.id}
            onClick={() => onChange(category.id)}
          >
            {category.name}
          </CategoryChip>
        ))}
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-background to-transparent sm:hidden"
        aria-hidden="true"
      />
    </nav>
  );
}
