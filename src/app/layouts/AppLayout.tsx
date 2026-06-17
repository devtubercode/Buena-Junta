import { Outlet } from "react-router";
import { SiteHeader } from "@/features/home/components/SiteHeader";
import { BottomNavigation } from "@/shared/components/BottomNavigation";

export function AppLayout() {
  return (
    <div className="min-h-svh bg-background pb-20 text-foreground sm:pb-0">
      <SiteHeader />
      <Outlet />
      <BottomNavigation />
    </div>
  );
}
