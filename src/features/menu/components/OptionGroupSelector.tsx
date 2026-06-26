import type { MenuOptionGroup } from "@/features/menu/types/menu.types";
import { cn } from "@/shared/utils/cn";

type OptionGroupSelectorProps = {
  groups: MenuOptionGroup[];
  selectedOptions: Record<string, string>;
  onSelect: (groupName: string, optionName: string) => void;
};

export function OptionGroupSelector({
  groups,
  selectedOptions,
  onSelect,
}: OptionGroupSelectorProps) {
  if (groups.length === 0) return null;

  return (
    <section className="grid gap-4">
      {groups.map((group) => (
        <fieldset key={group.id} className="grid gap-2">
          <legend className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
            {group.name}
            {group.is_required ? (
              <span className="ml-1 text-primary">*</span>
            ) : null}
          </legend>
          <div className="flex flex-wrap gap-2">
            {group.product_option_values.map((option) => {
              const isSelected = selectedOptions[group.name] === option.name;

              return (
                <button
                  key={`${group.id}-${option.id}`}
                  type="button"
                  data-selected={isSelected}
                  onClick={() => onSelect(group.name, option.name)}
                  className={cn(
                    "inline-flex min-h-9 items-center rounded-full border px-3 text-xs font-black transition",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface text-muted-foreground hover:border-primary-border hover:text-foreground",
                  )}
                >
                  {option.name}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </section>
  );
}
