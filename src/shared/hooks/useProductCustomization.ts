import { useMemo, useState } from "react";
import type { AdditionRow } from "@/features/admin/types/additions.types";
import type {
  MenuPriceVariant,
  MenuProduct,
} from "@/features/menu/types/menu.types";
import { buildCartProductName } from "@/features/menu/utils/productCopy";
import type { ProductCustomizationOutput } from "@/shared/components/product/types";

export function useProductCustomization(product: MenuProduct) {
  const [selectedVariant, setSelectedVariant] =
    useState<MenuPriceVariant | null>(() => product.priceVariants[0] ?? null);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => ({}));
  const [selectedAdditions, setSelectedAdditions] = useState<AdditionRow[]>(
    () => [],
  );
  const [quantity, setQuantity] = useState(() => 1);

  const basePrice = useMemo(() => {
    if (product.priceVariants.length > 0) {
      return selectedVariant?.price ?? null;
    }

    return product.sale_price ?? product.price;
  }, [product, selectedVariant]);

  const activeOptionGroups = useMemo(() => product.groups, [product.groups]);

  const availableAdditions = useMemo(
    () => product.additions,
    [product.additions],
  );

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

  const buildOutput = (): ProductCustomizationOutput | null => {
    if (unitPrice === null || !isValid) return null;

    const variantLabel = buildVariantLabel();

    return {
      id: product.id,
      urlImage: product.urlImage,
      name: buildCartProductName(product, variantLabel),
      price: unitPrice,
      quantity,
      variantKey: variantLabel,
      selectedOptions,
      additionOptions: selectedAdditions.map((selectedAddition) => ({
        key: selectedAddition.id,
        label: selectedAddition.name,
        unitPrice: selectedAddition.price,
      })),
    };
  };

  return {
    selectedVariant,
    selectedOptions,
    selectedAdditions,
    quantity,
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
    buildOutput,
  };
}
