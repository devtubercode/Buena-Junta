import { useState } from "react";
import { Outlet } from "react-router";
import { AdminDesktopNavigation } from "@/features/admin/components/AdminDesktopNavigation";
import { AdminMobileNavigation } from "@/features/admin/components/AdminMobileNavigation";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function AdminLayout() {
  const { signOut, user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-svh overflow-x-clip bg-background pb-24 text-foreground lg:pb-0">
      <AdminMobileNavigation onSignOut={() => void signOut()} />

      <div className="min-w-0 lg:grid lg:min-h-svh lg:grid-cols-[auto_minmax(0,1fr)]">
        <AdminDesktopNavigation
          isCollapsed={isSidebarCollapsed}
          onToggleCollapsed={() =>
            setIsSidebarCollapsed((currentValue) => !currentValue)
          }
          onSignOut={() => void signOut()}
          userEmail={user?.email}
        />

        <main className="min-w-0 max-w-full overflow-x-hidden px-4 py-5 sm:px-6 lg:px-6 lg:py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
