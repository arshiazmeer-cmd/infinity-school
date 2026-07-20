import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { PlusCircle, Pencil, Trash2, X, Upload, FileText, Image, Bell } from "lucide-react";
import { toast } from "sonner";

interface Notice {
  id: number;
  title: string;
  content: string;
  postedBy: string;
  fileUrl: string | null;
  fileType: string | null;
  publishDate: string | null;
  expiryDate: string | null;
  createdAt: string;
}

const BASE = `${import.meta.env.BASE_URL}api/admin`.replace(/\/+/g, "/").replace(/\/$/, "");

function token() { return localStorage.getItem("admin_token"); }
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { ...(token() ? { Authorization: `Bearer ${token()}` } : {}), ...(init?.headers ?? {}) },
  });
  if (!res.ok) { const b = await res.json().catch(() => ({})); throw new Error((b as any).error ?? `HTTP ${res.status}`); }
  return res.json();
}

const EMPTY_FORM = { title: "", content: "", postedBy: "Administration", publishDate: "", expiryDate: "", file: null as File | null };

export default function AdminNotices() {
  const { authenticated, loading } = useAdminAuth();
  const [, navigate] = useLocation();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => { if (!loading && !authenticated) navigate("/admin/login"); }, [loading, authenticated]);

  useEffect(() => {
    if (!authenticated) return;
    apiFetch<Notice[]>("/notices").then(setNotices).catch(() => {}).finally(() => setFetching(false));
  }, [authenticated]);

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setShowForm(true);
  }

  function openEdit(n: Notice) {
    setEditing(n);
    setForm({
      title: n.title,
      content: n.content,
      postedBy: n.postedBy,
      publishDate: n.publishDate ? n.publishDate.slice(0, 10) : "",
      expiryDate: n.expiryDate ? n.expiryDate.slice(0, 10) : "",
      file: null,
    });
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) { toast.error("Title and content are required"); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("content", form.content);
      fd.append("postedBy", form.postedBy);
      if (form.publishDate) fd.append("publishDate", form.publishDate);
      if (form.expiryDate) fd.append("expiryDate", form.expiryDate);
      if (form.file) fd.append("file", form.file);

      if (editing) {
        const res = await fetch(`${BASE}/notices/${editing.id}`, {
          method: "PUT",
          headers: token() ? { Authorization: `Bearer ${token()}` } : {},
          body: fd,
        });
        const updated = await res.json();
        setNotices((prev) => prev.map((n) => (n.id === editing.id ? updated : n)));
        toast.success("Notice updated");
      } else {
        const res = await fetch(`${BASE}/notices`, {
          method: "POST",
          headers: token() ? { Authorization: `Bearer ${token()}` } : {},
          body: fd,
        });
        const created = await res.json();
        setNotices((prev) => [created, ...prev]);
        toast.success("Notice published");
      }
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this notice?")) return;
    setDeleting(id);
    try {
      await apiFetch(`/notices/${id}`, { method: "DELETE" });
      setNotices((prev) => prev.filter((n) => n.id !== id));
      toast.success("Notice deleted");
    } catch { toast.error("Failed to delete"); }
    finally { setDeleting(null); }
  }

  function isExpired(n: Notice) {
    return n.expiryDate && new Date(n.expiryDate) < new Date();
  }
  function isScheduled(n: Notice) {
    return n.publishDate && new Date(n.publishDate) > new Date();
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Notice Management</h1>
            <p className="text-sm text-gray-500 mt-1">Publish notices that appear on the school website</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium hover:opacity-90"
            style={{ backgroundColor: "#1a3a6b" }}
          >
            <PlusCircle size={16} /> New Notice
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Notices", value: notices.length, color: "text-[#1a3a6b]" },
            { label: "Active", value: notices.filter((n) => !isExpired(n) && !isScheduled(n)).length, color: "text-green-600" },
            { label: "Expired", value: notices.filter(isExpired).length, color: "text-red-500" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        {/* List */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {fetching ? (
            <div className="text-center py-12 text-gray-400">Loading…</div>
          ) : notices.length === 0 ? (
            <div className="text-center py-14">
              <Bell size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No notices yet</p>
              <p className="text-sm text-gray-400 mt-1">Click "New Notice" to publish your first</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Title</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Posted By</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium hidden lg:table-cell">Publish Date</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium hidden lg:table-cell">Expiry</th>
                  <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                  <th className="text-right px-4 py-3 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {notices.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {n.fileType === "pdf" ? (
                          <FileText size={16} className="text-red-400 flex-shrink-0" />
                        ) : n.fileType ? (
                          <Image size={16} className="text-blue-400 flex-shrink-0" />
                        ) : null}
                        <div>
                          <p className="font-medium text-gray-800">{n.title}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[200px]">{n.content}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{n.postedBy}</td>
                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                      {n.publishDate ? new Date(n.publishDate).toLocaleDateString("en-IN") : "Immediate"}
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                      {n.expiryDate ? new Date(n.expiryDate).toLocaleDateString("en-IN") : "No expiry"}
                    </td>
                    <td className="px-4 py-3">
                      {isExpired(n) ? (
                        <span className="bg-red-50 text-red-500 text-xs rounded-full px-2.5 py-0.5 border border-red-100">Expired</span>
                      ) : isScheduled(n) ? (
                        <span className="bg-yellow-50 text-yellow-600 text-xs rounded-full px-2.5 py-0.5 border border-yellow-100">Scheduled</span>
                      ) : (
                        <span className="bg-green-50 text-green-600 text-xs rounded-full px-2.5 py-0.5 border border-green-100">Active</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(n)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500 transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(n.id)}
                          disabled={deleting === n.id}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-bold text-gray-800">{editing ? "Edit Notice" : "New Notice"}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
                <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a3a6b]"
                  placeholder="Notice title" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                <textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                  rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a3a6b] resize-none"
                  placeholder="Notice details..." required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Posted By</label>
                <input value={form.postedBy} onChange={(e) => setForm((p) => ({ ...p, postedBy: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a3a6b]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Publish Date</label>
                  <input type="date" value={form.publishDate} onChange={(e) => setForm((p) => ({ ...p, publishDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a3a6b]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
                  <input type="date" value={form.expiryDate} onChange={(e) => setForm((p) => ({ ...p, expiryDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a3a6b]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Attachment <span className="text-gray-400 font-normal">(PDF or Image)</span>
                </label>
                <label className="flex items-center gap-3 border border-dashed border-gray-300 rounded-lg p-3 cursor-pointer hover:border-[#1a3a6b] transition-colors">
                  <Upload size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {form.file ? form.file.name : editing?.fileUrl ? "Replace existing file" : "Upload file"}
                  </span>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                    onChange={(e) => setForm((p) => ({ ...p, file: e.target.files?.[0] ?? null }))} />
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "#1a3a6b" }}>
                  {saving ? "Saving…" : editing ? "Update Notice" : "Publish Notice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
