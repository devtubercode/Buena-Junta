import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller, useFormState } from "react-hook-form";

import { cn } from "@/shared/utils/cn";
import { CurrencyInput } from "@/shared/components/CurrencyInput";

interface CurrencyFieldProps<T extends FieldValues> extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "name" | "value" | "onChange" | "onBlur"
> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  description?: string;
  className?: string;
  classNameContainer?: string;
}

export function CurrencyField<T extends FieldValues>({
  name,
  control,
  label,
  description,
  className,
  classNameContainer,
  placeholder,
  disabled,
  ...inputProps
}: CurrencyFieldProps<T>) {
  const { errors } = useFormState({ control });
  const error = errors[name];

  return (
    <div className={cn("grid w-full gap-1.5", classNameContainer)}>
      {label && (
        <label htmlFor={name} className="text-sm font-bold text-foreground">
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <CurrencyInput
            {...inputProps}
            id={name}
            name={field.name}
            value={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            disabled={disabled}
            placeholder={placeholder}
            className={cn(
              error && "border-error focus:border-error focus:ring-error/25",
              className,
            )}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? `${name}-error` : undefined}
            ref={field.ref}
          />
        )}
      />
      {description && !error && (
        <p className="text-xs font-medium text-muted-foreground">
          {description}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="text-xs font-bold text-error">
          {error.message as string}
        </p>
      )}
    </div>
  );
}
