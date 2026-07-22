import type { OptionGroup } from "@/features/menu/types/menu.types";
import { cn } from "@/shared/utils/cn";

type OptionGroupSelectorProps = {
  groups: OptionGroup[];
  selectedOptions: Record<string, string>;
  onSelect: (groupName: string, optionName: string) => void;
};

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function OptionGroupSelector({
  groups,
  selectedOptions,
  onSelect,
}: OptionGroupSelectorProps) {
  if (groups.length === 0) return null;

  return (
    <section className="grid gap-4">
      {groups.map((group) => {
        const selected = selectedOptions[group.name];

        return (
          <fieldset key={group.id} className="grid gap-2">
            <legend className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
              Elegir {group.name}
              {group.is_required ? (
                <span aria-hidden="true" className="ml-1 text-primary">
                  *
                </span>
              ) : null}
            </legend>

            <div className="relative">
              <select
                value={selected ?? ""}
                onChange={(event) => onSelect(group.name, event.target.value)}
                className={cn(
                  "min-h-11 w-full appearance-none rounded-xl border-2 bg-surface px-4 py-2.5 text-sm font-black text-foreground transition",
                  "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                  selected
                    ? "border-primary"
                    : "border-border hover:border-primary/50",
                )}
              >
                <option value="" disabled>
                  {group.is_required
                    ? "Selecciona una opción"
                    : "Selecciona (opcional)"}
                </option>
                {group.options.map((option) => (
                  <option key={option.id} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
              <ChevronIcon className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
            </div>
          </fieldset>
        );
      })}
    </section>
  );
}
