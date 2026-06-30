import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { adminNavItems } from "@/features/admin/shared/navigation/adminNavigationItems";
import { AdminNavBrand } from "@/features/admin/shared/navigation/components/AdminNavBrand";
import { AdminNavItem } from "@/features/admin/shared/navigation/components/AdminNavItem";
import { AdminSignOutButton } from "@/features/admin/shared/navigation/components/AdminSignOutButton";
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
        "sticky top-0 z-30 hidden h-svh border-r border-border bg-surface/95 py-5 backdrop-blur transition-[width] duration-200 lg:grid lg:grid-rows-[auto_1fr_auto]",
        isCollapsed ? "w-20 px-3" : "w-64 px-4",
      )}
    >
      <div className="grid gap-4">
        <div
          className={cn(
            "flex items-center",
            isCollapsed ? "flex-col gap-2" : "justify-between gap-2",
          )}
        >
          <AdminNavBrand
            collapsed={isCollapsed}
            size={isCollapsed ? "sm" : "md"}
            showLabel={!isCollapsed}
          />
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={
              isCollapsed ? "Expandir navegación" : "Reducir navegación"
            }
            title={isCollapsed ? "Expandir navegación" : "Reducir navegación"}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-muted text-muted-foreground transition hover:border-primary hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {isCollapsed ? (
              <ChevronsRight className="size-4" />
            ) : (
              <ChevronsLeft className="size-4" />
            )}
          </button>
        </div>

        {!isCollapsed && userEmail ? (
          <p className="truncate rounded-lg bg-surface-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
            {userEmail}
          </p>
        ) : null}
      </div>

      <nav
        className="mt-6 grid content-start gap-1"
        aria-label="Navegación de administración"
      >
        {adminNavItems.map((item) => (
          <AdminNavItem
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
            end={"end" in item ? item.end : false}
            layout="desktop"
            collapsed={isCollapsed}
          />
        ))}
      </nav>

      <div className="grid gap-3">
        {!isCollapsed ? (
          <p className="text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
            BuenaJunta Admin
          </p>
        ) : null}
        <AdminSignOutButton
          onSignOut={onSignOut}
          layout="desktop"
          collapsed={isCollapsed}
        />
      </div>
    </aside>
  );
}
