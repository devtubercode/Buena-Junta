export type MenuImage = {
  id: string;
  src: string;
  alt: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  defaultImageIds: string[];
  sortOrder: number;
};

export type ProductVariantGroup = {
  name: string;
  values: string[];
};

export type ProductPriceOption = {
  label: string;
  price: string;
};

export type MenuProduct = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: string | null;
  variants: ProductVariantGroup[];
  priceOptions?: ProductPriceOption[];
  imageIds: string[];
  tags?: string[];
  isAvailable: boolean;
};

export type Weekday =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export type MenuPromotion = {
  id: string;
  categoryIds: string[];
  activeDays: Weekday[];
  title: string;
  description?: string;
  active: boolean;
  validFrom?: string;
  validTo?: string;
};

export type ContactInfo = {
  deliveryPhones: string[];
};

export type ImportantText = {
  id: string;
  title: string;
  body?: string;
};
