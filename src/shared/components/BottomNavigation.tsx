import { NavLink } from "react-router";
import { ClipboardList, Home, ShoppingCart } from "lucide-react";
import { appRoutes } from "@/app/routes";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { cn } from "@/shared/utils/cn";

const navItems = [
  { label: "Inicio", to: appRoutes.home, end: true, Icon: Home },
  { label: "Menú", to: appRoutes.menu, end: true, Icon: ClipboardList },
  { label: "Carrito", to: appRoutes.cart, end: false, Icon: ShoppingCart },
];

export function BottomNavigation() {
  const totalQuantity = useCartStore((state) => state.getTotalQuantity());

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-3 py-2 shadow-elevated backdrop-blur sm:hidden"
      aria-label="Navegación inferior"
    >
      <div className="mx-auto grid max-w-md grid-cols-3 gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "relative inline-flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-lg px-2 text-xs font-black transition focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface text-muted-foreground hover:text-primary",
              )
            }
          >
            <span className="relative inline-flex">
              <item.Icon className="size-5" />
              {item.to === appRoutes.cart && totalQuantity > 0 && (
                <span
                  className={`absolute -right-6 top-0 -translate-x-1/2 -translate-y-1/2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full border border-background bg-primary px-1.5 text-[11px] font-black leading-none text-primary-foreground shadow-elevated`}
                >
                  {totalQuantity > 99 ? "99+" : totalQuantity}
                </span>
              )}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
