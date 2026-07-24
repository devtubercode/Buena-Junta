import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Info, MapPin } from "lucide-react";
import { appRoutes } from "@/app/routes";
import { publicLocation } from "@/features/about/content/aboutContent";
import { ButtonSheetModal } from "@/shared/components/ButtonSheetModal";
import { CustomModal } from "@/shared/components/CustomModal";
import logoImage from "@/assets/buenajunta-logo.webp";
import { CartButton } from "@/shared/components/CartButton";
// import { ThemeSwitch } from "@/shared/components/ThemeSwitch";
import { cn } from "@/shared/utils/cn";

const actionClass =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border bg-surface px-3 text-sm font-bold text-foreground shadow-sm transition hover:border-primary hover:bg-surface-muted hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

const mobileActionClass =
  "inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface text-foreground shadow-sm transition hover:border-primary hover:bg-surface-muted hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function SiteHeader() {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const locationContent = (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border bg-surface-raised shadow-sm">
        <iframe
          title="Mapa de ubicación BuenaJunta"
          src={publicLocation.mapEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-56 w-full border-0 sm:h-72"
        />
      </div>

      <a
        href={publicLocation.mapsUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <MapPin className="size-4" />
        Abrir en Google Maps
      </a>

      <div className="rounded-xl border border-border bg-surface-muted p-3 text-center">
        <p className="text-xs font-medium text-muted-foreground">
          ¿Ya nos visitaste?{" "}
          <a
            href={publicLocation.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="font-black text-primary underline transition hover:opacity-80"
          >
            Deja una reseña
          </a>
        </p>
      </div>
    </div>
  );

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

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {/* About — desktop */}
            <NavLink
              to={appRoutes.about}
              end
              className={({ isActive }) =>
                cn(
                  actionClass,
                  "hidden sm:inline-flex",
                  isActive && "bg-primary-soft text-primary",
                )
              }
            >
              <Info className="size-4" />
              Nosotros
            </NavLink>

            {/* About — mobile */}
            <NavLink
              to={appRoutes.about}
              end
              aria-label="Sobre nosotros"
              className={({ isActive }) =>
                cn(
                  mobileActionClass,
                  "sm:hidden",
                  isActive && "bg-primary-soft text-primary",
                )
              }
            >
              <Info className="size-5" />
            </NavLink>

            {/* Location — desktop */}
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              aria-label="Ver ubicación de Buena Junta"
              className={cn(actionClass, "hidden sm:inline-flex")}
            >
              <MapPin className="size-4 text-primary" />
              <span className="max-w-30 truncate">
                {publicLocation.shortLabel}
              </span>
            </button>

            {/* Location — mobile */}
            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              aria-label="Ver ubicación de Buena Junta"
              className={cn(mobileActionClass, "sm:hidden")}
            >
              <MapPin className="size-5 text-primary" />
            </button>

            <span
              className="hidden h-6 w-px bg-border sm:block"
              aria-hidden="true"
            />

            {/* <ThemeSwitch /> */}
            <CartButton
              className="size-10 border border-border bg-surface shadow-sm hover:border-primary hover:bg-surface-muted"
              iconClassName="size-5"
            />
          </div>
        </div>
      </header>

      <div className="hidden sm:block">
        <CustomModal
          isOpen={isLocationModalOpen}
          title={publicLocation.shortLabel}
          description={publicLocation.address}
          icon={<MapPin className="size-5" />}
          contentClassName="max-w-3xl"
          onClose={() => setIsLocationModalOpen(false)}
        >
          {locationContent}
        </CustomModal>
      </div>
      <div className="sm:hidden">
        <ButtonSheetModal
          isOpen={isLocationModalOpen}
          title={publicLocation.shortLabel}
          description={publicLocation.address}
          icon={<MapPin className="size-5" />}
          contentClassName="max-w-3xl"
          onClose={() => setIsLocationModalOpen(false)}
        >
          {locationContent}
        </ButtonSheetModal>
      </div>
    </>
  );
}
