import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";
import {
  fetchHomework,
  createHomework,
  updateHomework,
  deleteHomework,
  type HomeworkItem,
  type HomeworkInput,
} from "@/lib/teacherApi";
import { Plus, Pencil, Trash2, X, ClipboardList } from "lucide-react";
import { toast } from "sonner";

const CLASSES = ["Nursery","KG","1","2","3","4","5","6","7","8","9","10","11","12"];
const EMPTY: HomeworkInput = { subject: "", className: "", title: "", description: "", dueDate: "" };

export default function HomeworkPage() {
  const { loading, authenticated } = useTeacherAuth();
  const [, setLocation] = useLocation();
  const [items, setItems] = useState<HomeworkItem[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<HomeworkInput>(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !authenticated) setLocation("/teacher/login");
  }, [loading, authenticated, setLocation]);

  useEffect(() => {
    if (!authenticated) return;
    fetchHomework()
      .then(setItems)
      .catch(() => toast.error("Failed to load homework"))
      .finally(() => setFetching(false));
  }, [authenticated]);

  function openNew() { setForm(EMPTY); setEditId(null); setShowForm(true); }
  function openEdit(h: HomeworkItem) {
    setForm({ subject: h.subject, className: h.className, title: h.title, description: h.description, dueDate: h.dueDate });
    setEditId(h.id);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.subject || !form.className || !form.title || !form.description || !form.dueDate) {
      toast.error("All fields are required");
      return;
    }
    setSaving(true);
    try {
      if (editId) {
        const updated = await updateHomework(editId, form);
        setItems((prev) => prev.map((h) => (h.id === editId ? updated : h)));
        toast.success("Homework updated");
      } else {
        const created = await createHomework(form);
        setItems((prev) => [created, ...prev]);
        toast.success("Homework created");
      }
      setShowForm(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this homework?")) return;
    try {
      await deleteHomework(id);
      setItems((prev) => prev.filter((h) => h.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  if (loading || !authenticated) return null;

  return (
    <TeacherLayout title="Homework">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-500 text-sm">{items.length} assignment{items.length !== 1 ? "s" : ""}</p>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold"
          style={{ backgroundColor: "#2563eb" }}
        >
          <Plus size={16} /> Create Homework
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: "#2563eb" }}>
              <h2 className="text-white font-bold">{editId ? "Edit Homework" : "New Homework"}</h2>
              <button onClick={() => setShowForm(false)} className="text-white/70 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Title", key: "title", type: "text", placeholder: "e.g. Chapter 5 Exercises" },
                { label: "Subject", key: "subject", type: "text", placeholder: "e.g. Science" },
                { label: "Due Date", key: "dueDate", type: "date", placeholder: "" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                  <input
                    type={type}
                    value={form[key as keyof HomeworkInput]}
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
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description / Instructions</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={4}
                  placeholder="Describe the homework assignment…"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-70" style={{ backgroundColor: "#2563eb" }}>
                {saving ? "Saving…" : editId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {fetching ? (
        <div className="text-center py-16 text-gray-400">Loading…</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <ClipboardList size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No homework assigned yet. Click "Create Homework" to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((h) => (
            <div key={h.id} className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-white" style={{ backgroundColor: "#2563eb" }}>
                <ClipboardList size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm">{h.title}</h3>
                    <p className="text-gray-500 text-xs mt-0.5">{h.subject} · Class {h.className} · Due: {h.dueDate}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => openEdit(h)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(h.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={15} /></button>
                  </div>
                </div>
                <p className="text-gray-600 text-xs mt-2 line-clamp-2">{h.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </TeacherLayout>
  );
}
