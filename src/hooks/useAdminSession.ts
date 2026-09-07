import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

export type AdminSessionState = {
  loading: boolean;
  session: Session | null;
  isAdmin: boolean;
};

/** Confirms the signed-in account exists in the admin allow-list. */
export async function checkIsAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.error("Admin check failed", error);
    return false;
  }
  return Boolean(data);
}

export function useAdminSession(): AdminSessionState {
  const [state, setState] = useState<AdminSessionState>({
    loading: true,
    session: null,
    isAdmin: false,
  });

  useEffect(() => {
    let active = true;

    async function resolve(session: Session | null) {
      if (!session?.user) {
        if (active) setState({ loading: false, session: null, isAdmin: false });
        return;
      }
      const isAdmin = await checkIsAdmin(session.user.id);
      if (active) setState({ loading: false, session, isAdmin });
    }

    supabase.auth.getSession().then(({ data }) => resolve(data.session));

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") return;
      void resolve(session);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
