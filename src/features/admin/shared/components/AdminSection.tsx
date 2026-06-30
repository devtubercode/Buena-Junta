import type { ReactNode } from "react";

type AdminSectionProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function AdminSection({
  title,
  description,
  actions,
  children,
}: AdminSectionProps) {
  return (
    <section className="grid min-w-0 max-w-full gap-4">
      <div className="flex min-w-0 flex-col gap-3 border-b border-border pb-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h1 className="m-0 font-heading text-3xl font-black leading-tight text-foreground sm:text-4xl sm:leading-none">
            {title}
          </h1>
          {description ? (
            <p className="mt-1.5 max-w-3xl text-sm leading-5 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}
