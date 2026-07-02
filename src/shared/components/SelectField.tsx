import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import { cn } from "@/shared/utils/cn";

interface SelectFieldProps<
  T extends FieldValues,
> extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  description?: string;
  classNameContainer?: string;
  nullable?: boolean;
}

const baseInputClass =
  "min-h-11 w-full min-w-0 rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none transition placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-primary/25";

export function SelectField<T extends FieldValues>({
  name,
  control,
  label,
  options,
  placeholder,
  description,
  classNameContainer,
  className,
  nullable = false,
  ...selectProps
}: SelectFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const error = fieldState.error;

        return (
          <div className={cn("grid w-full gap-1.5", classNameContainer)}>
            {label && (
              <label
                htmlFor={name}
                className="text-sm font-bold text-foreground"
              >
                {label}
              </label>
            )}
            <select
              {...selectProps}
              id={name}
              name={field.name}
              className={cn(
                baseInputClass,
                error && "border-error focus:border-error focus:ring-error/25",
                className,
              )}
              value={field.value ?? ""}
              onChange={(event) => {
                const value = event.target.value;
                field.onChange(nullable ? value || null : value);
              }}
              onBlur={field.onBlur}
              ref={field.ref}
            >
              {placeholder && <option value="">{placeholder}</option>}
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {description && !error && (
              <p className="text-xs font-medium text-muted-foreground">
                {description}
              </p>
            )}
            {error && (
              <p className="text-xs font-bold text-error">
                {error.message as string}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}
