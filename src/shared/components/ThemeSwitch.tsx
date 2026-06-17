import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@/shared/icons";

type Theme = "light" | "dark";

const themeStorageKey = "buenajunta-theme";

function getInitialTheme(): Theme {
  const storedTheme = window.localStorage.getItem(themeStorageKey);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.classList.toggle("light", theme === "light");
}

export function ThemeSwitch() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const isDark = theme === "dark";

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      window.localStorage.setItem(themeStorageKey, nextTheme);
      return nextTheme;
    });
  };

  return (
    <button
      type="button"
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-2.5 py-1.5 text-xs font-bold text-foreground shadow-elevated transition hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-3"
      aria-label={`Cambiar a tema ${isDark ? "claro" : "oscuro"}`}
      aria-pressed={isDark}
      title={`Cambiar a tema ${isDark ? "claro" : "oscuro"}`}
      onClick={toggleTheme}
    >
      {isDark ? (
        <MoonIcon className="size-4 text-primary" />
      ) : (
        <SunIcon className="size-4 text-primary" />
      )}
      <span className="hidden sm:inline">{isDark ? "Oscuro" : "Claro"}</span>
      <span className="relative h-6 w-11 rounded-full bg-surface-muted" aria-hidden="true">
        <span
          className="absolute top-1 size-4 rounded-full bg-primary transition-all data-[theme=dark]:left-6 data-[theme=light]:left-1"
          data-theme={theme}
        />
      </span>
    </button>
  );
}
