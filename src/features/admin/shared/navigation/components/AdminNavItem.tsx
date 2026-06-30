import { NavLink } from "react-router";
import { cn } from "@/shared/utils/cn";

type IconComponent = React.ComponentType<{ className?: string }>;

type AdminNavItemProps = {
  to: string;
  label: string;
  icon: IconComponent;
  end?: boolean;
  layout: "desktop" | "mobile";
  collapsed?: boolean;
};

export function AdminNavItem({
  to,
  label,
  icon: Icon,
  end,
  layout,
  collapsed = false,
}: AdminNavItemProps) {
  const isDesktop = layout === "desktop";

  return (
    <NavLink
      to={to}
      end={end}
      title={label}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center transition focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary",
          isDesktop
            ? cn(
                "min-h-11 rounded-xl border font-bold",
                collapsed ? "justify-center px-0" : "justify-start gap-3 px-3",
                isActive
                  ? "border-primary-border bg-primary text-primary-foreground shadow-sm"
                  : "border-transparent bg-transparent text-muted-foreground hover:bg-surface-muted hover:text-foreground",
              )
            : cn(
                "min-h-14 min-w-16 flex-1 flex-col justify-center gap-0.5 rounded-xl px-1 text-[11px] font-bold leading-tight",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-transparent text-muted-foreground hover:bg-surface-muted hover:text-foreground",
              ),
        )
      }
    >
      {({ isActive }) => (
        <>
          {isDesktop && isActive && !collapsed && (
            <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary-foreground" />
          )}
          {!isDesktop && isActive && (
            <span className="absolute top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary-foreground/90" />
          )}
          <Icon className="size-5 shrink-0" />
          {isDesktop && collapsed ? null : (
            <span className={cn(!isDesktop && "max-w-full truncate")}>
              {label}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}
