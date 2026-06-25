import type {
  AboutContent,
  ContactInfo,
  PublicHighlight,
  PublicLocation,
  PublicService,
  SocialLink,
} from "@/features/menu/types/menu.types";

export const contactInfo: ContactInfo = {
  primaryPhone: "317 426 3716",
  deliveryPhones: ["315 555 0198", "310 555 0142"],
};

export const publicLocation: PublicLocation = {
  shortLabel: "Ubicación",
  address: "Encuéntranos y llega fácil a BuenaJunta.",
  reference: "Abre el mapa para ver la sede, la ruta y el punto exacto.",
  mapEmbedUrl: "https://www.google.com/maps?q=BuenaJunta&z=16&output=embed",
  mapsUrl: "https://www.google.com/maps?q=BuenaJunta",
};

export const publicServices: PublicService[] = [
  {
    id: "carta",
    title: "Carta para compartir",
    description:
      "Hamburguesas, pizzas, arepas rellenas y picadas para mesa o para llevar.",
  },
  {
    id: "reservas",
    title: "Celebraciones y reservas",
    description:
      "Espacio para cumpleaños, reuniones y fechas especiales con reserva previa.",
  },
  {
    id: "futbol",
    title: "Ambiente de parche",
    description:
      "Pantalla para partidos, zona para grupos y servicio pensado para quedarse un rato.",
  },
];

export const socialLinks: SocialLink[] = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/",
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: "https://wa.me/573174263716",
  },
];

export const aboutContent: AboutContent = {
  eyebrow: "Nosotros",
  title: "BuenaJunta nació para comer rico, conversar y quedarse un rato.",
  intro:
    "Somos un lugar pensado para compartir entre amigos, familia y parches que buscan buena comida y un ambiente relajado.",
  story: [
    "En BuenaJunta mezclamos sabores de antojo con una atención cercana, para que cada visita se sienta simple, rápida y agradable.",
    "Queremos que pedir sea fácil, que la mesa se mueva rápido y que siempre tengas una excusa para volver por otra ronda.",
  ],
  ctaLabel: "Explorar el menú",
};

export const aboutHighlights: PublicHighlight[] = [
  {
    id: "parche",
    title: "Parche cómodo",
    description:
      "Un espacio para almorzar, picar, ver un partido o reunirse sin afán.",
  },
  {
    id: "sabor",
    title: "Sabor sin complicarse",
    description:
      "Carta variada con opciones para compartir, pedir rápido y repetir favorito.",
  },
  {
    id: "servicio",
    title: "Atención ágil",
    description:
      "Pensado para mesa, domicilio y pedidos claros desde el celular o WhatsApp.",
  },
];
