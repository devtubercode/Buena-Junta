import { useState, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router";

import { appRoutes } from "@/app/routes";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { notify } from "@/shared/notifications/notify";
import logo from "@/assets/buenajunta-logo.webp";

export function LoginPage() {
  const { isLoading, session, signIn } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const from =
    typeof location.state === "object" &&
    location.state !== null &&
    "from" in location.state &&
    typeof location.state.from === "string"
      ? location.state.from
      : appRoutes.admin;

  if (!isLoading && session) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      notify.success("Sesión iniciada.");
    } catch (error) {
      notify.error(
        error instanceof Error ? error.message : "No se pudo iniciar sesión.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-svh place-items-center bg-background px-4 py-8 text-foreground">
      <form
        className="grid w-full max-w-md gap-5 rounded-lg border border-border bg-surface p-6 shadow-elevated"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center gap-3">
          <div className="inline-flex w-24 items-center justify-center justify-self-center rounded-full p-2 text-foreground bg-surface-muted">
            <img className="" src={logo} alt="logo-buena-junta" />
          </div>
          <div className="flex flex-col">
            <h1 className="m-0 font-heading text-3xl font-black leading-none text-foreground">
              Admin
            </h1>
            <p className="mt-1 text-sm font-bold text-muted-foreground">
              Ingresa para poder gestionar y administrar los productos de buena
              junta
            </p>
          </div>
        </div>

        <label className="grid gap-1 text-sm font-bold text-foreground">
          Correo
          <input
            className="min-h-11 rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label className="grid gap-1 text-sm font-bold text-foreground">
          Contraseña
          <input
            className="min-h-11 rounded-lg border border-border bg-surface px-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/25"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-5 text-sm font-black text-primary-foreground shadow-elevated transition enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {isSubmitting ? "Entrando" : "Entrar"}
        </button>
      </form>
    </main>
  );
}
