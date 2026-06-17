import flashy from "@pablotheblink/flashyjs";
import { notificationIcons } from "@/shared/icons/notificationIcons";

type NotificationOptions = {
  duration?: number;
};

const defaultDuration = 3200;

function getTheme(): "light" | "dark" {
  return document.documentElement.classList.contains("dark") ||
    document.documentElement.dataset.theme === "dark"
    ? "dark"
    : "light";
}

function baseOptions(options?: NotificationOptions) {
  return {
    animation: "slide" as const,
    closable: true,
    duration: options?.duration ?? defaultDuration,
    position: "top-center" as const,
    theme: getTheme(),
  };
}

export const notify = {
  success(message: string, options?: NotificationOptions) {
    return flashy.success(message, { ...baseOptions(options), icon: notificationIcons.success });
  },
  warning(message: string, options?: NotificationOptions) {
    return flashy.warning(message, { ...baseOptions(options), icon: notificationIcons.warning });
  },
  error(message: string, options?: NotificationOptions) {
    return flashy.error(message, {
      ...baseOptions(options),
      duration: options?.duration ?? 4600,
      icon: notificationIcons.error,
    });
  },
  info(message: string, options?: NotificationOptions) {
    return flashy.info(message, { ...baseOptions(options), icon: notificationIcons.info });
  },
  cart(message = "Producto agregado al carrito.", options?: NotificationOptions) {
    return flashy.success(message, { ...baseOptions(options), icon: notificationIcons.cart });
  },
  whatsapp(message: string, options?: NotificationOptions) {
    return flashy.success(message, { ...baseOptions(options), icon: notificationIcons.whatsapp });
  },
  closeAll() {
    flashy.closeAll();
  },
};
