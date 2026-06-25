import { Link } from "react-router";
import { MapPin, MessageCircleMore, UtensilsCrossed } from "lucide-react";
import { appRoutes } from "@/app/routes";
import {
  aboutContent,
  aboutHighlights,
  contactInfo,
  publicLocation,
  publicServices,
} from "@/features/menu/content/menuContent";

export function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <section className="grid gap-6 border-b border-border pb-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">
            {aboutContent.eyebrow}
          </p>
          <h1 className="mt-3 max-w-3xl font-heading text-4xl font-black leading-none text-foreground sm:text-5xl">
            {aboutContent.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            {aboutContent.intro}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={appRoutes.menu}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <UtensilsCrossed className="mr-2 size-4" />
              {aboutContent.ctaLabel}
            </Link>
            <a
              href={publicLocation.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-surface px-6 text-sm font-black text-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <MapPin className="mr-2 size-4" />
              Ver ubicación
            </a>
          </div>
        </div>

        <div className="grid gap-4 rounded-lg border border-border bg-surface p-5 shadow-elevated sm:p-6">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-primary">
              BuenaJunta
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              {aboutContent.story[0]}
            </p>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              {aboutContent.story[1]}
            </p>
          </div>
          <div className="grid gap-3 rounded-lg border border-primary-border bg-primary-soft p-4">
            <p className="font-black text-foreground">Escríbenos directo</p>
            <p className="text-sm leading-6 text-muted-foreground">
              WhatsApp {contactInfo.primaryPhone}
              <br />
              Domicilios {contactInfo.deliveryPhones.join(" - ")}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {aboutHighlights.map((highlight) => (
          <article
            key={highlight.id}
            className="rounded-lg border border-border bg-surface p-5 shadow-elevated"
          >
            <p className="text-lg font-black text-foreground">{highlight.title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {highlight.description}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[1fr_0.95fr]">
        <article className="rounded-lg border border-border bg-surface p-6 shadow-elevated">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-primary">
            Qué encuentras aquí
          </p>
          <div className="mt-4 grid gap-4">
            {publicServices.map((service) => (
              <div
                key={service.id}
                className="rounded-lg border border-border bg-surface-raised p-4"
              >
                <p className="font-black text-foreground">{service.title}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-border bg-surface p-6 shadow-elevated">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-primary">
            Visítanos o pide
          </p>
          <h2 className="mt-3 text-3xl leading-none text-foreground">
            Estamos listos para recibirte.
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-6 text-muted-foreground">
            <p>{publicLocation.address}</p>
            <p>{publicLocation.reference}</p>
            <div className="rounded-lg border border-primary-border bg-primary-soft p-4">
              <p className="font-black text-foreground">¿Ya nos visitaste?</p>
              <p className="mt-1">
                Déjanos una reseña en Google Maps o escríbenos por WhatsApp para
                tu próximo pedido.
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={publicLocation.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-5 text-sm font-black text-primary-foreground shadow-elevated transition hover:opacity-90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <MapPin className="mr-2 size-4" />
              Abrir Google Maps
            </a>
            <a
              href={`https://wa.me/${contactInfo.primaryPhone.replace(/\s+/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-surface px-5 text-sm font-black text-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <MessageCircleMore className="mr-2 size-4" />
              Pedir por WhatsApp
            </a>
          </div>
        </article>
      </section>
    </main>
  );
}
