import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Home, Info, MapPin, UtensilsCrossed } from "lucide-react";
import { appRoutes } from "@/app/routes";
import { publicLocation } from "@/features/menu/content/menuContent";
import { CustomModal } from "@/shared/components/CustomModal";
import logoImage from "@/assets/buenajunta-logo.webp";
import { CartButton } from "@/shared/components/CartButton";
import { ThemeSwitch } from "@/shared/components/ThemeSwitch";
import { cn } from "@/shared/utils/cn";

const primaryNavItems = [
  { label: "Inicio", to: appRoutes.home, end: true, Icon: Home },
  { label: "Menú", to: appRoutes.menu, end: true, Icon: UtensilsCrossed },
  { label: "Nosotros", to: appRoutes.about, end: true, Icon: Info },
] as const;

export function SiteHeader() {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-border bg-surface/90 shadow-sm backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:gap-4 lg:px-8 lg:py-3">
          {/* Brand */}
          <Link
            to={appRoutes.home}
            aria-label="Ir al inicio"
            className="group flex min-w-0 shrink-0 items-center gap-2.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <img
              src={logoImage}
              alt="Buena Junta"
              className="size-11 rounded-full border-2 border-primary-border bg-surface object-contain shadow-elevated transition-transform duration-200 group-hover:scale-105 group-active:scale-95"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center gap-1 rounded-full border border-border bg-surface-muted/50 p-1 shadow-sm backdrop-blur-sm lg:flex"
            aria-label="Navegación principal"
          >
            {primaryNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-black transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    isActive
                      ? "bg-primary-soft text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
                  )
                }
              >
                <item.Icon className="size-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {/* Location — desktop */}
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              aria-label="Ver ubicación de Buena Junta"
              className="hidden min-h-10 items-center gap-2 rounded-full border border-border bg-surface px-3 text-sm font-bold text-foreground shadow-sm transition hover:border-primary hover:bg-surface-muted hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:inline-flex"
            >
              <MapPin className="size-4 text-primary" />
              <span className="max-w-[120px] truncate">
                {publicLocation.shortLabel}
              </span>
            </button>

            {/* Location — mobile */}
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              aria-label="Ver ubicación de Buena Junta"
              className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-sm transition hover:border-primary hover:bg-surface-muted hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:hidden"
            >
              <MapPin className="size-5 text-primary" />
            </button>

            <span
              className="hidden h-6 w-px bg-border sm:block"
              aria-hidden="true"
            />

            <ThemeSwitch />
            <CartButton
              className="size-10 border border-border bg-surface shadow-sm hover:border-primary hover:bg-surface-muted"
              iconClassName="size-5"
            />
          </div>
        </div>
      </header>

      <CustomModal
        isOpen={isLocationModalOpen}
        title={publicLocation.shortLabel}
        description={publicLocation.address}
        icon={<MapPin className="size-5" />}
        contentClassName="max-w-3xl"
        onClose={() => setIsLocationModalOpen(false)}
      >
        <div className="space-y-4">
          <p>{publicLocation.reference}</p>
          <div className="overflow-hidden rounded-lg border border-border bg-surface-raised">
            <iframe
              title="Mapa de ubicación BuenaJunta"
              src={publicLocation.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="location-map-frame block h-72 w-full border-0"
            />
          </div>
          <div className="rounded-lg border border-primary-border bg-primary-soft p-4 text-sm leading-6 text-foreground">
            <p className="font-bold">¿Ya nos visitaste?</p>
            <p className="mt-1 text-muted-foreground">
              Si tu experiencia fue buena, déjanos una reseña en Google Maps.
              Nos ayuda a que más personas encuentren BuenaJunta.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-surface px-5 text-sm font-black text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={() => setIsLocationModalOpen(false)}
            >
              Cerrar
            </button>
            <a
              href={publicLocation.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Abrir mapa completo
            </a>
          </div>
        </div>
      </CustomModal>
    </>
  );
}
