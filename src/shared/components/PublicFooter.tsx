import {
  contactInfo,
  publicServices,
  socialLinks,
} from "@/features/menu/content/menuContent";
import { FacebookIcon, InstagramIcon, WhatsappIcon } from "@/shared/icons";

const socialIconById = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  whatsapp: WhatsappIcon,
} as const;

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-[linear-gradient(180deg,color-mix(in_oklab,var(--surface)_94%,transparent),var(--surface-raised))]">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_1fr_1fr] lg:px-8">
        <section aria-labelledby="footer-contactos">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-primary">
            BuenaJunta
          </p>
          <h2
            id="footer-contactos"
            className="mt-2 text-3xl leading-none text-foreground"
          >
            Contactos
          </h2>
          <div className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
            <p>
              <span className="font-bold text-foreground">WhatsApp:</span>{" "}
              {contactInfo.primaryPhone}
            </p>
            <p>
              <span className="font-bold text-foreground">Domicilios:</span>{" "}
              {contactInfo.deliveryPhones.join(" - ")}
            </p>
            {contactInfo.email ? (
              <p>
                <span className="font-bold text-foreground">Correo:</span>{" "}
                {contactInfo.email}
              </p>
            ) : null}
          </div>
        </section>

        <section aria-labelledby="footer-servicios">
          <h2
            id="footer-servicios"
            className="text-2xl leading-none text-foreground"
          >
            Servicios
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            {publicServices.map((service) => (
              <div key={service.id}>
                <p className="font-bold text-foreground">{service.title}</p>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="footer-social">
          <h2
            id="footer-social"
            className="text-2xl leading-none text-foreground"
          >
            Domicilios y redes
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            También puedes escribirnos por WhatsApp o seguirnos en redes para
            novedades y promociones.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {socialLinks.map((social) => {
              const Icon =
                socialIconById[social.id as keyof typeof socialIconById];

              return (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="inline-flex size-12 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground shadow-elevated transition hover:-translate-y-0.5 hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Icon className="size-5" />
                </a>
              );
            })}
          </div>
        </section>
      </div>
    </footer>
  );
}
