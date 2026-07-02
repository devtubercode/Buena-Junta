import { useState } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import { useFormState } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";

import { cn } from "@/shared/utils/cn";

interface InputFieldProps<
  T extends FieldValues,
> extends React.InputHTMLAttributes<HTMLInputElement> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  isPassword?: boolean;
  classNameContainer?: string;
  description?: string;
}

const baseInputClass =
  "min-h-11 w-full min-w-0 rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none transition placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-primary/25";

export function InputField<T extends FieldValues>({
  name,
  type,
  label,
  control,
  className,
  isPassword,
  description,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  classNameContainer,
  ...inputProps
}: InputFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;
  const PasswordIcon = showPassword ? EyeOff : Eye;

  const { errors } = useFormState({ control });
  const error = errors[name];

  return (
    <div className={cn("grid w-full gap-1.5", classNameContainer)}>
      {label && (
        <label htmlFor={name} className="text-sm font-bold text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        {LeftIcon && (
          <LeftIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}

        <input
          {...inputProps}
          type={inputType}
          id={name}
          className={cn(
            baseInputClass,
            LeftIcon && "pl-10",
            (RightIcon || isPassword) && "pr-10",
            error && "border-error focus:border-error focus:ring-error/25",
            className,
          )}
          {...control.register(name)}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            <PasswordIcon className="h-4 w-4" />
          </button>
        ) : (
          RightIcon && (
            <RightIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          )
        )}
      </div>
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
}
