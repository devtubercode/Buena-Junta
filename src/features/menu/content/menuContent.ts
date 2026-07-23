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
  shortLabel: "Buena Junta",
  address: "Av. 5 Oe. #19A-36, Terron Colorado, Cali, Valle del Cauca, Colombia",
  reference: "",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d19332.08247766391!2d-76.55972!3d3.453009!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a59410708505%3A0x438fd207e2fc2a74!2sBuena%20Junta!5e1!3m2!1ses!2sus!4v1784804175065!5m2!1ses!2sus",
  mapsUrl:
    "https://www.google.com/maps/place/Buena+Junta/@3.4530086,-76.5622951,1110m/data=!3m2!1e3!4b1!4m6!3m5!1s0x8e30a59410708505:0x438fd207e2fc2a74!8m2!3d3.4530086!4d-76.5597202!16s%2Fg%2F11z9bw06r0?hl=es&entry=ttu&g_ep=EgoyMDI2MDcyMC4wIKXMDSoASAFQAw%3D%3D",
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
