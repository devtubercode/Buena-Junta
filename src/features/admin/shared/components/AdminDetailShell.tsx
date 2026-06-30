import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { AdminSection } from "@/features/admin/shared/components/AdminSection";

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
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-black text-foreground transition hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
