export type MenuImage = {
  src: string;
  alt: string;
};

export type MenuPriceOption = {
  label: string;
  price: number;
};

export type MenuAddition = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  source: "category" | "product";
  created_at: string;
};

export type MenuProductVariant = {
  name: string;
  values: string[];
};

export type MenuCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
};

export type MenuOptionValue = {
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type MenuOptionGroup = {
  name: string;
  is_required: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  option_values: MenuOptionValue[];
};

export type MenuProductVariantRow = {
  id: string;
  name: string;
  price: number;
  is_default: boolean;
  is_active: boolean;
  sort_order: number;
};

export type MenuProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number | null;
  image_path: string | null;
  is_available: boolean;
  sort_order: number;
  tags: string[] | null;
  categories: MenuCategory | null;
  product_variants: MenuProductVariantRow[];
  product_option_groups: {
    option_groups: MenuOptionGroup;
  }[];
};

export type MenuProduct = MenuProductRow & {
  urlImage?: MenuImage;
  option_groups: MenuOptionGroup[];
  variants: MenuProductVariant[];
  priceOptions: MenuPriceOption[];
  additions: MenuAddition[];
};

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

export type PublicHighlight = {
  id: string;
  title: string;
  description: string;
};

export type AboutContent = {
  eyebrow: string;
  title: string;
  intro: string;
  story: string[];
  ctaLabel: string;
};
