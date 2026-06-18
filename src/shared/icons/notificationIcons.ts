function svgIcon(paths: string, extraAttributes = "") {
  return `<svg class="notification-icon-svg" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extraAttributes}>${paths}</svg>`;
}

export const notificationIcons = {
  success: svgIcon('<path d="M20 6 9 17l-5-5" />'),
  warning: svgIcon(
    '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" />',
  ),
  error: svgIcon('<path d="M18 6 6 18" /><path d="m6 6 12 12" />'),
  info: svgIcon(
    '<circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />',
  ),
  cart: svgIcon(
    '<circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />',
  ),
  whatsapp: svgIcon(
    '<path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719Z" />',
  ),
};
