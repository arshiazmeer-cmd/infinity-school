import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { PlusCircle, Trash2, CheckSquare, X, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import { fetchTeachers, Teacher } from "@/lib/adminApi";

interface TeacherTask {
  id: number;
  teacherId: number;
  taskType: string;
  title: string;
  description: string | null;
  status: string;
  dueDate: string | null;
  createdAt: string;
}

const TASK_TYPES = [
  { value: "admin_assigned", label: "Admin Assigned" },
  { value: "exam_duty", label: "Exam Duty" },
  { value: "attendance", label: "Attendance" },
  { value: "homework_pending", label: "Homework Check" },
  { value: "lesson_plan_pending", label: "Lesson Plan" },
];

const BASE = `${import.meta.env.BASE_URL}api/admin`.replace(/\/+/g, "/").replace(/\/$/, "");
function token() { return localStorage.getItem("admin_token"); }
const EMPTY = { teacherId: "", taskType: "admin_assigned", title: "", description: "", dueDate: "" };

export default function AdminTeacherTasks() {
  const { authenticated, loading } = useAdminAuth();
  const [, navigate] = useLocation();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [tasks, setTasks] = useState<TeacherTask[]>([]);
  const [fetching, setFetching] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => { if (!loading && !authenticated) navigate("/admin/login"); }, [loading, authenticated]);

  useEffect(() => {
    if (!authenticated) return;
    fetchTeachers().then(setTeachers).catch(() => {});
    loadTasks();
  }, [authenticated]);

  async function loadTasks(teacherId?: string) {
    setFetching(true);
    const params = teacherId ? `?teacherId=${teacherId}` : "";
    try {
      const res = await fetch(`${BASE}/tasks${params}`, { headers: token() ? { Authorization: `Bearer ${token()}` } : {} });
      setTasks(await res.json());
    } catch { toast.error("Failed to load tasks"); }
    finally { setFetching(false); }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.teacherId || !form.title.trim()) { toast.error("Teacher and title are required"); return; }
    setSaving(true);
    try {
      const res = await fetch(`${BASE}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token() ? { Authorization: `Bearer ${token()}` } : {}) },
        body: JSON.stringify({ ...form, teacherId: parseInt(form.teacherId) }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Task assigned");
      setShowForm(false);
      setForm({ ...EMPTY });
      loadTasks(selectedTeacher || undefined);
    } catch { toast.error("Failed to assign task"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    setDeleting(id);
    try {
      await fetch(`${BASE}/tasks/${id}`, { method: "DELETE", headers: token() ? { Authorization: `Bearer ${token()}` } : {} });
      setTasks((p) => p.filter((t) => t.id !== id));
      toast.success("Task removed");
    } catch { toast.error("Failed to delete"); }
    finally { setDeleting(null); }
  }

  const teacherName = (id: number) => teachers.find((t) => t.id === id)?.name ?? `Teacher #${id}`;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const completed = tasks.filter((t) => t.status === "completed").length;

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Teacher Tasks</h1>
            <p className="text-sm text-gray-500 mt-1">Assign and track tasks for teachers</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
            style={{ backgroundColor: "#1a3a6b" }}>
            <PlusCircle size={15} /> Assign Task
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Tasks", value: tasks.length, color: "text-[#1a3a6b]" },
            { label: "Pending", value: pending, color: "text-orange-500" },
            { label: "Completed", value: completed, color: "text-green-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Teacher filter */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
          <label className="text-sm font-medium text-gray-600 mr-3">Filter by Teacher:</label>
          <select value={selectedTeacher}
            onChange={(e) => { setSelectedTeacher(e.target.value); loadTasks(e.target.value || undefined); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a3a6b]">
            <option value="">All Teachers</option>
            {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        {/* Task list */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {fetching ? (
            <div className="text-center py-12 text-gray-400">Loading…</div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-14">
              <CheckSquare size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No tasks assigned yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {tasks.map((t) => (
                <div key={t.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                  <div className="mt-0.5">
                    {t.status === "completed" ? (
                      <CheckCircle2 size={18} className="text-green-500" />
                    ) : (
                      <Circle size={18} className="text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-medium ${t.status === "completed" ? "line-through text-gray-400" : "text-gray-800"}`}>
                        {t.title}
                      </span>
                      <span className="text-xs bg-blue-50 text-blue-600 rounded px-2 py-0.5">
                        {TASK_TYPES.find((ty) => ty.value === t.taskType)?.label ?? t.taskType}
                      </span>
                    </div>
                    {t.description && <p className="text-xs text-gray-500 mt-0.5">{t.description}</p>}
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span>👤 {teacherName(t.teacherId)}</span>
                      {t.dueDate && <span>📅 Due: {new Date(t.dueDate).toLocaleDateString("en-IN")}</span>}
                    </div>
                  </div>
                  <button onClick={() => handleDelete(t.id)} disabled={deleting === t.id}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors disabled:opacity-50">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Assign Task Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold text-gray-800">Assign Task</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Teacher *</label>
                <select value={form.teacherId} onChange={(e) => setForm((p) => ({ ...p, teacherId: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a3a6b]" required>
                  <option value="">Select teacher</option>
                  {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Task Type *</label>
                <select value={form.taskType} onChange={(e) => setForm((p) => ({ ...p, taskType: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a3a6b]">
                  {TASK_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
                <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a3a6b]" placeholder="Task title" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a3a6b] resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Due Date</label>
                <input type="date" value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a3a6b]" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "#1a3a6b" }}>
                  {saving ? "Saving…" : "Assign Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
