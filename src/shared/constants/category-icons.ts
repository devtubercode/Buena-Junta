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

export const categoryIcons: Record<string, ComponentType<IconProps>> = {
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

export function getCategoryIcon(
  slug: string,
): ComponentType<IconProps> {
  return categoryIcons[slug] ?? ClipboardList;
}
