type RedirectState = {
  from: string;
};

function isRedirectState(state: unknown): state is RedirectState {
  return (
    typeof state === "object" &&
    state !== null &&
    "from" in state &&
    typeof (state as RedirectState).from === "string"
  );
}

export function getRedirectPath(state: unknown, fallback: string): string {
  return isRedirectState(state) ? state.from : fallback;
}
