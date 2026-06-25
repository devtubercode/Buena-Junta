import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AddCartItemInput,
  CartItem,
  OrderDraft,
  UpdateCartItemVariantResult,
} from "@/features/cart/types/cart.types";

type CartState = {
  items: CartItem[];
  orderDraft: OrderDraft;
  addItem: (item: AddCartItemInput) => void;
  removeItem: (lineId: string) => void;
  incrementItem: (lineId: string) => void;
  decrementItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  updateItemNote: (lineId: string, note: string) => void;
  updateItemVariant: (
    lineId: string,
    variantKey: string,
  ) => UpdateCartItemVariantResult;
  updateOrderDraft: (draft: Partial<OrderDraft>) => void;
  clearCart: () => void;
  clearCurrentOrder: () => void;
  getItemSubtotal: (lineId: string) => number;
  getTotal: () => number;
  getTotalQuantity: () => number;
};

const emptyOrderDraft: OrderDraft = {
  customerName: "",
  table: "",
  generalNotes: "",
};

function normalizeNote(note?: string) {
  return note?.trim().replace(/\s+/g, " ").toLowerCase() ?? "";
}

function normalizeAdditionKeys(additionOptions?: AddCartItemInput["additionOptions"]) {
  return [...(additionOptions ?? [])]
    .map((option) => option.key)
    .sort()
    .join("|");
}

function buildLineId(item: AddCartItemInput) {
  return [
    item.productId,
    item.variantKey ?? "base",
    normalizeNote(item.note),
    normalizeAdditionKeys(item.additionOptions),
  ].join("::");
}

function buildLineIdFromParts(
  productId: string,
  variantKey?: string,
  note?: string,
  additionOptions?: AddCartItemInput["additionOptions"],
) {
  return [
    productId,
    variantKey ?? "base",
    normalizeNote(note),
    normalizeAdditionKeys(additionOptions),
  ].join("::");
}

function sanitizeQuantity(quantity: number) {
  if (!Number.isFinite(quantity)) {
    return 1;
  }

  return Math.max(1, Math.floor(quantity));
}

function createCartItemId() {
  return `cart-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      orderDraft: emptyOrderDraft,
      addItem: (item) => {
        const quantity = sanitizeQuantity(item.quantity ?? 1);
        const lineId = buildLineId(item);

        set((state) => {
          const existingItem = state.items.find(
            (cartItem) => cartItem.lineId === lineId,
          );

          if (existingItem) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.lineId === lineId
                  ? { ...cartItem, quantity: cartItem.quantity + quantity }
                  : cartItem,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                cartItemId: createCartItemId(),
                lineId,
                productId: item.productId,
                image: item.image,
                variantKey: item.variantKey,
                baseName: item.baseName,
                displayName: item.displayName,
                name: item.name,
                unitPrice: item.unitPrice,
                quantity,
                note: item.note?.trim() || undefined,
                variantOptions: item.variantOptions,
                additionOptions: item.additionOptions,
              },
            ],
          };
        });
      },
      removeItem: (lineId) => {
        set((state) => ({
          items: state.items.filter((item) => item.lineId !== lineId),
        }));
      },
      incrementItem: (lineId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.lineId === lineId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        }));
      },
      decrementItem: (lineId) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.lineId === lineId
                ? { ...item, quantity: item.quantity - 1 }
                : item,
            )
            .filter((item) => item.quantity >= 1),
        }));
      },
      updateQuantity: (lineId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.lineId === lineId
              ? { ...item, quantity: sanitizeQuantity(quantity) }
              : item,
          ),
        }));
      },
      updateItemNote: (lineId, note) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.lineId === lineId ? { ...item, note } : item,
          ),
        }));
      },
      updateItemVariant: (lineId, variantKey) => {
        const state = get();
        const currentItem = state.items.find((item) => item.lineId === lineId);

        if (!currentItem) {
          return { status: "not-found" };
        }

        const selectedOption = currentItem.variantOptions?.find(
          (option) => option.key === variantKey,
        );

        if (!selectedOption) {
          return { status: "not-found" };
        }

        const nextLineId = buildLineIdFromParts(
          currentItem.productId,
          selectedOption.key,
          currentItem.note,
          currentItem.additionOptions,
        );
        const duplicateItem = state.items.find(
          (item) => item.lineId !== lineId && item.lineId === nextLineId,
        );

        if (duplicateItem) {
          return { status: "duplicate", duplicateItem };
        }

        set((nextState) => ({
          items: nextState.items.map((item) =>
            item.lineId === lineId
              ? {
                  ...item,
                  lineId: nextLineId,
                  variantKey: selectedOption.key,
                  name:
                    selectedOption.itemName ??
                    `${item.baseName ?? item.displayName ?? item.name} (${selectedOption.label})`,
                  unitPrice: selectedOption.unitPrice,
                }
              : item,
          ),
        }));

        return { status: "updated" };
      },
      updateOrderDraft: (draft) => {
        set((state) => ({ orderDraft: { ...state.orderDraft, ...draft } }));
      },
      clearCart: () => {
        set({ items: [] });
      },
      clearCurrentOrder: () => {
        set({ items: [], orderDraft: emptyOrderDraft });
      },
      getItemSubtotal: (lineId) => {
        const item = get().items.find((cartItem) => cartItem.lineId === lineId);
        return item ? item.unitPrice * item.quantity : 0;
      },
      getTotal: () =>
        get().items.reduce(
          (total, item) => total + item.unitPrice * item.quantity,
          0,
        ),
      getTotalQuantity: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),
    }),
    {
      name: "buenajunta-cart",
      version: 3,
      partialize: (state) => ({
        items: state.items,
        orderDraft: state.orderDraft,
      }),
      migrate: (persistedState) => {
        const state = persistedState as Partial<CartState>;

        return {
          items: [],
          orderDraft: state.orderDraft ?? emptyOrderDraft,
        } as unknown as CartState;
      },
    },
  ),
);
