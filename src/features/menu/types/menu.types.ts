import type { AdditionRow } from "@/features/admin/types/additions.types";

export type MenuImage = {
  src: string;
  alt: string;
};

export type MenuPriceVariant = {
  label: string;
  price: number;
};

export type MenuCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
};

// NEW: Product-specific option values
export type MenuOptionValue = {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// NEW: Product-specific option groups
export type OptionGroup = {
  id: string;
  product_id: string;
  name: string;
  is_required: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  options: MenuOptionValue[];
};

export type MenuProductVariantRow = {
  id: string;
  product_id: string;
  name: string;
  price: number;
  is_default: boolean;
  is_active: boolean;
};

export type MenuProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number | null;
  sale_price: number | null;
  image_path: string | null;
  is_available: boolean;
  tags: string[] | null;
  category: MenuCategory | null;
  variants: MenuProductVariantRow[];
  groups: OptionGroup[];
};

export type MenuProduct = Omit<MenuProductRow, "variants"> & {
  urlImage?: MenuImage;
  priceVariants: MenuPriceVariant[];
  additions: AdditionRow[];
};


