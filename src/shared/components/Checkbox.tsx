import { Check } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string;
  description?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  containerClassName?: string;
}

export function Checkbox({
  label,
  description,
  checked,
  defaultChecked,
  indeterminate = false,
  onCheckedChange,
  containerClassName,
  disabled,
  ...inputProps
}: CheckboxProps) {

  return (
    <label
      className={cn(
        "group flex cursor-pointer items-start gap-3",
        disabled && "cursor-not-allowed opacity-60",
        containerClassName
      )}
    >
      <div className="relative mt-0.5">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={(event) => {
            onCheckedChange?.(event.target.checked);
          }}
          {...inputProps}
        />
        <div
          className={cn(
            "size-5 shrink-0 rounded-md border-2 transition",
            "border-border bg-surface",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/25 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
            "peer-checked:border-primary peer-checked:bg-primary",
            "peer-indeterminate:border-primary peer-indeterminate:bg-primary",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-60"
          )}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-primary-foreground opacity-0 transition peer-checked:opacity-100 peer-indeterminate:opacity-100">
          {indeterminate ? (
            <span className="h-0.5 w-2.5 rounded-full bg-current" />
          ) : (
            <Check className="size-3.5 stroke-[3]" />
          )}
        </div>
      </div>

      {(label || description) && (
        <div className="grid gap-0.5">
          {label && (
            <span className="text-sm font-black text-foreground">{label}</span>
          )}
          {description && (
            <span className="text-xs font-medium text-muted-foreground">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
}
