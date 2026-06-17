export type CartVariantOption = {
  key: string;
  label: string;
  itemName?: string;
  unitPriceCents: number;
};

export type CartItem = {
  cartItemId?: string;
  lineId: string;
  productId: string;
  variantKey?: string;
  baseName?: string;
  displayName?: string;
  name: string;
  unitPriceCents: number;
  quantity: number;
  note?: string;
  variantOptions?: CartVariantOption[];
};

export type OrderDraft = {
  customerName: string;
  table: string;
  generalNotes: string;
};

export type AddCartItemInput = {
  productId: string;
  variantKey?: string;
  baseName?: string;
  displayName?: string;
  name: string;
  unitPriceCents: number;
  quantity?: number;
  note?: string;
  variantOptions?: CartVariantOption[];
};

export type UpdateCartItemVariantResult =
  | { status: "updated" }
  | { status: "duplicate"; duplicateItem: CartItem }
  | { status: "not-found" };

export type CartValidationResult = {
  isValid: boolean;
  errors: string[];
};
