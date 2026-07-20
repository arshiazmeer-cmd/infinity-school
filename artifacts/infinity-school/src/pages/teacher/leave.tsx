import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";
import { CalendarDays, PlusCircle, X, Upload, Clock } from "lucide-react";
import { toast } from "sonner";

interface LeaveApplication {
  id: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  medicalCertificateUrl: string | null;
  status: string;
  adminRemarks: string | null;
  createdAt: string;
}

const API = `${import.meta.env.BASE_URL}api/teacher`.replace(/\/+/g, "/").replace(/\/$/, "");

async function fetchLeave(): Promise<LeaveApplication[]> {
  const token = localStorage.getItem("teacher_token");
  const res = await fetch(`${API}/leave`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  if (!res.ok) throw new Error("Failed to load leave history");
  return res.json();
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  approved: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
};

const LEAVE_TYPES = ["Casual Leave", "Medical Leave", "Earned Leave", "Unpaid Leave", "Other"];

export default function TeacherLeave() {
  const { loading, authenticated } = useTeacherAuth();
  const [, setLocation] = useLocation();
  const [leaves, setLeaves] = useState<LeaveApplication[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    leaveType: "Casual Leave",
    startDate: "",
    endDate: "",
    reason: "",
    medicalCertificate: null as File | null,
  });

  useEffect(() => {
    if (!loading && !authenticated) setLocation("/teacher/login");
  }, [loading, authenticated, setLocation]);

  useEffect(() => {
    if (!authenticated) return;
    fetchLeave()
      .then(setLeaves)
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [authenticated]);

  if (loading) return null;

  function daysCount(start: string, end: string) {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    return Math.max(1, Math.ceil(diff / 86400000) + 1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.startDate || !form.endDate || !form.reason.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      toast.error("End date must be after start date");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("teacher_token");
      const fd = new FormData();
      fd.append("leaveType", form.leaveType);
      fd.append("startDate", form.startDate);
      fd.append("endDate", form.endDate);
      fd.append("reason", form.reason);
      if (form.medicalCertificate) fd.append("medicalCertificate", form.medicalCertificate);

      const res = await fetch(`${API}/leave`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.error || "Failed to submit");
      }
      const newLeave = await res.json();
      setLeaves((prev) => [newLeave, ...prev]);
      setForm({ leaveType: "Casual Leave", startDate: "", endDate: "", reason: "", medicalCertificate: null });
      setShowForm(false);
      toast.success("Leave application submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit leave");
    } finally {
      setSubmitting(false);
    }
  }

  const pending = leaves.filter((l) => l.status === "pending").length;
  const approved = leaves.filter((l) => l.status === "approved").length;

  return (
    <TeacherLayout title="Leave Application">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-[#1a3a6b]">{leaves.length}</p>
          <p className="text-sm text-gray-500">Total Applied</p>
        </div>
        <div className="bg-yellow-50 rounded-xl border border-yellow-100 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-yellow-600">{pending}</p>
          <p className="text-sm text-yellow-500">Pending</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">{approved}</p>
          <p className="text-sm text-green-500">Approved</p>
        </div>
      </div>

      {/* Apply button */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700">Leave History</h3>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#1a3a6b" }}
        >
          <PlusCircle size={16} />
          Apply for Leave
        </button>
      </div>

      {/* Apply form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold text-gray-800">Apply for Leave</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={22} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Leave Type *</label>
                <select
                  value={form.leaveType}
                  onChange={(e) => setForm((p) => ({ ...p, leaveType: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a3a6b]"
                >
                  {LEAVE_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Date *</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a3a6b]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">End Date *</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a3a6b]"
                    required
                  />
                </div>
              </div>
              {form.startDate && form.endDate && new Date(form.endDate) >= new Date(form.startDate) && (
                <p className="text-sm text-blue-600 font-medium">
                  Duration: {daysCount(form.startDate, form.endDate)} day(s)
                </p>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason *</label>
                <textarea
                  value={form.reason}
                  onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
                  rows={3}
                  placeholder="Describe the reason for your leave..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a3a6b] resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Medical Certificate <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <label className="flex items-center gap-3 border border-dashed border-gray-300 rounded-lg p-3 cursor-pointer hover:border-[#1a3a6b] transition-colors">
                  <Upload size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {form.medicalCertificate ? form.medicalCertificate.name : "Upload PDF or image"}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => setForm((p) => ({ ...p, medicalCertificate: e.target.files?.[0] ?? null }))}
                  />
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "#1a3a6b" }}
                >
                  {submitting ? "Submitting…" : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave History */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {fetching ? (
          <div className="text-center py-12 text-gray-400">Loading…</div>
        ) : leaves.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CalendarDays size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No leave applications yet</p>
            <p className="text-sm text-gray-400 mt-1">Click "Apply for Leave" to submit your first application</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {leaves.map((leave) => (
              <div key={leave.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-800">{leave.leaveType}</span>
                      <span className={`text-xs rounded-full px-2.5 py-0.5 font-medium border ${STATUS_COLORS[leave.status]}`}>
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                      <Clock size={13} />
                      <span>
                        {new Date(leave.startDate).toLocaleDateString("en-IN")} –{" "}
                        {new Date(leave.endDate).toLocaleDateString("en-IN")}
                        <span className="ml-2 text-xs text-gray-400">
                          ({daysCount(leave.startDate, leave.endDate)} day{daysCount(leave.startDate, leave.endDate) > 1 ? "s" : ""})
                        </span>
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    Applied: {new Date(leave.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{leave.reason}</p>
                {leave.adminRemarks && (
                  <div className="mt-2 bg-blue-50 rounded-lg px-3 py-2">
                    <p className="text-xs text-blue-600 font-medium">Admin Remarks:</p>
                    <p className="text-sm text-blue-700">{leave.adminRemarks}</p>
                  </div>
                )}
                {leave.medicalCertificateUrl && (
                  <a
                    href={`${import.meta.env.BASE_URL}${leave.medicalCertificateUrl}`.replace(/\/+/g, "/")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs text-blue-500 hover:underline"
                  >
                    📎 View Medical Certificate
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </TeacherLayout>
  );
}
