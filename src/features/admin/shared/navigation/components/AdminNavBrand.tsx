import { Link } from "react-router";
import { appRoutes } from "@/app/routes";
import logoImage from "@/assets/buenajunta-logo.webp";
import { cn } from "@/shared/utils/cn";

type AdminNavBrandProps = {
  collapsed?: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
};

const logoSizes = {
  sm: "size-10",
  md: "size-12",
  lg: "size-14",
};

export function AdminNavBrand({
  collapsed = false,
  size = "md",
  showLabel = true,
}: AdminNavBrandProps) {
  return (
    <Link
      to={appRoutes.admin}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl p-1.5 text-foreground transition hover:bg-surface-muted focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary",
        collapsed && "justify-center",
      )}
      aria-label="Ir al resumen admin"
      title="BuenaJunta Admin"
    >
      <img
        src={logoImage}
        alt=""
        className={cn("shrink-0 object-contain", logoSizes[size])}
        aria-hidden="true"
      />
      {showLabel && !collapsed ? (
        <span className="font-heading text-lg font-black leading-none">
          Admin
        </span>
      ) : null}
    </Link>
  );
}
