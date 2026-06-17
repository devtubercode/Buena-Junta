import { NavLink } from "react-router";
import { appRoutes } from "@/app/routes";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { CartBadge } from "@/shared/components/CartBadge";
import { BuenaCartIcon, HomeIcon, MenuBoardIcon } from "@/shared/icons";

const navItems = [
  { label: "Inicio", to: appRoutes.home, end: true, Icon: HomeIcon },
  { label: "Menú", to: appRoutes.menu, end: true, Icon: MenuBoardIcon },
  { label: "Carrito", to: appRoutes.cart, end: false, Icon: BuenaCartIcon },
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
              [
                "relative inline-flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-lg px-2 text-xs font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface text-muted-foreground hover:text-primary",
              ].join(" ")
            }
          >
            <span className="relative inline-flex">
              <item.Icon className="size-5" />
              {item.to === appRoutes.cart ? <CartBadge count={totalQuantity} /> : null}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
