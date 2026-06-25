import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

import { cn } from "@/shared/utils/cn";

interface TextAreaFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  placeholder?: string;
  label?: string;
  className?: string;
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
}

const baseTextareaClass =
  "min-h-24 w-full min-w-0 resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-primary/25";

export function TextAreaField<T extends FieldValues>({
  name,
  placeholder,
  form,
  label,
  className,
  textareaProps,
}: TextAreaFieldProps<T>) {
  const {
    register,
    formState: { errors },
  } = form;

  const error = errors[name];

  return (
    <div className={cn("grid w-full gap-1.5", className)}>
      {label && (
        <label htmlFor={name} className="text-sm font-bold text-foreground">
          {label}
        </label>
      )}
      <textarea
        id={name}
        placeholder={placeholder}
        className={cn(
          baseTextareaClass,
          error && "border-error focus:border-error focus:ring-error/25",
        )}
        {...register(name)}
        {...textareaProps}
      />
      {error && (
        <p className="text-xs font-bold text-error">
          {error.message as string}
        </p>
      )}
    </div>
  );
}
