import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Search, Filter, X, ClipboardList, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

interface Admission {
  id: number;
  admissionId: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  parentMobile: string;
  parentEmail: string;
  applyingForClass: string;
  inquiryStatus: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: "New", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  contacted: { label: "Contacted", color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" },
  confirmed: { label: "Confirmed", color: "text-green-700", bg: "bg-green-50 border-green-200" },
  closed: { label: "Closed", color: "text-gray-600", bg: "bg-gray-100 border-gray-200" },
};

const BASE = `${import.meta.env.BASE_URL}api/admin`.replace(/\/+/g, "/").replace(/\/$/, "");
function token() { return localStorage.getItem("admin_token"); }

export default function AdminAdmissions() {
  const { authenticated, loading } = useAdminAuth();
  const [, navigate] = useLocation();
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => { if (!loading && !authenticated) navigate("/admin/login"); }, [loading, authenticated]);

  async function load(pg = 1) {
    setFetching(true);
    const params = new URLSearchParams({ page: String(pg) });
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    try {
      const res = await fetch(`${BASE}/admissions?${params}`, {
        headers: token() ? { Authorization: `Bearer ${token()}` } : {},
      });
      const data = await res.json();
      setAdmissions(data.admissions);
      setTotal(data.total);
      setPage(data.page);
      setPages(data.pages);
    } catch { toast.error("Failed to load inquiries"); }
    finally { setFetching(false); }
  }

  useEffect(() => { if (authenticated) load(1); }, [authenticated]);

  function handleSearch(e: React.FormEvent) { e.preventDefault(); load(1); }

  async function updateStatus(id: number, inquiryStatus: string) {
    setUpdatingId(id);
    try {
      const res = await fetch(`${BASE}/admissions/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...(token() ? { Authorization: `Bearer ${token()}` } : {}) },
        body: JSON.stringify({ inquiryStatus }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setAdmissions((prev) => prev.map((a) => (a.id === id ? { ...a, inquiryStatus } : a)));
      toast.success("Status updated");
    } catch { toast.error("Failed to update status"); }
    finally { setUpdatingId(null); }
  }

  const counts = Object.keys(STATUS_CONFIG).reduce((acc, s) => {
    acc[s] = admissions.filter((a) => a.inquiryStatus === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Admission Inquiries</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track all admission form submissions</p>
        </div>

        {/* Status summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => { setStatusFilter(statusFilter === key ? "" : key); }}
              className={`rounded-xl border p-3 text-center transition-all ${
                statusFilter === key ? `${cfg.bg} border-current` : "bg-white border-gray-100 hover:border-gray-200"
              }`}
            >
              <p className={`text-2xl font-bold ${cfg.color}`}>{counts[key] ?? 0}</p>
              <p className="text-xs text-gray-500 mt-0.5">{cfg.label}</p>
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, or email…"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1a3a6b]"
            />
          </div>
          {(search || statusFilter) && (
            <button type="button" onClick={() => { setSearch(""); setStatusFilter(""); load(1); }}
              className="p-2.5 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50">
              <X size={16} />
            </button>
          )}
          <button type="submit" className="px-4 py-2.5 rounded-lg text-white text-sm font-medium hover:opacity-90" style={{ backgroundColor: "#1a3a6b" }}>
            Search
          </button>
        </form>

        <p className="text-sm text-gray-500 mb-3">{total} total inquiries</p>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {fetching ? (
            <div className="text-center py-12 text-gray-400">Loading…</div>
          ) : admissions.length === 0 ? (
            <div className="text-center py-14">
              <ClipboardList size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No inquiries found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Student</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium hidden sm:table-cell">Parent</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Class</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium hidden lg:table-cell">Date</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {admissions.map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800">{a.studentName}</p>
                          <p className="text-xs text-gray-400">{a.admissionId}</p>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <p className="text-gray-700">{a.fatherName}</p>
                          <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                            <Phone size={11} /> {a.parentMobile}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{a.applyingForClass}</td>
                        <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                          {new Date(a.createdAt).toLocaleDateString("en-IN")}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs rounded-full px-2.5 py-0.5 border font-medium ${STATUS_CONFIG[a.inquiryStatus]?.bg} ${STATUS_CONFIG[a.inquiryStatus]?.color}`}>
                            {STATUS_CONFIG[a.inquiryStatus]?.label ?? a.inquiryStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={a.inquiryStatus}
                            onChange={(e) => updateStatus(a.id, e.target.value)}
                            disabled={updatingId === a.id}
                            className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#1a3a6b] disabled:opacity-50"
                          >
                            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                              <option key={key} value={key}>{cfg.label}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {pages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                  <p className="text-sm text-gray-500">Page {page} of {pages}</p>
                  <div className="flex gap-2">
                    <button disabled={page <= 1} onClick={() => load(page - 1)}
                      className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">
                      Previous
                    </button>
                    <button disabled={page >= pages} onClick={() => load(page + 1)}
                      className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
