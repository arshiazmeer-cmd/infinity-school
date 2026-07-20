import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { UserCheck, Search, X, ExternalLink, CheckCircle2, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface LeaveApplication {
  id: number;
  teacherId: number;
  teacherName: string | null;
  teacherEmail: string | null;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  medicalCertificateUrl: string | null;
  status: string;
  adminRemarks: string | null;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", color: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: <Clock size={13} /> },
  approved: { label: "Approved", color: "bg-green-50 text-green-700 border-green-200", icon: <CheckCircle2 size={13} /> },
  rejected: { label: "Rejected", color: "bg-red-50 text-red-600 border-red-200", icon: <XCircle size={13} /> },
};

const BASE = `${import.meta.env.BASE_URL}api/admin`.replace(/\/+/g, "/").replace(/\/$/, "");
function token() { return localStorage.getItem("admin_token"); }

export default function AdminLeave() {
  const { authenticated, loading } = useAdminAuth();
  const [, navigate] = useLocation();
  const [applications, setApplications] = useState<LeaveApplication[]>([]);
  const [filtered, setFiltered] = useState<LeaveApplication[]>([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [updating, setUpdating] = useState<number | null>(null);
  const [remarkInput, setRemarkInput] = useState<Record<number, string>>({});

  useEffect(() => { if (!loading && !authenticated) navigate("/admin/login"); }, [loading, authenticated]);

  useEffect(() => {
    if (!authenticated) return;
    fetch(`${BASE}/leave-applications`, { headers: token() ? { Authorization: `Bearer ${token()}` } : {} })
      .then((r) => r.json())
      .then((data) => { setApplications(data); setFiltered(data); })
      .catch(() => toast.error("Failed to load leave applications"))
      .finally(() => setFetching(false));
  }, [authenticated]);

  useEffect(() => {
    let data = applications;
    if (search) {
      const lower = search.toLowerCase();
      data = data.filter((a) =>
        (a.teacherName ?? "").toLowerCase().includes(lower) ||
        (a.teacherEmail ?? "").toLowerCase().includes(lower) ||
        a.leaveType.toLowerCase().includes(lower)
      );
    }
    if (statusFilter) data = data.filter((a) => a.status === statusFilter);
    setFiltered(data);
  }, [search, statusFilter, applications]);

  async function updateStatus(id: number, status: string) {
    setUpdating(id);
    const adminRemarks = remarkInput[id] || null;
    try {
      const res = await fetch(`${BASE}/leave-applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...(token() ? { Authorization: `Bearer ${token()}` } : {}) },
        body: JSON.stringify({ status, adminRemarks }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: updated.status, adminRemarks: updated.adminRemarks } : a)));
      setRemarkInput((p) => { const n = { ...p }; delete n[id]; return n; });
      toast.success(`Leave ${status}`);
    } catch { toast.error("Failed to update status"); }
    finally { setUpdating(null); }
  }

  function daysCount(start: string, end: string) {
    return Math.max(1, Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1);
  }

  const counts = Object.keys(STATUS_CONFIG).reduce((acc, s) => {
    acc[s] = applications.filter((a) => a.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Leave Requests</h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage teacher leave applications</p>
        </div>

        {/* Status summary cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <button key={key} onClick={() => setStatusFilter(statusFilter === key ? "" : key)}
              className={`rounded-xl border p-4 text-center transition-all ${statusFilter === key ? cfg.color : "bg-white border-gray-100 hover:border-gray-200"}`}>
              <p className="text-2xl font-bold text-gray-800">{counts[key] ?? 0}</p>
              <p className="text-sm text-gray-500 mt-0.5">{cfg.label}</p>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by teacher name or leave type…"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1a3a6b]" />
          </div>
          {(search || statusFilter) && (
            <button onClick={() => { setSearch(""); setStatusFilter(""); }} className="p-2.5 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50">
              <X size={15} />
            </button>
          )}
        </div>

        {/* Applications list */}
        <div className="space-y-4">
          {fetching ? (
            <div className="bg-white rounded-xl p-12 text-center text-gray-400 border border-gray-100">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
              <UserCheck size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No leave applications found</p>
            </div>
          ) : (
            filtered.map((a) => (
              <div key={a.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                      <span className="font-semibold text-gray-800">{a.teacherName ?? "Unknown Teacher"}</span>
                      <span className={`flex items-center gap-1 text-xs rounded-full px-2.5 py-0.5 border font-medium ${STATUS_CONFIG[a.status]?.color}`}>
                        {STATUS_CONFIG[a.status]?.icon}
                        {STATUS_CONFIG[a.status]?.label ?? a.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{a.teacherEmail}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <span className="bg-blue-50 text-blue-700 rounded-lg px-2 py-0.5 text-xs font-medium">{a.leaveType}</span>
                      <span>📅 {new Date(a.startDate).toLocaleDateString("en-IN")} – {new Date(a.endDate).toLocaleDateString("en-IN")}</span>
                      <span className="text-gray-400">({daysCount(a.startDate, a.endDate)} day{daysCount(a.startDate, a.endDate) > 1 ? "s" : ""})</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 border-l-2 border-gray-200 pl-3">{a.reason}</p>
                    {a.medicalCertificateUrl && (
                      <a href={`${import.meta.env.BASE_URL}${a.medicalCertificateUrl}`.replace(/\/+/g, "/")}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-2 text-xs text-blue-500 hover:underline">
                        <ExternalLink size={12} /> View Medical Certificate
                      </a>
                    )}
                    {a.adminRemarks && (
                      <div className="mt-2 bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-600">
                        <span className="font-medium">Remarks: </span>{a.adminRemarks}
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-2">Applied: {new Date(a.createdAt).toLocaleDateString("en-IN")}</p>
                  </div>

                  {/* Action panel */}
                  {a.status === "pending" && (
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <input
                        value={remarkInput[a.id] ?? ""}
                        onChange={(e) => setRemarkInput((p) => ({ ...p, [a.id]: e.target.value }))}
                        placeholder="Add remarks (optional)"
                        className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1a3a6b]"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(a.id, "approved")} disabled={updating === a.id}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 text-white rounded-lg py-2 text-xs font-medium hover:bg-green-600 disabled:opacity-50">
                          <CheckCircle2 size={14} /> Approve
                        </button>
                        <button onClick={() => updateStatus(a.id, "rejected")} disabled={updating === a.id}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-red-500 text-white rounded-lg py-2 text-xs font-medium hover:bg-red-600 disabled:opacity-50">
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  )}
                  {a.status !== "pending" && (
                    <button onClick={() => updateStatus(a.id, "pending")} disabled={updating === a.id}
                      className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50">
                      Reset to Pending
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
