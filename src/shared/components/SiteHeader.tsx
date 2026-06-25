import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Home, Info, MapPin, UtensilsCrossed } from "lucide-react";
import { appRoutes } from "@/app/routes";
import { publicLocation } from "@/features/menu/content/menuContent";
import { AppModal } from "@/shared/components/AppModal";
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
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link
              to={appRoutes.home}
              className="flex min-w-0 items-center gap-3 text-foreground"
              aria-label="Ir al inicio"
            >
              <img
                src={logoImage}
                alt="logo-buena-junta"
                className="size-11 rounded-full border border-primary-border bg-surface object-contain shadow-elevated"
              />
            </Link>
            <nav
              className="hidden items-center gap-2 lg:flex"
              aria-label="Navegación principal"
            >
              {primaryNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-black transition focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary",
                      isActive
                        ? "bg-primary-soft text-primary"
                        : "text-foreground hover:text-primary",
                    )
                  }
                >
                  <item.Icon className="mr-2 size-4" />
                  {item.label}
                </NavLink>
              ))}
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-black text-foreground transition hover:text-primary focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
                aria-label="Abrir ubicación"
                onClick={() => setIsLocationModalOpen(true)}
              >
                <MapPin className="mr-2 size-4 text-primary" />
                {publicLocation.shortLabel}
              </button>
            </nav>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex size-11 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-elevated transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:hidden"
                aria-label="Abrir ubicación"
                onClick={() => setIsLocationModalOpen(true)}
              >
                <MapPin className="size-4 text-primary" />
              </button>
              <ThemeSwitch />
              <CartButton className="border border-border bg-surface shadow-elevated" />
            </div>
          </div>
        </div>
      </header>

      <AppModal
        isOpen={isLocationModalOpen}
        title={publicLocation.shortLabel}
        description={publicLocation.address}
        icon={<MapPin className="size-5" />}
        contentClassName="max-w-3xl"
        secondaryActionLabel="Cerrar"
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
          <a
            href={publicLocation.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Abrir mapa completo
          </a>
        </div>
      </AppModal>
    </>
  );
}
