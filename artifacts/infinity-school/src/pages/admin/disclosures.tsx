import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { PlusCircle, Trash2, FileText, X, Upload } from "lucide-react";
import { toast } from "sonner";

interface Disclosure {
  id: number;
  category: string;
  title: string;
  fileUrl: string | null;
  fileName: string | null;
  createdAt: string;
}

const CBSE_CATEGORIES = [
  "CBSE Affiliation",
  "Society Registration",
  "NOC from State Government",
  "Recognition Certificate",
  "Building Safety Certificate",
  "Fire Safety Certificate",
  "DEO Certificate",
  "Valid Water & Health Certificate",
  "Fee Structure",
  "Annual Academic Calendar",
  "Mandatory Disclosure Document",
];

const BASE = `${import.meta.env.BASE_URL}api/admin`.replace(/\/+/g, "/").replace(/\/$/, "");
function token() { return localStorage.getItem("admin_token"); }

export default function AdminDisclosures() {
  const { authenticated, loading } = useAdminAuth();
  const [, navigate] = useLocation();
  const [disclosures, setDisclosures] = useState<Disclosure[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ category: CBSE_CATEGORIES[0], title: "", file: null as File | null });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => { if (!loading && !authenticated) navigate("/admin/login"); }, [loading, authenticated]);

  useEffect(() => {
    if (!authenticated) return;
    fetch(`${BASE}/disclosures`, { headers: token() ? { Authorization: `Bearer ${token()}` } : {} })
      .then((r) => r.json())
      .then(setDisclosures)
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [authenticated]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.file) { toast.error("Title and file are required"); return; }
    setSaving(true);
    const fd = new FormData();
    fd.append("category", form.category);
    fd.append("title", form.title);
    fd.append("file", form.file);
    try {
      const res = await fetch(`${BASE}/disclosures`, {
        method: "POST",
        headers: token() ? { Authorization: `Bearer ${token()}` } : {},
        body: fd,
      });
      if (!res.ok) throw new Error("Failed");
      const created = await res.json();
      setDisclosures((p) => [...p, created]);
      setForm({ category: CBSE_CATEGORIES[0], title: "", file: null });
      setShowForm(false);
      toast.success("Document uploaded");
    } catch { toast.error("Failed to upload"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this document?")) return;
    setDeleting(id);
    try {
      await fetch(`${BASE}/disclosures/${id}`, { method: "DELETE", headers: token() ? { Authorization: `Bearer ${token()}` } : {} });
      setDisclosures((p) => p.filter((d) => d.id !== id));
      toast.success("Document deleted");
    } catch { toast.error("Failed to delete"); }
    finally { setDeleting(null); }
  }

  const grouped = CBSE_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = disclosures.filter((d) => d.category === cat);
    return acc;
  }, {} as Record<string, Disclosure[]>);

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Public Disclosure</h1>
            <p className="text-sm text-gray-500 mt-1">Upload CBSE-mandated disclosure documents</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
            style={{ backgroundColor: "#1a3a6b" }}>
            <PlusCircle size={15} /> Upload Document
          </button>
        </div>

        <div className="grid gap-4">
          {CBSE_CATEGORIES.map((cat) => (
            <div key={cat} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                <h3 className="font-semibold text-gray-700 text-sm">{cat}</h3>
                <span className={`text-xs rounded-full px-2.5 py-0.5 ${grouped[cat].length > 0 ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>
                  {grouped[cat].length > 0 ? `${grouped[cat].length} uploaded` : "Pending"}
                </span>
              </div>
              {grouped[cat].length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No document uploaded yet</p>
              ) : (
                <div className="divide-y divide-gray-50">
                  {grouped[cat].map((d) => (
                    <div key={d.id} className="flex items-center gap-3 px-4 py-3">
                      <FileText size={16} className="text-red-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{d.title}</p>
                        {d.fileName && <p className="text-xs text-gray-400">{d.fileName}</p>}
                      </div>
                      {d.fileUrl && (
                        <a href={`${import.meta.env.BASE_URL}${d.fileUrl}`.replace(/\/+/g, "/")}
                          target="_blank" rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline flex-shrink-0">View</a>
                      )}
                      <button onClick={() => handleDelete(d.id)} disabled={deleting === d.id}
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
      </div>

      {/* Upload Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold text-gray-800">Upload Document</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
                <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a3a6b]">
                  {CBSE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Document Title *</label>
                <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a3a6b]"
                  placeholder="e.g. CBSE Affiliation Certificate 2024-25" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">File (PDF or Image) *</label>
                <label className="flex items-center gap-3 border border-dashed border-gray-300 rounded-lg p-3 cursor-pointer hover:border-[#1a3a6b] transition-colors">
                  <Upload size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-500">{form.file ? form.file.name : "Choose file to upload"}</span>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                    onChange={(e) => setForm((p) => ({ ...p, file: e.target.files?.[0] ?? null }))} required />
                </label>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "#1a3a6b" }}>
                  {saving ? "Uploading…" : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
