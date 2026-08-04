import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { Checkbox } from "@/shared/components/Checkbox";
import { CurrencyInput } from "@/shared/components/CurrencyInput";
import { QuantityStepper } from "@/shared/components/QuantityStepper";
import { CategoryChip } from "@/shared/components/menu/CategoryChip";
import { getCategoryIcon } from "@/shared/constants/category-icons";
import type { SuggestionFormData } from "@/features/order-assistant/types/order-assistant.types";
import type { MenuCategory } from "@/features/menu/types/menu.types";

type AssistantFormProps = {
  formData: SuggestionFormData;
  categories: MenuCategory[];
  onChange: (data: Partial<SuggestionFormData>) => void;
  onSubmit: () => void;
};

export const AssistantForm = ({
  formData,
  categories,
  onChange,
  onSubmit,
}: AssistantFormProps) => {
  const [exclusionsText, setExclusionsText] = useState(
    formData.exclusions.join(", "),
  );

  const hasSelectedCategories = formData.preferredCategorySlugs.length > 0;

  const handlePeopleChange = (delta: number) => {
    const next = Math.max(1, Math.min(20, formData.peopleCount + delta));
    onChange({ peopleCount: next });
  };

  const handleCategoryToggle = (slug: string) => {
    const current = formData.preferredCategorySlugs;
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [...current, slug];
    onChange({ preferredCategorySlugs: next });
  };

  const handleExclusionsBlur = () => {
    const items = exclusionsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    onChange({ exclusions: items });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="font-heading text-xl font-black text-foreground">
          Ayúdame a armar tu pedido
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Cuéntanos qué necesitas y buscaremos la mejor combinación
        </p>
      </div>

      {/* People count */}
      <fieldset>
        <legend className="mb-2 text-sm font-black text-foreground">
          ¿Para cuántas personas?
        </legend>
        <QuantityStepper
          quantity={formData.peopleCount}
          onIncrement={() => handlePeopleChange(1)}
          onDecrement={() => handlePeopleChange(-1)}
          itemName="personas"
        />
      </fieldset>

      {/* Maximum budget */}
      <div>
        <label
          htmlFor="assistant-budget"
          className="mb-2 block text-sm font-black text-foreground"
        >
          Presupuesto máximo{" "}
          <span className="font-medium text-muted-foreground">(opcional)</span>
        </label>
        <CurrencyInput
          id="assistant-budget"
          placeholder="Ej: 60.000"
          value={String(formData.maximumBudget ?? "")}
          onChange={(val) => {
            onChange({
              maximumBudget: val ? Number(val) : null,
            });
          }}
          className="w-full rounded-xl border border-border bg-surface py-3 px-4 font-heading text-lg font-black text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline focus:outline-2 focus:outline-primary/20"
        />
      </div>

      {/* Categories */}
      <fieldset>
        <legend className="mb-2 text-sm font-black text-foreground">
          Categorías preferidas
        </legend>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isSelected = formData.preferredCategorySlugs.includes(
              category.slug,
            );
            const Icon = getCategoryIcon(category.slug);
            return (
              <CategoryChip
                key={category.id}
                active={isSelected}
                onClick={() => handleCategoryToggle(category.slug)}
                icon={Icon}
              >
                {category.name}
              </CategoryChip>
            );
          })}
        </div>
        {!hasSelectedCategories ? (
          <p className="mt-2 text-xs font-medium text-error">
            Selecciona al menos una categoría para continuar
          </p>
        ) : null}
      </fieldset>

      {/* Shared item toggle */}
      <div className="rounded-xl border border-border bg-surface p-4">
        <Checkbox
          label="¿Incluir algo para compartir?"
          description="Ideal para grupos grandes"
          checked={formData.hasSharedItem}
          onCheckedChange={(checked) => onChange({ hasSharedItem: checked })}
        />
      </div>

      {/* Exclusions */}
      <div>
        <label
          htmlFor="assistant-exclusions"
          className="mb-2 block text-sm font-black text-foreground"
        >
          Exclusiones{" "}
          <span className="font-medium text-muted-foreground">(opcional)</span>
        </label>
        <input
          id="assistant-exclusions"
          type="text"
          placeholder="Ej: cebolla, mayonesa, picante"
          value={exclusionsText}
          onChange={(e) => setExclusionsText(e.target.value)}
          onBlur={handleExclusionsBlur}
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline focus:outline-2 focus:outline-primary/20"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Separa con comas los ingredientes que quieras evitar
        </p>
      </div>

      {/* Submit */}
      <Button
        type="button"
        variant="primary"
        size="lg"
        radius="full"
        fullWidth
        icon={<Search className="size-5" />}
        disabled={!hasSelectedCategories}
        onClick={onSubmit}
      >
        Buscar combinación
      </Button>
    </div>
  );
};
