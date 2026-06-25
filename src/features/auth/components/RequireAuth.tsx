import { CheckCircle } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router";

import { appRoutes } from "@/app/routes";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const RequireAuth = () => {
  const { isLoading, session } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background px-4 text-foreground">
        <div className="rounded-lg border border-border bg-surface p-6 text-sm font-bold text-muted-foreground shadow-elevated">
          <div className="flex flex-col justify-center items-center">
            <CheckCircle className="size-5 text-center" />
            <span>Verificando sesión...</span>
          </div>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <Navigate
        to={appRoutes.adminLogin}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
};
