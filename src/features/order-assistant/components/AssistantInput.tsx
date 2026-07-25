import { useState } from "react";
import { Minus, Plus, Search } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Button } from "@/shared/components/Button";
import { CurrencyInput } from "@/shared/components/CurrencyInput";
import type { SuggestionFormData } from "@/features/order-assistant/types/order-assistant.types";
import type { MenuCategory } from "@/features/menu/types/menu.types";

type AssistantInputProps = {
  formData: SuggestionFormData;
  categories: MenuCategory[];
  onChange: (data: Partial<SuggestionFormData>) => void;
  onSubmit: () => void;
};

export function AssistantInput({
  formData,
  categories,
  onChange,
  onSubmit,
}: AssistantInputProps) {
  const [exclusionsText, setExclusionsText] = useState(
    formData.exclusions.join(", "),
  );

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
        <div className="inline-flex items-stretch overflow-hidden rounded-lg border border-border bg-surface">
          <button
            type="button"
            onClick={() => handlePeopleChange(-1)}
            disabled={formData.peopleCount <= 1}
            className="flex aspect-square items-center justify-center p-3 transition hover:bg-primary-soft focus-visible:outline focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Disminuir cantidad de personas"
          >
            <Minus className="size-4 text-primary" />
          </button>
          <span
            className="flex min-w-[3.5rem] items-center justify-center border-x border-border px-4 text-center font-heading text-lg font-black text-foreground"
            aria-live="polite"
          >
            {formData.peopleCount}
          </span>
          <button
            type="button"
            onClick={() => handlePeopleChange(1)}
            disabled={formData.peopleCount >= 20}
            className="flex aspect-square items-center justify-center p-3 transition hover:bg-primary-soft focus-visible:outline focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Aumentar cantidad de personas"
          >
            <Plus className="size-4 text-primary" />
          </button>
        </div>
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
            return (
              <button
                key={category.id}
                type="button"
                data-active={isSelected}
                onClick={() => handleCategoryToggle(category.slug)}
                className={cn(
                  "inline-flex items-center rounded-full border px-3.5 py-2 text-xs font-black leading-none transition",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  "active:scale-95",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                    : "border-border bg-surface text-muted-foreground hover:border-primary/60 hover:text-foreground",
                )}
                aria-pressed={isSelected}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Shared item toggle */}
      <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4">
        <div>
          <p className="text-sm font-black text-foreground">
            ¿Incluir algo para compartir?
          </p>
          <p className="text-xs text-muted-foreground">
            Ideal para grupos grandes
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={formData.hasSharedItem}
          onClick={() => onChange({ hasSharedItem: !formData.hasSharedItem })}
          className={cn(
            "relative inline-flex h-7 w-12 shrink-0 rounded-full border-2 border-transparent transition-colors",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
            formData.hasSharedItem ? "bg-primary" : "bg-muted-foreground/30",
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block size-6 rounded-full bg-white shadow-md transition-transform",
              formData.hasSharedItem ? "translate-x-5" : "translate-x-0",
            )}
          />
        </button>
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
        onClick={onSubmit}
      >
        Buscar combinación
      </Button>
    </div>
  );
}
