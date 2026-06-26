import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { AdminSection } from "@/features/admin/components/AdminSection";

interface AdminNotFoundStateProps {
  title: string;
  description: string;
  backTo: string;
  backLabel?: string;
}

export function AdminNotFoundState({
  title,
  description,
  backTo,
  backLabel = "Volver",
}: AdminNotFoundStateProps) {
  return (
    <AdminSection
      title={title}
      actions={
        <Link
          to={backTo}
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface-muted px-4 text-sm font-black text-foreground"
        >
          <ArrowLeft className="size-4" />
          {backLabel}
        </Link>
      }
    >
      <p className="m-0 rounded-lg border border-border bg-surface p-4 text-sm font-bold text-muted-foreground">
        {description}
      </p>
    </AdminSection>
  );
}
