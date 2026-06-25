export type ContactInfo = {
  primaryPhone: string;
  deliveryPhones: string[];
  email?: string;
};

export type PublicLocation = {
  shortLabel: string;
  address: string;
  reference: string;
  mapEmbedUrl: string;
  mapsUrl: string;
};

export type PublicService = {
  id: string;
  title: string;
  description: string;
};

export type SocialLink = {
  id: string;
  label: string;
  href: string;
};
