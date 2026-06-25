import type { ReactNode } from "react";

type AdminFieldProps = {
  label: string;
  children: ReactNode;
};

export function AdminField({ label, children }: AdminFieldProps) {
  return (
    <label className="grid min-w-0 gap-1 text-sm font-bold text-foreground">
      <span>{label}</span>
      {children}
    </label>
  );
}

export const adminInputClass =
  "min-h-11 w-full min-w-0 rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none transition placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-primary/25";

export const adminTextareaClass = `${adminInputClass} min-h-24 py-2`;
