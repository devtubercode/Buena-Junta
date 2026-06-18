import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  ChevronLeft,
  ChevronRight,
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
import { cn } from "@/shared/utils/cn";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const element = scrollRef.current;
    if (!element) return;

    setCanScrollLeft(element.scrollLeft > 0);
    setCanScrollRight(
      element.scrollLeft < element.scrollWidth - element.clientWidth - 1,
    );
  };

  useEffect(() => {
    updateScrollState();
  }, [categories]);

  const scroll = (direction: "left" | "right") => {
    const element = scrollRef.current;
    if (!element) return;

    const scrollAmount = element.clientWidth * 0.75;
    element.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background/95 text-primary shadow-elevated backdrop-blur transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          canScrollLeft ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => scroll("left")}
        aria-label="Ver categorías anteriores"
        aria-hidden={!canScrollLeft}
      >
        <ChevronLeft className="size-4" />
      </button>

      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex flex-1 gap-2 overflow-x-auto pb-2 pt-1 scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
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

      <button
        type="button"
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background/95 text-primary shadow-elevated backdrop-blur transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          canScrollRight ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => scroll("right")}
        aria-label="Ver más categorías"
        aria-hidden={!canScrollRight}
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
