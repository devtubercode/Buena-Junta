export function handleSupabaseError(
  error: unknown,
  fallbackMessage = "Ocurrió un error inesperado",
) {
  if (error instanceof Error) {
    return new Error(error.message || fallbackMessage);
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return new Error(error.message || fallbackMessage);
  }

  return new Error(fallbackMessage);
}

export function throwIfSupabaseError(
  error: unknown,
  fallbackMessage = "Ocurrió un error inesperado",
) {
  if (error) {
    throw handleSupabaseError(error, fallbackMessage);
  }
}
