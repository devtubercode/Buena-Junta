import { type ComponentType } from "react";
import { ClipboardList } from "lucide-react";

import { CategoryChip } from "@/shared/components/menu/CategoryChip";
import { getCategoryIcon } from "@/shared/constants/category-icons";
import type { IconProps } from "@/shared/icons/types";
import type { MenuCategory } from "@/features/menu/types/menu.types";

export type ExtraChip = {
  slug: string;
  label: string;
  icon: ComponentType<IconProps>;
};

type CategoryChipsProps = {
  categories: MenuCategory[];
  activeCategorySlug: string | null;
  onChange: (categorySlug: string | null) => void;
  includeAll?: boolean;
  extraChips?: ExtraChip[];
};

export function CategoryChips({
  categories,
  activeCategorySlug,
  onChange,
  extraChips,
}: CategoryChipsProps) {
  return (
    <nav aria-label="Categorías del menú" className="relative -mx-4 sm:mx-0">
      <div className="flex gap-2 overflow-x-auto pl-4 pr-12 pb-3 pt-1 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden snap-x snap-mandatory scroll-smooth">
        <CategoryChip
          active={activeCategorySlug === null}
          onClick={() => onChange(null)}
          icon={ClipboardList}
        >
          Todo
        </CategoryChip>

        {categories.map((category) => {
          const Icon = getCategoryIcon(category.slug);

          return (
            <CategoryChip
              key={category.id}
              active={activeCategorySlug === category.slug}
              onClick={() => onChange(category.slug)}
              icon={Icon}
            >
              {category.name}
            </CategoryChip>
          );
        })}

        {extraChips?.map((chip) => (
          <CategoryChip
            key={chip.slug}
            active={activeCategorySlug === chip.slug}
            onClick={() => onChange(chip.slug)}
            icon={chip.icon}
          >
            {chip.label}
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
