import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { PlusCircle, Trash2, CalendarDays, X } from "lucide-react";
import { toast } from "sonner";
import { fetchTeachers, Teacher } from "@/lib/adminApi";

interface TimetableSlot {
  id: number;
  teacherId: number;
  dayOfWeek: string;
  periodNumber: number;
  subject: string;
  className: string;
  section: string;
  startTime: string;
  endTime: string;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const CLASSES = ["Nursery","LKG","UKG","Class 1","Class 2","Class 3","Class 4","Class 5","Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"];

const BASE = `${import.meta.env.BASE_URL}api/admin`.replace(/\/+/g, "/").replace(/\/$/, "");
function token() { return localStorage.getItem("admin_token"); }

const EMPTY = { teacherId: "", dayOfWeek: "Monday", periodNumber: "1", subject: "", className: "Class 6", section: "A", startTime: "08:00", endTime: "08:45" };

export default function AdminTimetable() {
  const { authenticated, loading } = useAdminAuth();
  const [, navigate] = useLocation();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [fetching, setFetching] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => { if (!loading && !authenticated) navigate("/admin/login"); }, [loading, authenticated]);

  useEffect(() => {
    if (!authenticated) return;
    fetchTeachers().then((t) => { setTeachers(t); }).catch(() => {});
    loadSlots();
  }, [authenticated]);

  async function loadSlots(teacherId?: string) {
    setFetching(true);
    const params = teacherId ? `?teacherId=${teacherId}` : "";
    try {
      const res = await fetch(`${BASE}/timetable${params}`, { headers: token() ? { Authorization: `Bearer ${token()}` } : {} });
      setSlots(await res.json());
    } catch { toast.error("Failed to load timetable"); }
    finally { setFetching(false); }
  }

  function handleTeacherFilter(id: string) {
    setSelectedTeacher(id);
    loadSlots(id || undefined);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.teacherId || !form.subject.trim()) { toast.error("Teacher and Subject are required"); return; }
    setSaving(true);
    try {
      const res = await fetch(`${BASE}/timetable`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token() ? { Authorization: `Bearer ${token()}` } : {}) },
        body: JSON.stringify({ ...form, teacherId: parseInt(form.teacherId), periodNumber: parseInt(form.periodNumber) }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Period added");
      setShowForm(false);
      setForm({ ...EMPTY });
      loadSlots(selectedTeacher || undefined);
    } catch { toast.error("Failed to add period"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    setDeleting(id);
    try {
      await fetch(`${BASE}/timetable/${id}`, { method: "DELETE", headers: token() ? { Authorization: `Bearer ${token()}` } : {} });
      setSlots((p) => p.filter((s) => s.id !== id));
      toast.success("Period removed");
    } catch { toast.error("Failed to delete"); }
    finally { setDeleting(null); }
  }

  const teacherName = (id: number) => teachers.find((t) => t.id === id)?.name ?? `Teacher #${id}`;

  const grouped = DAYS.reduce((acc, day) => {
    acc[day] = slots.filter((s) => s.dayOfWeek === day).sort((a, b) => a.periodNumber - b.periodNumber);
    return acc;
  }, {} as Record<string, TimetableSlot[]>);

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Timetable Management</h1>
            <p className="text-sm text-gray-500 mt-1">Assign class periods to teachers</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
            style={{ backgroundColor: "#1a3a6b" }}>
            <PlusCircle size={15} /> Add Period
          </button>
        </div>

        {/* Teacher filter */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5">
          <label className="text-sm font-medium text-gray-600 mr-3">Filter by Teacher:</label>
          <select value={selectedTeacher} onChange={(e) => handleTeacherFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a3a6b]">
            <option value="">All Teachers</option>
            {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        {/* Weekly grid */}
        {fetching ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-400 border border-gray-100">Loading…</div>
        ) : (
          <div className="space-y-4">
            {DAYS.map((day) => (
              <div key={day} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-700">{day}</h3>
                  <span className="text-xs text-gray-400">{grouped[day].length} period{grouped[day].length !== 1 ? "s" : ""}</span>
                </div>
                {grouped[day].length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No periods assigned</p>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {grouped[day].map((s) => (
                      <div key={s.id} className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors">
                        <span className="w-6 h-6 rounded-full bg-[#1a3a6b] text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
                          {s.periodNumber}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-medium text-gray-800 text-sm">{s.subject}</span>
                            <span className="text-xs bg-blue-50 text-blue-600 rounded px-2 py-0.5">{s.className}-{s.section}</span>
                            <span className="text-xs text-gray-400">{s.startTime}–{s.endTime}</span>
                          </div>
                          {!selectedTeacher && (
                            <p className="text-xs text-gray-400 mt-0.5">{teacherName(s.teacherId)}</p>
                          )}
                        </div>
                        <button onClick={() => handleDelete(s.id)} disabled={deleting === s.id}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors disabled:opacity-50">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Period Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold text-gray-800">Add Period</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-3">
              {[
                { label: "Teacher *", key: "teacherId", type: "select-teacher" },
                { label: "Day *", key: "dayOfWeek", type: "select", options: DAYS },
                { label: "Period Number *", key: "periodNumber", type: "number" },
                { label: "Subject *", key: "subject" },
                { label: "Class *", key: "className", type: "select", options: CLASSES },
                { label: "Section", key: "section", type: "select", options: ["A","B","C","D","E"] },
                { label: "Start Time *", key: "startTime", type: "time" },
                { label: "End Time *", key: "endTime", type: "time" },
              ].map(({ label, key, type, options }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                  {type === "select-teacher" ? (
                    <select value={form[key as keyof typeof form]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a3a6b]" required>
                      <option value="">Select teacher</option>
                      {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  ) : type === "select" ? (
                    <select value={form[key as keyof typeof form]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a3a6b]">
                      {options!.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={type || "text"} value={form[key as keyof typeof form]}
                      onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a3a6b]"
                      min={type === "number" ? 1 : undefined} required={!!label.includes("*")} />
                  )}
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "#1a3a6b" }}>
                  {saving ? "Saving…" : "Add Period"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
