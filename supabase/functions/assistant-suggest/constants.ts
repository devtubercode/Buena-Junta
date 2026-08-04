export const AI_CHAT_COMPLETIONS_URL =
  "https://opencode.ai/zen/v1/chat/completions";

export const AI_REQUEST_TIMEOUT_MILLISECONDS = 60000;

// Límite máximo de tokens de salida. max_tokens es un tope, no un objetivo:
// el modelo solo usa lo que necesita. 12000 da espacio a modelos de
// razonamiento (que gastan tokens pensando antes del JSON) sin cortarlos.
export const AI_MAX_TOKENS = 12000;

export const AI_TEMPERATURE = 0.2;

export const PRODUCT_DESCRIPTION_MAXIMUM_LENGTH = 150;
