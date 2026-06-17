function svgIcon(paths: string, extraAttributes = "") {
  return `<svg class="notification-icon-svg" viewBox="0 0 24 24" aria-hidden="true" ${extraAttributes}>${paths}</svg>`;
}

export const notificationIcons = {
  success: svgIcon(
    '<path d="M20 6.8 9.7 17.2 4 11.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.3" />',
  ),
  warning: svgIcon(
    '<path d="M12 4.3 21 19H3L12 4.3Z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.9" /><path d="M12 9.3v4.2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2" /><path d="M12 16.8h.01" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2.6" />',
  ),
  error: svgIcon(
    '<path d="M6.7 6.7 17.3 17.3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2.2" /><path d="M17.3 6.7 6.7 17.3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2.2" />',
  ),
  info: svgIcon(
    '<path d="M12 10.5v6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2.1" /><path d="M12 7.2h.01" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2.8" /><circle cx="12" cy="12" r="8.4" fill="none" stroke="currentColor" stroke-width="1.8" />',
  ),
  cart: svgIcon(
    '<path d="M4 5.7h2.1l1.3 8.5a2 2 0 0 0 2 1.7h7.8a2 2 0 0 0 1.9-1.5l1-4.7H7.2" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" /><path d="M9.1 9.6h8.1" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.7" /><path d="M10 12.8h6.4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.7" /><path d="M10.2 9.4c.2-1.5 1.4-2.6 2.9-2.6s2.7 1.1 2.9 2.6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.7" /><circle cx="9.8" cy="19" r="1.1" fill="currentColor" /><circle cx="17" cy="19" r="1.1" fill="currentColor" />',
  ),
  whatsapp: svgIcon(
    '<path d="M5.5 18.4 4.4 21l2.8-1a8.1 8.1 0 1 0-1.7-1.6Z" fill="#25D366" stroke="#118C44" stroke-linejoin="round" stroke-width="1.1" /><path d="M9 8.8c.2-.4.4-.5.7-.5h.6c.2 0 .4.1.5.4l.7 1.5c.1.3 0 .5-.2.7l-.4.5c.7 1.2 1.6 2.1 2.9 2.7l.5-.5c.2-.2.5-.3.8-.1l1.5.7c.3.1.4.3.4.6v.6c0 .3-.2.6-.5.7-.6.3-1.3.4-2 .2-2.9-.8-5.1-2.9-5.9-5.8-.2-.7-.1-1.3.4-1.8Z" fill="#fff" />',
  ),
};
