import type {
  MenuAddition,
  MenuOptionGroup,
} from "@/features/menu/types/menu.types";

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
  note?: string;
  selectedOptions?: Record<string, string>;
  variantOptions?: CartVariantOption[];
  additionOptions?: CartAdditionOption[];
  optionGroups?: MenuOptionGroup[];
  availableAdditions?: MenuAddition[];
};

export type OrderDraft = {
  customerName: string;
  table: string;
  generalNotes: string;
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
  note?: string;
  selectedOptions?: Record<string, string>;
  variantOptions?: CartVariantOption[];
  additionOptions?: CartAdditionOption[];
  optionGroups?: MenuOptionGroup[];
  availableAdditions?: MenuAddition[];
};

export type UpdateCartItemVariantResult =
  | { status: "updated" }
  | { status: "duplicate"; duplicateItem: CartItem }
  | { status: "not-found" };

export type CartValidationResult = {
  isValid: boolean;
  errors: string[];
};
