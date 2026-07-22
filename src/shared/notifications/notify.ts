import flashy from "@pablotheblink/flashyjs";

import "./notify.css";

function lucideIconSvg(content: string, size = 17, strokeWidth = 2) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${content}</svg>`;
}

const notificationIcons = {
  success: lucideIconSvg("<polyline points='20 6 9 17 4 12'></polyline>"),
  warning: lucideIconSvg(
    "<path d='m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3'/><path d='M12 9v4'/><path d='M12 17h.01'/>",
  ),
  error: lucideIconSvg("<path d='M18 6 6 18'/><path d='m6 6 12 12'/>"),
  info: lucideIconSvg(
    "<circle cx='12' cy='12' r='10'/><path d='M12 16v-4'/><path d='M12 8h.01'/>",
  ),
  cart: lucideIconSvg(
    "<circle cx='8' cy='21' r='1'/><circle cx='19' cy='21' r='1'/><path d='M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12'/>",
  ),
  whatsapp: [
    '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" width="17"',
    'height="17" viewBox="0 0 448 512" fill="currentColor"><path d="M380.9 97.1',
    "c-41.9-42-97.7-65.1-157-65.1-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3",
    "29.6 111L0 480 117.7 449.1c32.4 17.7 68.9 27 106.1 27l.1 0c122.3 0",
    "224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0",
    "-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.6-68.1-4.4-7c-18.5-29.4-28.2-63.3",
    "-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1",
    "s56.2 81.2 56.1 130.5c0 101.8-84.9 184.6-186.6 184.6zM325.1 300.5",
    "c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8s-14.3 18-17.6 21.8",
    "c-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1",
    "16.3-30.3 1.8-3.7 .9-6.9-.5-9.7s-12.5-30.1-17.1-41.2c-4.5-10.8-9.1-9.3",
    "-12.5-9.5-3.2-.2-6.9-.2-10.6-.2s-9.7 1.4-14.8 6.9c-5.1 5.6-19.4 19-19.4",
    "46.3s19.9 53.7 22.6 57.4c2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5",
    "66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4s4.6-24.1 3.2-26.4c-1.3-2.5-5-3.9",
    '-10.5-6.6z"/></svg>',
  ].join(" "),
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
