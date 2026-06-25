import { Outlet } from "react-router";
import { SiteHeader } from "@/shared/components/SiteHeader";
import { BottomNavigation } from "@/shared/components/BottomNavigation";
import { PublicFooter } from "@/shared/components/PublicFooter";

export function AppLayout() {
  return (
    <div className="min-h-svh bg-background pb-20 text-foreground sm:pb-0">
      <SiteHeader />
      <Outlet />
      <PublicFooter />
      <BottomNavigation />
    </div>
  );
}
