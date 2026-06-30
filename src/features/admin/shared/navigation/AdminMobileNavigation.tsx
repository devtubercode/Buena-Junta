import { adminNavItems } from "@/features/admin/shared/navigation/adminNavigationItems";
import { AdminNavBrand } from "@/features/admin/shared/navigation/components/AdminNavBrand";
import { AdminNavItem } from "@/features/admin/shared/navigation/components/AdminNavItem";
import { AdminSignOutButton } from "@/features/admin/shared/navigation/components/AdminSignOutButton";

type AdminMobileNavigationProps = {
  onSignOut: () => void;
};

export function AdminMobileNavigation({
  onSignOut,
}: AdminMobileNavigationProps) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 px-4 py-2 shadow-sm backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <AdminNavBrand size="sm" showLabel />
          <AdminSignOutButton onSignOut={onSignOut} layout="mobile" />
        </div>
      </header>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-elevated backdrop-blur lg:hidden"
        aria-label="Navegación de administración"
      >
        <div className="mx-auto flex max-w-2xl gap-1 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
          {adminNavItems.map((item) => (
            <AdminNavItem
              key={item.to}
              to={item.to}
              label={item.label}
              icon={item.icon}
              end={"end" in item ? item.end : false}
              layout="mobile"
            />
          ))}
        </div>
      </nav>
    </>
  );
}
