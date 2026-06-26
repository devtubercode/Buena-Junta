import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { AdminSection } from "@/features/admin/components/AdminSection";

interface AdminDetailShellProps {
  title: string;
  description?: string;
  backTo: string;
  backLabel?: string;
  children: ReactNode;
}

export function AdminDetailShell({
  title,
  description,
  backTo,
  backLabel = "Volver",
  children,
}: AdminDetailShellProps) {
  return (
    <AdminSection
      title={title}
      description={description}
      actions={
        <Link
          to={backTo}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-surface-muted px-3 text-sm font-black text-foreground sm:min-h-11 sm:px-4"
        >
          <ArrowLeft className="size-4" />
          {backLabel}
        </Link>
      }
    >
      {children}
    </AdminSection>
  );
}
