/**
 * Tipos del pedido desde el menú.
 *
 * Representan un carrito independiente para el flujo de pedidos del menú
 * digital. Es deliberadamente más simple que el carrito principal, pero
 * mantiene la información necesaria para generar el resumen del pedido.
 */

import type { MenuImage } from "@/features/menu/types/menu.types";

export type MenuOrderItem = {
  /** Identificador único de la línea, generado a partir de producto + personalizaciones. */
  lineId: string;
  /** ID del producto en el catálogo. */
  id: string;
  /** Nombre final del producto (puede incluir presentación). */
  name: string;
  /** Precio unitario con adiciones incluidas. */
  price: number;
  /** Cantidad solicitada. */
  quantity: number;
  /** Imagen del producto. */
  urlImage?: MenuImage;
  /** Presentación / variante seleccionada. */
  variantKey?: string;
  /** Opciones requeridas seleccionadas (grupo -> valor). */
  selectedOptions?: Record<string, string>;
  /** Adiciones seleccionadas. */
  additionOptions?: Array<{ key: string; label: string; unitPrice: number }>;
};

export type AddMenuOrderItemInput = Omit<MenuOrderItem, "lineId">;

export type MenuOrderTopping = {
  /** ID del topping en el catálogo. */
  id: string;
  /** Nombre del topping. */
  name: string;
  /** Precio unitario. */
  price: number;
  /** Cantidad solicitada. */
  quantity: number;
};


export type MenuOrderState = {
  /** Productos del pedido. */
  items: MenuOrderItem[];
  /** Toppings globales del pedido. */
  toppings: MenuOrderTopping[];
  /** Nombre del cliente que realiza el pedido. */
  customerName: string;
  /** Observaciones generales del pedido. */
  generalObservation: string;
};
