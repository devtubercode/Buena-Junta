import { Navigate, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { appRoutes } from "@/app/routes";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  loginSchema,
  type LoginFormData,
} from "@/features/auth/schemas/loginSchema";
import { getRedirectPath } from "@/features/auth/utils/getRedirectPath";
import { InputField } from "@/shared/components/InputField";
import { notify } from "@/shared/notifications/notify";
import logo from "@/assets/buenajunta-logo.webp";

export function LoginPage() {
  const { isLoading, session, signIn } = useAuth();
  const location = useLocation();
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const from = getRedirectPath(location.state, appRoutes.admin);

  if (!isLoading && session) {
    return <Navigate to={from} replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data.email, data.password);
      notify.success("Sesión iniciada.");
    } catch (error) {
      notify.error(
        error instanceof Error ? error.message : "No se pudo iniciar sesión.",
      );
    }
  };

  const { isSubmitting } = form.formState;
  const isBusy = isSubmitting || isLoading;

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center bg-background px-4 py-10 text-foreground">
      <section className="w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-elevated sm:p-8">
        <header className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 inline-flex h-24 w-24 items-center justify-center rounded-full bg-surface-muted shadow-sm ring-1 ring-border">
            <img
              src={logo}
              alt="Buena Junta"
              className="h-16 w-16 object-contain"
            />
          </div>
          <h1 className="font-heading text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            Bienvenido
          </h1>
          <p className="mt-2 max-w-[26ch] text-balance text-sm font-medium leading-relaxed text-muted-foreground">
            Ingresa a admin para gestionar y administrar los productos de Buena
            Junta.
          </p>
        </header>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="flex flex-col gap-5"
        >
          <InputField
            name="email"
            control={form.control}
            label="Correo electrónico"
            type="email"
            autoComplete="email"
          />

          <InputField
            name="password"
            control={form.control}
            label="Contraseña"
            isPassword
            autoComplete="current-password"
          />

          <button
            type="submit"
            disabled={isBusy}
            aria-busy={isBusy}
            className="mt-2 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-black uppercase tracking-wide text-primary-foreground shadow-md transition-all duration-200 ease-out enabled:hover:-translate-y-0.5 enabled:hover:shadow-lg enabled:hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span
                  className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
                  aria-hidden="true"
                />
                Entrando...
              </span>
            ) : (
              "Entrar"
            )}
          </button>
        </form>
      </section>

      <footer className="mt-6 text-center">
        <p className="text-xs font-medium text-muted-foreground">
          © {new Date().getFullYear()} Buena Junta. Todos los derechos
          reservados.
        </p>
      </footer>
    </main>
  );
}
