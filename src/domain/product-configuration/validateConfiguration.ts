import type { OptionGroup, MenuPriceVariant } from "@/features/menu/types/menu.types";

export type ConfigurationValidation = {
  isValid: boolean;
  status: "complete" | "needs_variant" | "needs_options" | "needs_additions" | "incomplete";
  missingFields: string[];
};

export function validateConfiguration(
  variants: MenuPriceVariant[],
  optionGroups: OptionGroup[],
  _hasAdditions: boolean,
  config: {
    variantKey?: string;
    selectedOptions?: Record<string, string>;
    additionOptions?: Array<unknown>;
  },
): ConfigurationValidation {
  const missingFields: string[] = [];

  if (variants.length > 0 && !config.variantKey) {
    missingFields.push("Presentación");
  }

  const requiredGroups = optionGroups.filter((g) => g.is_active && g.is_required);

  for (const group of requiredGroups) {
    const selected = config.selectedOptions?.[group.name];
    if (!selected) {
      missingFields.push(group.name.toLocaleLowerCase("es-CO"));
    }
  }

  if (missingFields.length > 0) {
    let status: ConfigurationValidation["status"];

    if (missingFields.includes("Presentación")) {
      status = "needs_variant";
    } else {
      status = "needs_options";
    }

    return { isValid: false, status, missingFields };
  }

  return { isValid: true, status: "complete", missingFields: [] };
}
