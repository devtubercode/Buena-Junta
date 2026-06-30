import { LogOut } from "lucide-react";
import { cn } from "@/shared/utils/cn";

type AdminSignOutButtonProps = {
  onSignOut: () => void;
  layout: "desktop" | "mobile";
  collapsed?: boolean;
};

export function AdminSignOutButton({
  onSignOut,
  layout,
  collapsed = false,
}: AdminSignOutButtonProps) {
  const isDesktop = layout === "desktop";

  return (
    <button
      type="button"
      onClick={onSignOut}
      title="Cerrar sesión"
      aria-label="Cerrar sesión"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl border text-sm font-bold transition focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary",
        isDesktop
          ? cn(
              "w-full min-h-11 text-error hover:border-error-border hover:bg-error-soft hover:text-error",
              collapsed ? "px-0" : "gap-3 px-3",
            )
          : "size-10 border-border bg-surface-muted text-foreground hover:border-error hover:text-error",
      )}
    >
      <LogOut className="size-4.5 shrink-0" />
      {isDesktop && !collapsed ? "Cerrar sesión" : null}
    </button>
  );
}
