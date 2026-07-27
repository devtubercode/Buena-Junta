import type { AdditionRow } from "@/features/admin/types/additions.types";
import type {
  OptionGroup,
  MenuProduct,
  MenuProductRow,
} from "@/features/menu/types/menu.types";
import { SUPABASE_BUCKETS } from "@/lib/supabase/constants";
import { getStorageImageUrl } from "@/shared/services/storage.service";

type MapProductsArg = {
  products: MenuProductRow[];
  groups: OptionGroup[];
  availableAdditions: AdditionRow[];
};

const getPriceVariants = (product: MenuProductRow) => {
  return [...(product.variants ?? [])]
    .filter((variant) => variant.is_active)
    .map((variant) => ({
      id: variant.id,
      label: variant.name,
      price: Number(variant.price),
    }));
};

export const mapProducts = ({
  products,
  groups,
  availableAdditions,
}: MapProductsArg): MenuProduct[] => {
  const optionGroupsByProduct = new Map<string, OptionGroup[]>();
  for (const group of groups) {
    if (!optionGroupsByProduct.has(group.product_id)) {
      optionGroupsByProduct.set(group.product_id, []);
    }
    optionGroupsByProduct.get(group.product_id)!.push(group);
  }

  return products.map((product) => {
    const imgPath = product.image_path;

    const productGroups = optionGroupsByProduct.get(product.id) ?? [];
    const productAdditions = availableAdditions.filter(
      (addition) => addition.product_id === product.id,
    );

    return {
      ...product,
      groups: productGroups.map((group) => ({
        ...group,
        options: group.options.filter((option) => option.is_active),
      })),
      urlImage: imgPath
        ? {
            src: getStorageImageUrl(imgPath, SUPABASE_BUCKETS.MENU_IMAGES),
            alt: product.name,
          }
        : undefined,
      priceVariants: getPriceVariants(product),
      additions: productAdditions,
    };
  });
};
