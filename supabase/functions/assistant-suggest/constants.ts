export const AI_CHAT_COMPLETIONS_URL =
  "https://opencode.ai/zen/v1/chat/completions";

export const AI_REQUEST_TIMEOUT_MILLISECONDS = 60000;

// Límite máximo de tokens de salida. max_tokens es un tope, no un objetivo:
// el modelo solo usa lo que necesita. 2000 es suficiente para responder el
// JSON esperado sin incentivar salidas largas.
export const AI_MAX_TOKENS = 2000;

export const AI_TEMPERATURE = 0.2;
