import flashy from "@pablotheblink/flashyjs";

import "./notify.css";

import {
  Check,
  AlertTriangle,
  Info,
  ShoppingCart,
  X as CloseX,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { WhatsappIcon } from "@/shared/icons/WhatsappIcon";

const lucideIconToSvg = (Icon: LucideIcon) => {
  return renderToStaticMarkup(
    createElement(Icon, {
      size: 17,
      strokeWidth: 2,
      "aria-hidden": true,
    }),
  );
};

const notificationIcons = {
  success: lucideIconToSvg(Check),
  warning: lucideIconToSvg(AlertTriangle),
  error: lucideIconToSvg(CloseX),
  info: lucideIconToSvg(Info),
  cart: lucideIconToSvg(ShoppingCart),
  whatsapp: renderToStaticMarkup(createElement(WhatsappIcon, { size: 17 })),
};

type NotificationOptions = {
  duration?: number;
};

const defaultDuration = 2200;

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
    return flashy.success(message, {
      ...baseOptions(options),
      icon: notificationIcons.success,
    });
  },
  warning(message: string, options?: NotificationOptions) {
    return flashy.warning(message, {
      ...baseOptions(options),
      icon: notificationIcons.warning,
    });
  },
  error(message: string, options?: NotificationOptions) {
    return flashy.error(message, {
      ...baseOptions(options),
      duration: options?.duration ?? 4600,
      icon: notificationIcons.error,
    });
  },
  info(message: string, options?: NotificationOptions) {
    return flashy.info(message, {
      ...baseOptions(options),
      icon: notificationIcons.info,
    });
  },
  cart(
    message = "Producto agregado al carrito.",
    options?: NotificationOptions,
  ) {
    return flashy.success(message, {
      ...baseOptions(options),
      icon: notificationIcons.cart,
    });
  },
  whatsapp(message: string, options?: NotificationOptions) {
    return flashy.success(message, {
      ...baseOptions(options),
      icon: notificationIcons.whatsapp,
    });
  },
  closeAll() {
    flashy.closeAll();
  },
};
