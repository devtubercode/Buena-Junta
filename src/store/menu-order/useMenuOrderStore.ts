import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AddMenuOrderItemInput,
  MenuOrderItem,
  MenuOrderTopping,
} from "./types/menu-order.types";

type MenuOrderStore = {
  items: MenuOrderItem[];
  toppings: MenuOrderTopping[];
  customerName: string;
  generalObservation: string;
  addItem: (input: AddMenuOrderItemInput) => void;
  addTopping: (input: MenuOrderTopping) => void;
  removeItem: (lineId: string) => void;
  removeTopping: (id: string) => void;
  incrementItem: (lineId: string) => void;
  incrementTopping: (id: string) => void;
  decrementItem: (lineId: string) => void;
  decrementTopping: (id: string) => void;
  updateItemQuantity: (lineId: string, quantity: number) => void;
  updateToppingQuantity: (id: string, quantity: number) => void;
  updateCustomerName: (name: string) => void;
  updateGeneralObservation: (observation: string) => void;
  clearOrder: () => void;
  getTotal: () => number;
  getTotalQuantity: () => number;
};

const STORAGE_KEY = "buenajunta-menu-order";

const emptyState = {
  items: [],
  toppings: [],
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

function addOrUpdateItem<T extends { lineId: string; quantity: number }>(
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

function addOrUpdateTopping<T extends { id: string; quantity: number }>(
  toppings: T[],
  id: string,
  newTopping: T,
  quantity: number,
): T[] {
  const existingTopping = toppings.find((t) => t.id === id);

  if (existingTopping) {
    return toppings.map((t) =>
      t.id === id ? { ...t, quantity: t.quantity + quantity } : t,
    );
  }

  return [...toppings, newTopping];
}

function removeLineItem<T extends { lineId: string }>(
  lines: T[],
  lineId: string,
): T[] {
  return lines.filter((line) => line.lineId !== lineId);
}

function removeTopping<T extends { id: string }>(
  toppings: T[],
  id: string,
): T[] {
  return toppings.filter((t) => t.id !== id);
}

function incrementLine<T extends { lineId: string; quantity: number }>(
  lines: T[],
  lineId: string,
): T[] {
  return lines.map((line) =>
    line.lineId === lineId ? { ...line, quantity: line.quantity + 1 } : line,
  );
}

function incrementToppingById<T extends { id: string; quantity: number }>(
  toppings: T[],
  id: string,
): T[] {
  return toppings.map((t) =>
    t.id === id ? { ...t, quantity: t.quantity + 1 } : t,
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

function decrementToppingById<T extends { id: string; quantity: number }>(
  toppings: T[],
  id: string,
): T[] {
  return toppings
    .map((t) => (t.id === id ? { ...t, quantity: t.quantity - 1 } : t))
    .filter((t) => t.quantity >= 1);
}

function updateLineQuantity<T extends { lineId: string; quantity: number }>(
  lines: T[],
  lineId: string,
  quantity: number,
): T[] {
  return lines.map((line) =>
    line.lineId === lineId
      ? { ...line, quantity: Math.max(1, Math.floor(quantity)) }
      : line,
  );
}

function updateToppingQuantity<T extends { id: string; quantity: number }>(
  toppings: T[],
  id: string,
  quantity: number,
): T[] {
  return toppings.map((t) =>
    t.id === id ? { ...t, quantity: Math.max(1, Math.floor(quantity)) } : t,
  );
}

/**
 * Store del pedido desde el menú.
 *
 * Mantiene el estado del pedido independiente del carrito principal, con
 * persistencia en `localStorage` bajo la clave `buenajunta-menu-order`.
 *
 * Separa productos (`items`) de toppings globales (`toppings`) para mantener
 * responsabilidades claras.
 */
export const useMenuOrderStore = create<MenuOrderStore>()(
  persist(
    (set, get) => ({
      ...emptyState,
      addItem: (input) => {
        const quantity = Math.max(1, Math.floor(input.quantity));
        const lineId = buildItemLineId(input);

        set((state) => ({
          items: addOrUpdateItem(
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
      addTopping: (input) => {
        const quantity = Math.max(1, Math.floor(input.quantity));

        set((state) => ({
          toppings: addOrUpdateTopping(
            state.toppings,
            input.id,
            {
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
        set((state) => ({ items: removeLineItem(state.items, lineId) }));
      },
      removeTopping: (id) => {
        set((state) => ({ toppings: removeTopping(state.toppings, id) }));
      },
      incrementItem: (lineId) => {
        set((state) => ({ items: incrementLine(state.items, lineId) }));
      },
      incrementTopping: (id) => {
        set((state) => ({
          toppings: incrementToppingById(state.toppings, id),
        }));
      },
      decrementItem: (lineId) => {
        set((state) => ({ items: decrementLine(state.items, lineId) }));
      },
      decrementTopping: (id) => {
        set((state) => ({
          toppings: decrementToppingById(state.toppings, id),
        }));
      },
      updateItemQuantity: (lineId, quantity) => {
        set((state) => ({
          items: updateLineQuantity(state.items, lineId, quantity),
        }));
      },
      updateToppingQuantity: (id, quantity) => {
        set((state) => ({
          toppings: updateToppingQuantity(state.toppings, id, quantity),
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
        useMenuOrderStore.persist.clearStorage();
      },
      getTotal: () => {
        const state = get();
        const itemsTotal = state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
        const toppingsTotal = state.toppings.reduce(
          (total, topping) => total + topping.price * topping.quantity,
          0,
        );
        return itemsTotal + toppingsTotal;
      },
      getTotalQuantity: () => {
        const state = get();
        const itemsQuantity = state.items.reduce(
          (total, item) => total + item.quantity,
          0,
        );
        const toppingsQuantity = state.toppings.reduce(
          (total, topping) => total + topping.quantity,
          0,
        );
        return itemsQuantity + toppingsQuantity;
      },
    }),
    {
      name: STORAGE_KEY,
      version: 2,
      partialize: (state) => ({
        items: state.items,
        toppings: state.toppings,
        customerName: state.customerName,
        generalObservation: state.generalObservation,
      }),
    },
  ),
);
