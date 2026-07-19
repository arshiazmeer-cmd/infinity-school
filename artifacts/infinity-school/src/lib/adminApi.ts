const BASE = `${import.meta.env.BASE_URL}api/admin`.replace(/\/+/g, "/").replace(/\/$/, "");

const TOKEN_KEY = "admin_token";
const ADMIN_EMAIL_KEY = "admin_email";

// ── Token storage ────────────────────────────────────────────────────────────

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAdminLoggedIn(): boolean {
  return !!getToken();
}

export function logoutAdmin(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_EMAIL_KEY);
}

// ── Base fetch with auth ─────────────────────────────────────────────────────

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function loginAdmin(email: string, password: string): Promise<void> {
  const data = await apiFetch<{ token: string; email: string }>("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(ADMIN_EMAIL_KEY, data.email);
}

export async function fetchAdminMe(): Promise<{ email: string; role: string }> {
  return apiFetch("/me");
}

// ── Teachers ─────────────────────────────────────────────────────────────────

export interface Teacher {
  id: number;
  name: string;
  email: string;
  designation: string | null;
  mobile: string | null;
  photoUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

export async function fetchTeachers(): Promise<Teacher[]> {
  return apiFetch("/teachers");
}

export async function createTeacher(data: {
  name: string;
  email: string;
  password: string;
  designation?: string;
  mobile?: string;
}): Promise<Teacher> {
  return apiFetch("/teachers", { method: "POST", body: JSON.stringify(data) });
}

export async function updateTeacher(
  id: number,
  data: { name: string; designation?: string; mobile?: string }
): Promise<Teacher> {
  return apiFetch(`/teachers/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export async function resetTeacherPassword(id: number, password: string): Promise<void> {
  await apiFetch(`/teachers/${id}/password`, {
    method: "PUT",
    body: JSON.stringify({ password }),
  });
}

export async function toggleTeacherStatus(id: number, isActive: boolean): Promise<void> {
  await apiFetch(`/teachers/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
}

export async function deleteTeacher(id: number): Promise<void> {
  await apiFetch(`/teachers/${id}`, { method: "DELETE" });
}
