import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/shared/utils/cn";

type Theme = "light" | "dark";

const themeStorageKey = "buenajunta-theme";

const getInitialTheme = (): Theme => {
  const storedTheme = window.localStorage.getItem(themeStorageKey);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return "light";
};

const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.classList.toggle("light", theme === "light");
};

export const ThemeSwitch = () => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const isDark = theme === "dark";

  useEffect(() => {
    applyTheme(getInitialTheme());
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    window.localStorage.setItem(themeStorageKey, nextTheme);
    applyTheme(nextTheme);
    setTheme(nextTheme);
  };

  return (
    <button
      type="button"
      className="relative inline-flex h-8 w-14 items-center rounded-full bg-surface-muted p-1 shadow-inner transition hover:bg-surface-muted/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      aria-label={`Cambiar a tema ${isDark ? "claro" : "oscuro"}`}
      aria-pressed={isDark}
      title={`Cambiar a tema ${isDark ? "claro" : "oscuro"}`}
      onClick={toggleTheme}
    >
      <span className="sr-only">
        Cambiar a tema {isDark ? "claro" : "oscuro"}
      </span>

      <span
        className={cn(
          "relative z-10 flex size-6 items-center justify-center rounded-full bg-primary shadow-md transition-transform duration-200 ease-out",
          isDark ? "translate-x-6" : "translate-x-0",
        )}
      >
        {isDark ? (
          <Moon className="size-3.5 text-primary-foreground" />
        ) : (
          <Sun className="size-3.5 text-primary-foreground" />
        )}
      </span>
    </button>
  );
};
