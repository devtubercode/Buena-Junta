import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import { cn } from "@/shared/utils/cn";
import { TextArea } from "@/shared/components/TextArea";

interface TextAreaFieldProps<
  T extends FieldValues,
> extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  classNameContainer?: string;
}

export function TextAreaField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  className,
  classNameContainer,
  ...textareaProps
}: TextAreaFieldProps<T>) {
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
            <TextArea
              {...textareaProps}
              id={name}
              name={field.name}
              placeholder={placeholder}
              className={cn(
                error && "border-error focus:border-error focus:ring-error/25",
                className,
              )}
              value={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
            />
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
