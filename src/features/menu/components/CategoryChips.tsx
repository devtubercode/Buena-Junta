import type { ComponentType } from "react";
import type { MenuCategory } from "@/features/menu/types";
import {
  ArepaIcon,
  BurgerIcon,
  CoffeeIcon,
  DrinkIcon,
  HotDogIcon,
  MenuBoardIcon,
  PizzaIcon,
  SandwichIcon,
  SnackIcon,
} from "@/shared/icons";
import type { IconProps } from "@/shared/icons/types";

type CategoryChipsProps = {
  categories: MenuCategory[];
  activeCategoryId: string | null;
  onChange: (categoryId: string | null) => void;
  includeAll?: boolean;
};

const categoryIcons: Record<string, ComponentType<IconProps>> = {
  hamburguesas: BurgerIcon,
  perros: HotDogIcon,
  bebidas: DrinkIcon,
  arepas: ArepaIcon,
  choriperro: HotDogIcon,
  entradas: SnackIcon,
  pizzas: PizzaIcon,
  sandwich: SandwichIcon,
  "bebidas-calientes": CoffeeIcon,
};

export function CategoryChips({
  categories,
  activeCategoryId,
  onChange,
  includeAll = true,
}: CategoryChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none [&::-webkit-scrollbar]:hidden">
      {includeAll ? (
        <button
          type="button"
          className="inline-flex min-h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-sm font-black leading-none transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary data-[active=true]:border-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=false]:border-border data-[active=false]:bg-surface data-[active=false]:text-muted-foreground"
          data-active={activeCategoryId === null}
          onClick={() => onChange(null)}
        >
          <MenuBoardIcon className="size-4" />
          Todo
        </button>
      ) : null}

      {categories.map((category) => {
        const Icon = categoryIcons[category.id] ?? MenuBoardIcon;

        return (
          <button
            key={category.id}
            type="button"
            className="inline-flex min-h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 text-sm font-black leading-none transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary data-[active=true]:border-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=false]:border-border data-[active=false]:bg-surface data-[active=false]:text-muted-foreground"
            data-active={activeCategoryId === category.id}
            onClick={() => onChange(category.id)}
          >
            <Icon className="size-4" />
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
