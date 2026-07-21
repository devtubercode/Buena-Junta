import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AddWhatsAppOrderItemInput,
  WhatsAppOrderItem,
} from "./types/whatsapp-order.types";

type WhatsAppOrderStore = {
  items: WhatsAppOrderItem[];
  customerName: string;
  generalNotes: string;
  addItem: (input: AddWhatsAppOrderItemInput) => void;
  removeItem: (lineId: string) => void;
  incrementItem: (lineId: string) => void;
  decrementItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  updateItemNote: (lineId: string, note: string) => void;
  updateCustomerName: (name: string) => void;
  updateGeneralNotes: (notes: string) => void;
  clearOrder: () => void;
  getTotal: () => number;
  getTotalQuantity: () => number;
};

const STORAGE_KEY = "buenajunta-whatsapp-order";

const emptyState = {
  items: [],
  customerName: "",
  generalNotes: "",
};

function normalizeAdditionKeys(
  additionOptions?: AddWhatsAppOrderItemInput["additionOptions"],
) {
  return [...(additionOptions ?? [])]
    .map((option) => option.key)
    .sort()
    .join("|");
}

function normalizeSelectedOptions(
  selectedOptions?: Record<string, string>,
) {
  const entries = Object.entries(selectedOptions ?? {})
    .map(([key, value]) => [
      key.trim().toLowerCase(),
      value.trim().toLowerCase(),
    ])
    .filter(([, value]) => value.length > 0)
    .sort(([a], [b]) => String(a).localeCompare(String(b)));

  return entries.map(([key, value]) => `${key}=${value}`).join("|");
}

function buildLineId(item: AddWhatsAppOrderItemInput) {
  return [
    item.productId,
    item.variantKey ?? "base",
    normalizeAdditionKeys(item.additionOptions),
    normalizeSelectedOptions(item.selectedOptions),
  ].join("::");
}

function sanitizeQuantity(quantity: number) {
  if (!Number.isFinite(quantity)) {
    return 1;
  }

  return Math.max(1, Math.floor(quantity));
}

function removeStorage() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Store de pedido por WhatsApp.
 *
 * Mantiene el estado del pedido independiente del carrito principal, con
 * persistencia en `localStorage` bajo la clave `buenajunta-whatsapp-order`.
 *
 * La clave de cada línea (`lineId`) se normaliza a partir del producto, la
 * presentación, las opciones seleccionadas, las adiciones y la observación, de
 * modo que dos líneas idénticas se agrupan sumando cantidades.
 */
export const useWhatsAppOrderStore = create<WhatsAppOrderStore>()(
  persist(
    (set, get) => ({
      ...emptyState,
      addItem: (input) => {
        const quantity = sanitizeQuantity(input.quantity);
        const lineId = buildLineId(input);

        set((state) => {
          const existingItem = state.items.find((item) => item.lineId === lineId);

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.lineId === lineId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                lineId,
                productId: input.productId,
                baseName: input.baseName,
                displayName: input.displayName,
                name: input.name,
                unitPrice: input.unitPrice,
                quantity,
                image: input.image,
                variantKey: input.variantKey,
                selectedOptions: input.selectedOptions,
                additionOptions: input.additionOptions,
                note: input.note?.trim() || undefined,
                isGlobalAddition: input.isGlobalAddition,
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
            item.lineId === lineId
              ? { ...item, note: note?.trim() ? note : undefined }
              : item,
          ),
        }));
      },
      updateCustomerName: (name) => {
        set({ customerName: name });
      },
      updateGeneralNotes: (notes) => {
        set({ generalNotes: notes });
      },
      clearOrder: () => {
        set({ ...emptyState });
        removeStorage();
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
      name: STORAGE_KEY,
      version: 1,
      partialize: (state) => ({
        items: state.items,
        customerName: state.customerName,
        generalNotes: state.generalNotes,
      }),
    },
  ),
);
