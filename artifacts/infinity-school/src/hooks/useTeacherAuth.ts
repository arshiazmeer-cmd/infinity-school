import { useState, useEffect, useCallback } from "react";
import {
  getStoredTeacher,
  isLoggedIn,
  logoutTeacher,
  fetchMe,
  type TeacherProfile,
} from "@/lib/teacherApi";

export function useTeacherAuth() {
  const [teacher, setTeacher] = useState<TeacherProfile | null>(getStoredTeacher);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn()) {
      setLoading(false);
      setAuthenticated(false);
      return;
    }

    // Validate token by fetching current user
    fetchMe()
      .then((me) => {
        setTeacher(me);
        setAuthenticated(true);
      })
      .catch(() => {
        // Token invalid/expired
        logoutTeacher();
        setAuthenticated(false);
        setTeacher(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = useCallback(() => {
    logoutTeacher();
    setTeacher(null);
    setAuthenticated(false);
    window.location.href = "/teacher/login";
  }, []);

  const refreshTeacher = useCallback(async () => {
    try {
      const me = await fetchMe();
      setTeacher(me);
    } catch {
      // ignore
    }
  }, []);

  return { teacher, loading, authenticated, logout, refreshTeacher };
}
