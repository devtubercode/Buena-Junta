import { Link, NavLink } from "react-router";
import { ClipboardList } from "lucide-react";
import { appRoutes } from "@/app/routes";
import logoImage from "@/assets/brand/buenajunta-logo.png";
import { CartButton } from "@/shared/components/CartButton";
import { ThemeSwitch } from "@/shared/components/ThemeSwitch";
import { cn } from "@/shared/utils/cn";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
      <nav
        className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"
        aria-label="Navegación principal"
      >
        <Link
          to={appRoutes.home}
          className="flex items-center text-foreground"
          aria-label="Ir al inicio"
        >
          <img
            src={logoImage}
            alt=""
            className="size-12 object-contain"
            aria-hidden="true"
          />
        </Link>

        <div className="flex items-center gap-2">
          <ThemeSwitch />
          <NavLink
            to={appRoutes.menu}
            className={({ isActive }) =>
              cn(
                "hidden min-h-11 items-center justify-center rounded-full px-4 text-sm font-bold shadow-elevated transition focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary sm:inline-flex sm:px-5",
                isActive
                  ? "bg-primary-soft text-primary"
                  : "bg-primary text-primary-foreground hover:opacity-90",
              )
            }
          >
            <ClipboardList className="mr-2 size-5" />
            Ver menú
          </NavLink>
          <CartButton />
        </div>
      </nav>
    </header>
  );
}
