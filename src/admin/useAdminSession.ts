import { useCallback, useEffect, useState } from "react";
import { adminLogin, adminLogout, fetchAdminSession } from "../content/api";
import type { AdminIdentity } from "../content/types";

export type AdminSessionState = "checking" | "signed-out" | "signed-in";

export function useAdminSession() {
  const [state, setState] = useState<AdminSessionState>("checking");
  const [admin, setAdmin] = useState<AdminIdentity | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchAdminSession()
      .then((identity) => {
        if (cancelled) return;
        setAdmin(identity);
        setState("signed-in");
      })
      .catch(() => {
        if (cancelled) return;
        setAdmin(null);
        setState("signed-out");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const identity = await adminLogin(email, password);
    setAdmin(identity);
    setState("signed-in");
  }, []);

  const signOut = useCallback(async () => {
    await adminLogout().catch(() => undefined);
    setAdmin(null);
    setState("signed-out");
  }, []);

  return { state, admin, signIn, signOut };
}
