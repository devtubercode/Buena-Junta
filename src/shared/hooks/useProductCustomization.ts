import { useMemo, useState } from "react";
import type { AdditionRow } from "@/features/admin/types/additions.types";
import type { CartItem } from "@/features/cart/types/cart.types";
import type {
  OptionGroup,
  MenuPriceVariant,
  MenuProduct,
} from "@/features/menu/types/menu.types";
import { buildCartProductName } from "@/features/menu/utils/productCopy";

function filterMatchingAdditions(
  productAdditions: AdditionRow[],
  itemAdditions?: { key: string }[],
): AdditionRow[] {
  if (!itemAdditions?.length) return [];

  return productAdditions.filter((productAddition) =>
    itemAdditions.some(
      (itemAddition) => itemAddition.key === productAddition.id,
    ),
  );
}

export type ProductCustomizationConfig = {
  selectedVariant: MenuPriceVariant | null;
  selectedOptions: Record<string, string>;
  selectedAdditions: AdditionRow[];
  quantity: number;
  note: string;
};

function getInitialVariant(
  product: MenuProduct,
  initialConfig?: Partial<ProductCustomizationConfig>,
): MenuPriceVariant | null {
  if (initialConfig?.selectedVariant) {
    const match = product.priceVariants.find(
      (option) => option.label === initialConfig.selectedVariant?.label,
    );
    if (match) return match;
  }

  return product.priceVariants[0] ?? null;
}

function getInitialOptions(
  optionGroups: OptionGroup[],
  initialConfig?: Partial<ProductCustomizationConfig>,
): Record<string, string> {
  const requiredGroups = optionGroups.filter(
    (group) => group.is_active && group.is_required,
  );

  return requiredGroups.reduce(
    (acc, group) => {
      const existingValue = initialConfig?.selectedOptions?.[group.name];
      const validValue = existingValue
        ? group.options.find((option) => option.name === existingValue)?.name
        : undefined;

      if (validValue) {
        acc[group.name] = validValue;
      }

      return acc;
    },
    {} as Record<string, string>,
  );
}

function getInitialAdditions(
  product: MenuProduct,
  initialConfig?: Partial<ProductCustomizationConfig>,
): AdditionRow[] {
  if (!initialConfig?.selectedAdditions?.length) return [];

  return initialConfig.selectedAdditions.filter((selectedAddition) =>
    product.additions.some(
      (productAddition) => productAddition.id === selectedAddition.id,
    ),
  );
}

