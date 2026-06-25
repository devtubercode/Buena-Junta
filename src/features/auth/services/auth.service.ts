import { supabase } from "@/lib/supabase/client";
import { throwIfSupabaseError } from "@/shared/errors/handle-supabase-error";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();

  throwIfSupabaseError(error);

  return data.session;
}

export async function signInWithPassword(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  throwIfSupabaseError(error);
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  throwIfSupabaseError(error);
}

export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void,
) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}
