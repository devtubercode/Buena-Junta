import { cn } from "@/shared/utils/cn";

export function RequirementBadge({ isRequired }: { isRequired: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide",
        isRequired
          ? "border border-primary-border bg-primary-soft text-primary"
          : "border border-border bg-surface text-muted-foreground",
      )}
    >
      {isRequired ? "Requerido" : "Opcional"}
    </span>
  );
}

export function ActiveBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide",
        isActive
          ? "border border-success-border bg-success-soft text-success"
          : "border border-border bg-surface text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          isActive ? "bg-success" : "bg-muted-foreground",
        )}
        aria-hidden="true"
      />
      {isActive ? "Activo" : "Inactivo"}
    </span>
  );
}

export function OptionValueStatusDot({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex size-2 rounded-full",
        isActive ? "bg-success" : "bg-muted-foreground/40",
      )}
      aria-hidden="true"
    />
  );
}
