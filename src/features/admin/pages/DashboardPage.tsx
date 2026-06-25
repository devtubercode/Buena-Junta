import { Link } from "react-router";
import {
  FolderTree,
  Gift,
  Package,
  Tags,
} from "lucide-react";
import { appRoutes } from "@/app/routes";
import { AdminDataState } from "@/features/admin/components/AdminDataState";
import { AdminSection } from "@/features/admin/components/AdminSection";
import { AdminDashboardSkeleton } from "@/features/admin/components/AdminSkeletons";
import { useDashboardData } from "@/features/admin/hooks/useDashboardData";

export function DashboardPage() {
  const {
    data: dashboard,
    isLoading,
    error,
  } = useDashboardData();

  if (error) {
    return <AdminDataState isLoading={false} error={error} />;
  }

  if (isLoading) {
    return (
      <AdminSection
        title="Resumen"
        description="Atajos de gestión para catálogo, promociones y grupos."
      >
        <AdminDashboardSkeleton />
      </AdminSection>
    );
  }

  const stats = [
    {
      label: "Productos",
      value: dashboard.productsCount,
      to: appRoutes.adminProducts,
      icon: Package,
    },
    {
      label: "Categorías",
      value: dashboard.categoriesCount,
      to: appRoutes.adminCategories,
      icon: Tags,
    },
    {
      label: "Promociones",
      value: dashboard.promotionsCount,
      to: appRoutes.adminPromotions,
      icon: Gift,
    },
    {
      label: "Grupos",
      value: dashboard.optionGroupsCount,
      to: appRoutes.adminOptionGroups,
      icon: FolderTree,
    },
  ];

  return (
    <AdminSection
      title="Resumen"
      description="Atajos de gestión para catálogo, promociones y grupos."
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link
              key={stat.label}
              to={stat.to}
              className="grid gap-4 rounded-lg border border-border bg-surface p-5 shadow-elevated transition hover:border-primary"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex size-11 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Icon className="size-5" />
                </span>
                <span className="font-heading text-4xl font-black text-foreground">
                  {stat.value}
                </span>
              </div>
              <p className="text-sm font-black text-muted-foreground">
                {stat.label}
              </p>
            </Link>
          );
        })}
      </div>
    </AdminSection>
  );
}
