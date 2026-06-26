import { Link, NavLink } from "react-router";
import { LogOut } from "lucide-react";
import { appRoutes } from "@/app/routes";
import logoImage from "@/assets/buenajunta-logo.webp";
import { adminNavItems } from "@/features/admin/shared/navigation/adminNavigationItems";
import { cn } from "@/shared/utils/cn";

type AdminMobileNavigationProps = {
  onSignOut: () => void;
};

export function AdminMobileNavigation({
  onSignOut,
}: AdminMobileNavigationProps) {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-surface/95 px-4 py-3 shadow-elevated backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <Link
            to={appRoutes.admin}
            className="inline-flex items-center text-foreground"
            aria-label="Ir al resumen admin"
          >
            <img
              src={logoImage}
              alt=""
              className="size-12 object-contain"
              aria-hidden="true"
            />
          </Link>
          <button
            type="button"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface-muted text-foreground transition hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={onSignOut}
            aria-label="Cerrar sesión"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </header>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-2 py-2 shadow-elevated backdrop-blur lg:hidden"
        aria-label="Navegación de administración"
      >
        <div className="mx-auto flex max-w-2xl gap-1 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
          {adminNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={"end" in item ? item.end : false}
                className={({ isActive }) =>
                  cn(
                    "inline-flex min-h-14 min-w-20 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 text-[10px] font-black leading-tight transition focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface text-muted-foreground hover:text-primary",
                  )
                }
              >
                <Icon className="size-5 shrink-0" />
                <span className="max-w-full truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
}
