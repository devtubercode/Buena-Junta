import { Link, NavLink } from "react-router";
import { ChevronsLeft, ChevronsRight, LogOut } from "lucide-react";
import { appRoutes } from "@/app/routes";
import logoImage from "@/assets/buenajunta-logo.webp";
import { adminNavItems } from "@/features/admin/shared/navigation/adminNavigationItems";
import { cn } from "@/shared/utils/cn";

type AdminDesktopNavigationProps = {
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
  onSignOut: () => void;
  userEmail?: string;
};

export function AdminDesktopNavigation({
  isCollapsed,
  onToggleCollapsed,
  onSignOut,
  userEmail,
}: AdminDesktopNavigationProps) {
  return (
    <aside
      className={cn(
        "sticky top-0 z-30 hidden h-svh border-r border-border bg-surface/95 py-4 backdrop-blur transition-[width] duration-200 lg:grid lg:grid-rows-[auto_1fr_auto]",
        isCollapsed ? "w-20 px-3" : "w-64 px-5",
      )}
    >
      <div>
        <div className="flex justify-center flex-col-reverse gap-2">
          <Link
            to={appRoutes.admin}
            className={cn(
              "inline-flex items-center justify-center justify-self-center rounded-lg p-2 text-foreground",
              isCollapsed ? "bg-surface-muted" : "bg-transparent",
            )}
            title="BuenaJunta Admin"
          >
            <img
              src={logoImage}
              alt=""
              className={cn(
                "shrink-0 object-contain",
                isCollapsed ? "size-10" : "size-14",
              )}
              aria-hidden="true"
            />
          </Link>
          <button
            type="button"
            className="inline-flex min-h-11 shrink-0 items-center justify-center justify-self-end rounded-lg border border-border bg-surface-muted text-foreground transition hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            onClick={onToggleCollapsed}
            aria-label={
              isCollapsed ? "Expandir navegación" : "Reducir navegación"
            }
          >
            {isCollapsed ? (
              <ChevronsRight className="size-4" />
            ) : (
              <ChevronsLeft className="size-4" />
            )}
          </button>
        </div>
        {!isCollapsed ? (
          <p className="mt-1 truncate text-center text-xs font-bold text-muted-foreground">
            {userEmail}
          </p>
        ) : null}
      </div>

      <nav className="mt-7 grid content-start gap-1">
        {adminNavItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={"end" in item ? item.end : false}
              title={item.label}
              className={({ isActive }) =>
                cn(
                  "inline-flex min-h-11 items-center rounded-lg border text-sm font-black transition focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary",
                  isCollapsed ? "justify-center px-0" : "gap-2 px-3",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-surface-muted hover:text-foreground",
                )
              }
            >
              <Icon className="size-4" />
              {!isCollapsed ? item.label : null}
            </NavLink>
          );
        })}
      </nav>

      <button
        type="button"
        className={cn(
          "inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-border bg-surface-muted text-sm font-black text-foreground transition hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          isCollapsed ? "px-0" : "gap-2 px-4",
        )}
        onClick={onSignOut}
        title="Cerrar sesión"
      >
        <LogOut className="size-4" />
        {!isCollapsed ? "Cerrar sesión" : null}
      </button>
    </aside>
  );
}
