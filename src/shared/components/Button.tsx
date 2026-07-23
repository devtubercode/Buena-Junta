import { forwardRef } from "react";
import { cn } from "@/shared/utils/cn";

export type ButtonProps = {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  radius?: "sm" | "md" | "lg" | "full";
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const variantStyles: Record<string, string> = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-90 shadow-elevated",
  secondary:
    "bg-surface text-foreground border border-border hover:border-primary/30 hover:bg-primary-soft",
  outline:
    "border border-primary text-primary bg-transparent hover:bg-primary-soft",
  ghost: "text-muted-foreground hover:text-foreground hover:bg-black/5",
};

const sizeStyles: Record<string, string> = {
  sm: "min-h-9 px-3 text-xs gap-1.5",
  md: "min-h-10 px-4 text-sm gap-2",
  lg: "min-h-12 px-5 text-sm gap-2",
};

const radiusStyles: Record<string, string> = {
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-full",
};

const baseStyles =
  "inline-flex items-center justify-center font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      radius = "md",
      icon,
      iconRight,
      fullWidth,
      loading = false,
      disabled,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          radiusStyles[radius],
          fullWidth && "w-full",
          loading && "cursor-wait",
          className,
        )}
        {...props}
      >
        {loading ? (
          <svg
            className="size-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : icon ? (
          icon
        ) : null}
        {children}
        {!loading && iconRight ? iconRight : null}
      </button>
    );
  },
);

Button.displayName = "Button";