export function useProductCustomization(
  product: MenuProduct,
  initialCartItem?: CartItem,
) {
  const initialConfig: Partial<ProductCustomizationConfig> | undefined =
    initialCartItem
      ? {
          selectedVariant:
            product.priceVariants.find(
              (option) => option.label === initialCartItem.variantKey,
            ) ?? null,
          selectedOptions: initialCartItem.selectedOptions ?? {},
          selectedAdditions: filterMatchingAdditions(
            initialCartItem.availableAdditions ?? product.additions,
            initialCartItem.additionOptions,
          ),
          quantity: initialCartItem.quantity,
          note: initialCartItem.note ?? "",
        }
      : undefined;

  const optionGroupsSource = initialCartItem?.optionGroups ?? product.groups;
  const additionsSource =
    initialCartItem?.availableAdditions ?? product.additions;

  const [selectedVariant, setSelectedVariant] =
    useState<MenuPriceVariant | null>(() =>
      getInitialVariant(product, initialConfig),
    );
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => getInitialOptions(optionGroupsSource, initialConfig));
  const [selectedAdditions, setSelectedAdditions] = useState<AdditionRow[]>(
    () => getInitialAdditions(product, initialConfig),
  );
  const [quantity, setQuantity] = useState(() =>
    Math.max(1, initialConfig?.quantity ?? 1),
  );
  const [note, setNote] = useState(() => initialConfig?.note ?? "");

  const basePrice = useMemo(() => {
    if (product.priceVariants.length > 0) {
      return selectedVariant?.price ?? null;
    }

    return product.price;
  }, [product, selectedVariant]);

  const activeOptionGroups = useMemo(
    () => optionGroupsSource,
    [optionGroupsSource],
  );

  const availableAdditions = useMemo(() => additionsSource, [additionsSource]);

  const additionsTotal = useMemo(
    () =>
      selectedAdditions.reduce((total, addition) => total + addition.price, 0),
    [selectedAdditions],
  );

  const unitPrice = useMemo(() => {
    if (basePrice === null) return null;
    return basePrice + additionsTotal;
  }, [basePrice, additionsTotal]);

  const totalPrice = useMemo(() => {
    if (unitPrice === null) return null;
    return unitPrice * quantity;
  }, [unitPrice, quantity]);

  const requiredGroups = useMemo(
    () =>
      activeOptionGroups.filter(
        (group) => group.is_active && group.is_required,
      ),
    [activeOptionGroups],
  );

  const missingSelections = useMemo(() => {
    if (product.priceVariants.length > 0 && !selectedVariant) {
      return "Selecciona una presentación";
    }

    const firstMissingGroup = requiredGroups.find(
      (group) => !selectedOptions[group.name],
    );

    if (firstMissingGroup) {
      return `Selecciona ${firstMissingGroup.name.toLocaleLowerCase("es-CO")}`;
    }

    return null;
  }, [product, selectedVariant, requiredGroups, selectedOptions]);

  const isValid = missingSelections === null;

  const handleSelectVariant = (variant: MenuPriceVariant) => {
    setSelectedVariant(variant);
  };

  const handleSelectOption = (groupName: string, optionName: string) => {
    setSelectedOptions((current) => ({
      ...current,
      [groupName]: optionName,
    }));
  };

  const handleToggleAddition = (addition: AdditionRow) => {
    setSelectedAdditions((current) => {
      const exists = current.some((item) => item.id === addition.id);

      if (exists) {
        return current.filter((item) => item.id !== addition.id);
      }

      return [...current, addition];
    });
  };

  const handleSetQuantity = (nextQuantity: number) => {
    setQuantity(Math.max(1, Math.floor(nextQuantity || 1)));
  };

  const handleIncrement = () => setQuantity((current) => current + 1);
  const handleDecrement = () =>
    setQuantity((current) => Math.max(1, current - 1));

  const buildVariantLabel = () => {
    const parts: string[] = [];

    if (selectedVariant) {
      parts.push(selectedVariant.label);
    }

    return parts.join(" / ") || undefined;
  };

  const buildCartInput = () => {
    if (unitPrice === null || !isValid) return null;

    const variantLabel = buildVariantLabel();
    const displayName = buildCartProductName(product, variantLabel);

    return {
      productId: product.id,
      image: product.urlImage,
      variantKey: variantLabel,
      baseName: product.name,
      displayName,
      name: displayName,
      unitPrice,
      quantity,
      note: note.trim() || undefined,
      selectedOptions,
      variantOptions: product.priceVariants.map((option) => ({
        key: option.label,
        label: option.label,
        itemName: buildCartProductName(product, option.label),
        unitPrice: option.price,
      })),
      additionOptions: selectedAdditions.map((selectedAddition) => ({
        key: selectedAddition.id,
        label: selectedAddition.name,
        unitPrice: selectedAddition.price,
      })),
      optionGroups: activeOptionGroups,
      availableAdditions,
    };
  };

  return {
    selectedVariant,
    selectedOptions,
    selectedAdditions,
    quantity,
    note,
    basePrice,
    additionsTotal,
    unitPrice,
    totalPrice,
    isValid,
    missingSelections,
    activeOptionGroups,
    availableAdditions,
    handleSelectVariant,
    handleSelectOption,
    handleToggleAddition,
    handleSetQuantity,
    handleIncrement,
    handleDecrement,
    setNote,
    buildCartInput,
  };
}
