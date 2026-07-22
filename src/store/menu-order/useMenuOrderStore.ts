import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AddMenuOrderAdditionInput,
  AddMenuOrderItemInput,
  MenuOrderAddition,
  MenuOrderItem,
} from "./types/menu-order.types";

type MenuOrderStore = {
  items: MenuOrderItem[];
  additions: MenuOrderAddition[];
  customerName: string;
  generalObservation: string;
  addItem: (input: AddMenuOrderItemInput) => void;
  addAddition: (input: AddMenuOrderAdditionInput) => void;
  removeItem: (lineId: string) => void;
  removeAddition: (lineId: string) => void;
  incrementItem: (lineId: string) => void;
  incrementAddition: (lineId: string) => void;
  decrementItem: (lineId: string) => void;
  decrementAddition: (lineId: string) => void;
  updateItemQuantity: (lineId: string, quantity: number) => void;
  updateAdditionQuantity: (lineId: string, quantity: number) => void;
  updateCustomerName: (name: string) => void;
  updateGeneralObservation: (observation: string) => void;
  clearOrder: () => void;
  getTotal: () => number;
  getTotalQuantity: () => number;
};

const STORAGE_KEY = "buenajunta-menu-order";

const emptyState = {
  items: [],
  additions: [],
  customerName: "",
  generalObservation: "",
};

function normalizeAdditionKeys(
  additionOptions?: AddMenuOrderItemInput["additionOptions"],
) {
  return [...(additionOptions ?? [])]
    .map((option) => option.key)
    .sort()
    .join("|");
}

function normalizeSelectedOptions(selectedOptions?: Record<string, string>) {
  const entries = Object.entries(selectedOptions ?? {})
    .map(([key, value]) => [
      key.trim().toLowerCase(),
      value.trim().toLowerCase(),
    ])
    .filter(([, value]) => value.length > 0)
    .sort(([a], [b]) => String(a).localeCompare(String(b)));

  return entries.map(([key, value]) => `${key}=${value}`).join("|");
}

function buildItemLineId(item: AddMenuOrderItemInput) {
  return [
    item.id,
    item.variantKey ?? "base",
    normalizeAdditionKeys(item.additionOptions),
    normalizeSelectedOptions(item.selectedOptions),
  ].join("::");
}

function buildAdditionLineId(addition: AddMenuOrderAdditionInput) {
  return addition.id;
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

function addOrUpdateLine<T extends { lineId: string; quantity: number }>(
  lines: T[],
  lineId: string,
  newLine: T,
  quantity: number,
): T[] {
  const existingLine = lines.find((line) => line.lineId === lineId);

  if (existingLine) {
    return lines.map((line) =>
      line.lineId === lineId
        ? { ...line, quantity: line.quantity + quantity }
        : line,
    );
  }

  return [...lines, newLine];
}

function removeLine<T extends { lineId: string }>(
  lines: T[],
  lineId: string,
): T[] {
  return lines.filter((line) => line.lineId !== lineId);
}

function incrementLine<T extends { lineId: string; quantity: number }>(
  lines: T[],
  lineId: string,
): T[] {
  return lines.map((line) =>
    line.lineId === lineId ? { ...line, quantity: line.quantity + 1 } : line,
  );
}

function decrementLine<T extends { lineId: string; quantity: number }>(
  lines: T[],
  lineId: string,
): T[] {
  return lines
    .map((line) =>
      line.lineId === lineId ? { ...line, quantity: line.quantity - 1 } : line,
    )
    .filter((line) => line.quantity >= 1);
}

function updateLineQuantity<T extends { lineId: string; quantity: number }>(
  lines: T[],
  lineId: string,
  quantity: number,
): T[] {
  return lines.map((line) =>
    line.lineId === lineId
      ? { ...line, quantity: sanitizeQuantity(quantity) }
      : line,
  );
}

/**
 * Store del pedido desde el menú.
 *
 * Mantiene el estado del pedido independiente del carrito principal, con
 * persistencia en `localStorage` bajo la clave `buenajunta-menu-order`.
 *
 * Separa productos (`items`) de adiciones globales (`additions`) para mantener
 * responsabilidades claras.
 */
export const useMenuOrderStore = create<MenuOrderStore>()(
  persist(
    (set, get) => ({
      ...emptyState,
      addItem: (input) => {
        const quantity = sanitizeQuantity(input.quantity);
        const lineId = buildItemLineId(input);

        set((state) => ({
          items: addOrUpdateLine(
            state.items,
            lineId,
            {
              lineId,
              id: input.id,
              name: input.name,
              price: input.price,
              quantity,
              urlImage: input.urlImage,
              variantKey: input.variantKey,
              selectedOptions: input.selectedOptions,
              additionOptions: input.additionOptions,
            },
            quantity,
          ),
        }));
      },
      addAddition: (input) => {
        const quantity = sanitizeQuantity(input.quantity);
        const lineId = buildAdditionLineId(input);

        set((state) => ({
          additions: addOrUpdateLine(
            state.additions,
            lineId,
            {
              lineId,
              id: input.id,
              name: input.name,
              price: input.price,
              quantity,
            },
            quantity,
          ),
        }));
      },
      removeItem: (lineId) => {
        set((state) => ({ items: removeLine(state.items, lineId) }));
      },
      removeAddition: (lineId) => {
        set((state) => ({ additions: removeLine(state.additions, lineId) }));
      },
      incrementItem: (lineId) => {
        set((state) => ({ items: incrementLine(state.items, lineId) }));
      },
      incrementAddition: (lineId) => {
        set((state) => ({ additions: incrementLine(state.additions, lineId) }));
      },
      decrementItem: (lineId) => {
        set((state) => ({ items: decrementLine(state.items, lineId) }));
      },
      decrementAddition: (lineId) => {
        set((state) => ({ additions: decrementLine(state.additions, lineId) }));
      },
      updateItemQuantity: (lineId, quantity) => {
        set((state) => ({
          items: updateLineQuantity(state.items, lineId, quantity),
        }));
      },
      updateAdditionQuantity: (lineId, quantity) => {
        set((state) => ({
          additions: updateLineQuantity(state.additions, lineId, quantity),
        }));
      },
      updateCustomerName: (name) => {
        set({ customerName: name });
      },
      updateGeneralObservation: (observation) => {
        set({ generalObservation: observation });
      },
      clearOrder: () => {
        set({ ...emptyState });
        removeStorage();
      },
      getTotal: () => {
        const state = get();
        const itemsTotal = state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
        const additionsTotal = state.additions.reduce(
          (total, addition) => total + addition.price * addition.quantity,
          0,
        );
        return itemsTotal + additionsTotal;
      },
      getTotalQuantity: () => {
        const state = get();
        const itemsQuantity = state.items.reduce(
          (total, item) => total + item.quantity,
          0,
        );
        const additionsQuantity = state.additions.reduce(
          (total, addition) => total + addition.quantity,
          0,
        );
        return itemsQuantity + additionsQuantity;
      },
    }),
    {
      name: STORAGE_KEY,
      version: 2,
      partialize: (state) => ({
        items: state.items,
        additions: state.additions,
        customerName: state.customerName,
        generalObservation: state.generalObservation,
      }),
    },
  ),
);
