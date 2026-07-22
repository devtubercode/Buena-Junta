import type { ProductCustomizationOutput } from "@/shared/components/product/types";
import type {
  AddCartItemInput,
  CartItem,
} from "@/features/cart/types/cart.types";
import type { MenuProduct } from "@/features/menu/types/menu.types";
import { buildCartProductName } from "@/features/menu/utils/productCopy";

export function cartItemToProductCustomizationInitialSelection(
  item: CartItem,
): Partial<ProductCustomizationOutput> {
  return {
    id: item.productId,
    urlImage: item.image,
    name: item.name,
    price: item.unitPrice,
    quantity: item.quantity,
    variantKey: item.variantKey,
    selectedOptions: item.selectedOptions,
    additionOptions: item.additionOptions,
  };
}

function isCartItem(source: MenuProduct | CartItem): source is CartItem {
  return "lineId" in source;
}

export function customizationOutputToAddCartItemInput(
  output: ProductCustomizationOutput,
  productSource: MenuProduct | CartItem,
): AddCartItemInput {
  const variantOptions = isCartItem(productSource)
    ? productSource.variantOptions
    : productSource.priceVariants.map((variant) => ({
        key: variant.label,
        label: variant.label,
        itemName: buildCartProductName(productSource, variant.label),
        unitPrice: variant.price,
      }));

  const optionGroups = isCartItem(productSource)
    ? productSource.optionGroups
    : productSource.groups;

  const availableAdditions = isCartItem(productSource)
    ? productSource.availableAdditions
    : productSource.additions;

  return {
    productId: output.id,
    image: output.urlImage,
    baseName: productSource.name,
    displayName: output.name,
    name: output.name,
    unitPrice: output.price,
    quantity: output.quantity,
    variantKey: output.variantKey,
    selectedOptions: output.selectedOptions,
    additionOptions: output.additionOptions,
    variantOptions,
    optionGroups,
    availableAdditions,
  };
}
