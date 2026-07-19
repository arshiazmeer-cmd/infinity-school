const API = "/api/teacher";

function getToken(): string | null {
  return localStorage.getItem("teacher_token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// Auth
export async function loginTeacher(email: string, password: string) {
  const data = await request<{ token: string; teacher: TeacherProfile }>(
    `${API}/login`,
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }
  );
  localStorage.setItem("teacher_token", data.token);
  localStorage.setItem("teacher_info", JSON.stringify(data.teacher));
  return data;
}

export function logoutTeacher() {
  localStorage.removeItem("teacher_token");
  localStorage.removeItem("teacher_info");
}

export function getStoredTeacher(): TeacherProfile | null {
  const raw = localStorage.getItem("teacher_info");
  return raw ? (JSON.parse(raw) as TeacherProfile) : null;
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export async function fetchMe() {
  return request<TeacherProfile>(`${API}/me`);
}

// Lesson Plans
export async function fetchLessonPlans() {
  return request<LessonPlan[]>(`${API}/lesson-plans`);
}

export async function createLessonPlan(data: LessonPlanInput) {
  return request<LessonPlan>(`${API}/lesson-plans`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateLessonPlan(id: number, data: LessonPlanInput) {
  return request<LessonPlan>(`${API}/lesson-plans/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteLessonPlan(id: number) {
  return request<{ message: string }>(`${API}/lesson-plans/${id}`, {
    method: "DELETE",
  });
}

// Homework
export async function fetchHomework() {
  return request<HomeworkItem[]>(`${API}/homework`);
}

export async function createHomework(data: HomeworkInput) {
  return request<HomeworkItem>(`${API}/homework`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateHomework(id: number, data: HomeworkInput) {
  return request<HomeworkItem>(`${API}/homework/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteHomework(id: number) {
  return request<{ message: string }>(`${API}/homework/${id}`, {
    method: "DELETE",
  });
}

// Study Materials
export async function fetchStudyMaterials() {
  return request<StudyMaterial[]>(`${API}/study-materials`);
}

export async function uploadStudyMaterial(formData: FormData) {
  const token = getToken();
  const res = await fetch(`${API}/study-materials`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json() as Promise<StudyMaterial>;
}

export async function deleteStudyMaterial(id: number) {
  return request<{ message: string }>(`${API}/study-materials/${id}`, {
    method: "DELETE",
  });
}

// Notices
export async function fetchNotices() {
  return request<Notice[]>(`${API}/notices`);
}

// Profile
export async function fetchProfile() {
  return request<TeacherProfile>(`${API}/profile`);
}

export async function updateProfile(data: { name: string; mobile: string; designation: string }) {
  return request<TeacherProfile>(`${API}/profile`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function changePassword(currentPassword: string, newPassword: string) {
  return request<{ message: string }>(`${API}/profile/password`, {
    method: "PUT",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

// Types
export interface TeacherProfile {
  id: number;
  name: string;
  email: string;
  mobile: string | null;
  designation: string | null;
  photoUrl: string | null;
  createdAt?: string;
}

export interface LessonPlan {
  id: number;
  teacherId: number;
  subject: string;
  className: string;
  topic: string;
  date: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface LessonPlanInput {
  subject: string;
  className: string;
  topic: string;
  date: string;
  content: string;
}

export interface HomeworkItem {
  id: number;
  teacherId: number;
  subject: string;
  className: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface HomeworkInput {
  subject: string;
  className: string;
  title: string;
  description: string;
  dueDate: string;
}

export interface StudyMaterial {
  id: number;
  teacherId: number;
  title: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  className: string;
  subject: string;
  createdAt: string;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  postedBy: string;
  createdAt: string;
}
