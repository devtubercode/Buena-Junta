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
import type { MenuCategory } from "@/features/menu/types";
import { HotDogIcon } from "@/shared/icons";
import type { IconProps } from "@/shared/icons/types";

type CategoryChipsProps = {
  categories: MenuCategory[];
  activeCategoryId: string | null;
  onChange: (categoryId: string | null) => void;
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

export function CategoryChips({
  categories,
  activeCategoryId,
  onChange,
  includeAll = true,
}: CategoryChipsProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-1 gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
        {includeAll ? (
          <button
            type="button"
            data-active={activeCategoryId === null}
            className="inline-flex min-h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-sm font-black leading-none transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary data-[active=true]:border-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=false]:border-border data-[active=false]:bg-surface data-[active=false]:text-muted-foreground"
            onClick={() => onChange(null)}
          >
            <ClipboardList className="size-4" />
            Todo
          </button>
        ) : null}

        {categories.map((category) => {
          const Icon = categoryIcons[category.id] ?? ClipboardList;

          return (
            <button
              key={category.id}
              type="button"
              data-active={activeCategoryId === category.id}
              className="inline-flex min-h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-sm font-black leading-none transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary data-[active=true]:border-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=false]:border-border data-[active=false]:bg-surface data-[active=false]:text-muted-foreground"
              onClick={() => onChange(category.id)}
            >
              <Icon className="size-4" />
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
