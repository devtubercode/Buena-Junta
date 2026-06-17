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

export type WeekdayRule = {
  weekday: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  label: string;
};

export type MenuPromotion = {
  id: string;
  categoryIds: string[];
  weekdayRules: WeekdayRule[];
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
