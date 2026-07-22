import { forwardRef } from "react";
import { formatCOP } from "@/features/cart/utils/money";
import { cn } from "@/shared/utils/cn";

const baseInputClass =
  "min-h-11 w-full min-w-0 rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none transition placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-primary/25";

export type CurrencyInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> & {
  value: string;
  onChange: (value: string) => void;
};

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, className, ...inputProps }, ref) => {
    const rawDigits = value.replace(/\D/g, "");
    const displayValue = rawDigits ? formatCOP(Number(rawDigits)) : "";

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextRawDigits = event.target.value.replace(/\D/g, "");
      onChange(nextRawDigits);
    };

    return (
      <input
        ref={ref}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        className={cn(baseInputClass, className)}
        {...inputProps}
      />
    );
  },
);

CurrencyInput.displayName = "CurrencyInput";
