import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";
import {
  fetchLessonPlans,
  createLessonPlan,
  updateLessonPlan,
  deleteLessonPlan,
  type LessonPlan,
  type LessonPlanInput,
} from "@/lib/teacherApi";
import { Plus, Pencil, Trash2, X, BookOpen } from "lucide-react";
import { toast } from "sonner";

const CLASSES = ["Nursery","KG","1","2","3","4","5","6","7","8","9","10","11","12"];

const EMPTY: LessonPlanInput = { subject: "", className: "", topic: "", date: "", content: "" };

export default function LessonPlansPage() {
  const { loading, authenticated } = useTeacherAuth();
  const [, setLocation] = useLocation();
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<LessonPlanInput>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !authenticated) setLocation("/teacher/login");
  }, [loading, authenticated, setLocation]);

  useEffect(() => {
    if (!authenticated) return;
    fetchLessonPlans()
      .then(setPlans)
      .catch(() => toast.error("Failed to load lesson plans"))
      .finally(() => setFetching(false));
  }, [authenticated]);

  function openNew() { setForm(EMPTY); setEditId(null); setShowForm(true); }
  function openEdit(p: LessonPlan) {
    setForm({ subject: p.subject, className: p.className, topic: p.topic, date: p.date, content: p.content });
    setEditId(p.id);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.subject || !form.className || !form.topic || !form.date || !form.content) {
      toast.error("All fields are required");
      return;
    }
    setSaving(true);
    try {
      if (editId) {
        const updated = await updateLessonPlan(editId, form);
        setPlans((prev) => prev.map((p) => (p.id === editId ? updated : p)));
        toast.success("Lesson plan updated");
      } else {
        const created = await createLessonPlan(form);
        setPlans((prev) => [created, ...prev]);
        toast.success("Lesson plan created");
      }
      setShowForm(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this lesson plan?")) return;
    try {
      await deleteLessonPlan(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  if (loading) return null;
  if (!authenticated) return null;

  return (
    <TeacherLayout title="Lesson Plans">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-500 text-sm">{plans.length} lesson plan{plans.length !== 1 ? "s" : ""}</p>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold"
          style={{ backgroundColor: "#1a3a6b" }}
        >
          <Plus size={16} /> Add Lesson Plan
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: "#1a3a6b" }}>
              <h2 className="text-white font-bold">{editId ? "Edit Lesson Plan" : "New Lesson Plan"}</h2>
              <button onClick={() => setShowForm(false)} className="text-white/70 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Subject", key: "subject", type: "text", placeholder: "e.g. Mathematics" },
                { label: "Topic", key: "topic", type: "text", placeholder: "e.g. Quadratic Equations" },
                { label: "Date", key: "date", type: "date", placeholder: "" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                  <input
                    type={type}
                    value={form[key as keyof LessonPlanInput]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Class</label>
                <select
                  value={form.className}
                  onChange={(e) => setForm((f) => ({ ...f, className: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select class</option>
                  {CLASSES.map((c) => <option key={c} value={c}>Class {c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Content / Plan</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  rows={5}
                  placeholder="Describe the lesson plan in detail…"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-70"
                style={{ backgroundColor: "#1a3a6b" }}
              >
                {saving ? "Saving…" : editId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {fetching ? (
        <div className="text-center py-16 text-gray-400">Loading…</div>
      ) : plans.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No lesson plans yet. Click "Add Lesson Plan" to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {plans.map((p) => (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white" style={{ backgroundColor: "#1a3a6b" }}>
                <BookOpen size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">{p.topic}</h3>
                    <p className="text-gray-500 text-xs mt-0.5">{p.subject} · Class {p.className} · {p.date}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => openEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={15} /></button>
                  </div>
                </div>
                <p className="text-gray-600 text-xs mt-2 line-clamp-2">{p.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </TeacherLayout>
  );
}
