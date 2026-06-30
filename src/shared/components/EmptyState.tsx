import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
};

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6 text-center shadow-elevated">
      {icon ? <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary-soft text-primary">{icon}</div> : null}
      <h3 className="font-heading text-2xl font-black leading-tight text-foreground">{title}</h3>
      {description ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
