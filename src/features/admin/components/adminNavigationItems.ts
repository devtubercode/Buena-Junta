import {
  CirclePlus,
  Gift,
  LayoutDashboard,
  Package,
  Tags,
} from "lucide-react";
import { appRoutes } from "@/app/routes";

export const adminNavItems = [
  { to: appRoutes.admin, label: "Resumen", icon: LayoutDashboard, end: true },
  { to: appRoutes.adminProducts, label: "Productos", icon: Package },
  { to: appRoutes.adminCategories, label: "Categorías", icon: Tags },
  { to: appRoutes.adminAdditions, label: "Adiciones", icon: CirclePlus },
  { to: appRoutes.adminPromotions, label: "Promociones", icon: Gift },
] as const;
