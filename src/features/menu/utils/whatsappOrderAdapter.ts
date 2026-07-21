import type { AddCartItemInput } from "@/features/cart/types/cart.types";
import type { AddWhatsAppOrderItemInput } from "@/store/whatsapp/types/whatsapp-order.types";

export function cartInputToWhatsAppInput(
  input: AddCartItemInput,
): AddWhatsAppOrderItemInput {
  return {
    productId: input.productId,
    image: input.image,
    variantKey: input.variantKey,
    baseName: input.baseName ?? input.name,
    displayName: input.displayName ?? input.name,
    name: input.name,
    unitPrice: input.unitPrice,
    quantity: input.quantity ?? 1,
    note: input.note,
    selectedOptions: input.selectedOptions,
    additionOptions: input.additionOptions,
  };
}
