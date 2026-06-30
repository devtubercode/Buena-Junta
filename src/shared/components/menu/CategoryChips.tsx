import { type ComponentType } from "react";
import {
  ClipboardList,
  Coffee,
  Cookie,
  CupSoda,
  Hamburger,
  Pizza,
  Popcorn,
  Sandwich,
} from "lucide-react";

import { HotDogIcon } from "@/shared/icons";
import type { IconProps } from "@/shared/icons/types";
import type { MenuCategory } from "@/features/menu/types/menu.types";

type CategoryChipsProps = {
  categories: MenuCategory[];
  activeCategorySlug: string | null;
  onChange: (categorySlug: string | null) => void;
  includeAll?: boolean;
};

const categoryIcons: Record<string, ComponentType<IconProps>> = {
  hamburguesas: Hamburger,
  perros: HotDogIcon,
  bebidas: CupSoda,
  arepas: Cookie,
  choriperro: HotDogIcon,
  entradas: Popcorn,
  pizzas: Pizza,
  sandwich: Sandwich,
  "bebidas-calientes": Coffee,
};

function CategoryChip({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: ComponentType<IconProps>;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      data-active={active}
      aria-pressed={active}
      onClick={onClick}
      className="group cursor-pointer inline-flex snap-start shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border font-black leading-none transition focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-95 min-h-10 px-3 text-xs sm:min-h-11 sm:px-4 sm:text-sm data-[active=true]:border-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:shadow-sm data-[active=true]:shadow-primary/25 data-[active=false]:border-border data-[active=false]:bg-surface data-[active=false]:text-muted-foreground data-[active=false]:hover:border-primary/60 data-[active=false]:hover:bg-surface-muted data-[active=false]:hover:text-foreground"
    >
      <Icon className="size-4 shrink-0 transition-transform duration-200 group-hover:scale-110 group-data-[active=true]:scale-110 sm:size-4.5" />
      {children}
    </button>
  );
}

export function CategoryChips({
  categories,
  activeCategorySlug,
  onChange,
}: CategoryChipsProps) {
  return (
    <nav aria-label="Categorías del menú" className="relative -mx-4 sm:mx-0">
      <div className="flex gap-2 overflow-x-auto px-4 pb-3 pt-1 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden snap-x snap-mandatory scroll-smooth">
        <CategoryChip
          active={activeCategorySlug === null}
          onClick={() => onChange(null)}
          icon={ClipboardList}
        >
          Todo
        </CategoryChip>

        {categories.map((category) => {
          const Icon = categoryIcons[category.slug] ?? ClipboardList;

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
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-background to-transparent sm:hidden"
        aria-hidden="true"
      />
    </nav>
  );
}
