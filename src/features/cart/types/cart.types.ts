import type { AdditionRow } from "@/features/admin/types/additions.types";
import type { OptionGroup } from "@/features/menu/types/menu.types";

export type CartVariantOption = {
  key: string;
  label: string;
  itemName?: string;
  unitPrice: number;
};

export type CartAdditionOption = {
  key: string;
  label: string;
  unitPrice: number;
};

export type CartItem = {
  cartItemId?: string;
  lineId: string;
  productId: string;
  image?: {
    src: string;
    alt: string;
  };
  variantKey?: string;
  baseName?: string;
  displayName?: string;
  name: string;
  unitPrice: number;
  quantity: number;
  selectedOptions?: Record<string, string>;
  variantOptions?: CartVariantOption[];
  additionOptions?: CartAdditionOption[];
  optionGroups?: OptionGroup[];
  availableAdditions?: AdditionRow[];
};

export type OrderDraft = {
  customerName: string;
  table: string;
  generalObservation: string;
};

export type AddCartItemInput = {
  productId: string;
  image?: {
    src: string;
    alt: string;
  };
  variantKey?: string;
  baseName?: string;
  displayName?: string;
  name: string;
  unitPrice: number;
  quantity?: number;
  selectedOptions?: Record<string, string>;
  variantOptions?: CartVariantOption[];
  additionOptions?: CartAdditionOption[];
  optionGroups?: OptionGroup[];
  availableAdditions?: AdditionRow[];
};

export type UpdateCartItemVariantResult =
  | { status: "updated" }
  | { status: "duplicate"; duplicateItem: CartItem }
  | { status: "not-found" };

export type CartValidationResult = {
  isValid: boolean;
  errors: string[];
};
