import { useState, useEffect, useCallback } from "react";
import { fetchAdminMe, isAdminLoggedIn, logoutAdmin } from "@/lib/adminApi";

export function useAdminAuth() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      setLoading(false);
      return;
    }
    fetchAdminMe()
      .then((me) => {
        setEmail(me.email);
        setAuthenticated(true);
      })
      .catch(() => {
        logoutAdmin();
        setAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = useCallback(() => {
    logoutAdmin();
    setEmail(null);
    setAuthenticated(false);
    window.location.href = "/admin/login";
  }, []);

  return { email, loading, authenticated, logout };
}
