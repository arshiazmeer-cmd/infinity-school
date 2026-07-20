import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  Users, UserCheck, UserX, Loader2, GraduationCap, ClipboardList,
  Bell, TrendingUp, ArrowRight,
} from "lucide-react";
import { fetchTeachers } from "@/lib/adminApi";

const BASE = `${import.meta.env.BASE_URL}api/admin`.replace(/\/+/g, "/").replace(/\/$/, "");
function token() { return localStorage.getItem("admin_token"); }

interface StudentStats {
  total: number;
  boys: number;
  girls: number;
  active: number;
  alumni: number;
  classCounts: Record<string, number>;
  recentCount: number;
}

export default function AdminDashboard() {
  const { authenticated, loading } = useAdminAuth();
  const [, navigate] = useLocation();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [studentStats, setStudentStats] = useState<StudentStats | null>(null);
  const [admissionCount, setAdmissionCount] = useState(0);
  const [noticeCount, setNoticeCount] = useState(0);
  const [fetching, setFetching] = useState(true);

  useEffect(() => { if (!loading && !authenticated) navigate("/admin/login"); }, [loading, authenticated]);

  useEffect(() => {
    if (!authenticated) return;
    const h = token() ? { Authorization: `Bearer ${token()}` } : {};
    Promise.allSettled([
      fetchTeachers(),
      fetch(`${BASE}/students/stats`, { headers: h }).then((r) => r.json()),
      fetch(`${BASE}/admissions?page=1`, { headers: h }).then((r) => r.json()),
      fetch(`${BASE}/notices`, { headers: h }).then((r) => r.json()),
    ]).then(([t, s, a, n]) => {
      if (t.status === "fulfilled") setTeachers(t.value);
      if (s.status === "fulfilled") setStudentStats(s.value);
      if (a.status === "fulfilled") setAdmissionCount((a.value as any).total ?? 0);
      if (n.status === "fulfilled") setNoticeCount(Array.isArray(n.value) ? n.value.length : 0);
    }).finally(() => setFetching(false));
  }, [authenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#1a3a6b]" size={32} />
      </div>
    );
  }

  const active = teachers.filter((t) => t.isActive).length;
  const inactive = teachers.filter((t) => !t.isActive).length;

  const topClasses = studentStats
    ? Object.entries(studentStats.classCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
    : [];
  const maxCount = topClasses.length > 0 ? Math.max(...topClasses.map(([, v]) => v)) : 1;

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of Infinity Public School</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Students", value: studentStats?.total ?? "—", icon: GraduationCap, color: "bg-blue-50 text-blue-700", iconBg: "bg-blue-100" },
            { label: "Active Students", value: studentStats?.active ?? "—", icon: UserCheck, color: "bg-green-50 text-green-700", iconBg: "bg-green-100" },
            { label: "Total Teachers", value: teachers.length, icon: Users, color: "bg-purple-50 text-purple-700", iconBg: "bg-purple-100" },
            { label: "Admission Inquiries", value: admissionCount, icon: ClipboardList, color: "bg-orange-50 text-orange-700", iconBg: "bg-orange-100" },
          ].map(({ label, value, icon: Icon, color, iconBg }) => (
            <div key={label} className={`rounded-xl border p-5 flex items-center gap-4 ${color} border-current/20 bg-white shadow-sm`}>
              <div className={`rounded-full p-3 ${iconBg}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{fetching ? "—" : value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Student Breakdown */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-700">Student Breakdown</h2>
              <button onClick={() => navigate("/admin/students")}
                className="text-xs text-[#1a3a6b] hover:underline flex items-center gap-1">
                View All <ArrowRight size={12} />
              </button>
            </div>

            {/* Gender breakdown */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "Total", value: studentStats?.total ?? 0, color: "#1a3a6b" },
                { label: "Boys", value: studentStats?.boys ?? 0, color: "#2563eb" },
                { label: "Girls", value: studentStats?.girls ?? 0, color: "#db2777" },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold" style={{ color }}>{fetching ? "—" : value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Class-wise bar chart */}
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Class-wise Strength</h3>
            {fetching ? (
              <div className="text-center py-6 text-gray-400 text-sm">Loading…</div>
            ) : topClasses.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No students yet</p>
            ) : (
              <div className="space-y-2">
                {topClasses.map(([cls, count]) => (
                  <div key={cls} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-20 flex-shrink-0 text-right truncate">{cls}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div
                        className="h-full rounded-full flex items-center justify-end pr-2 text-[10px] font-bold text-white transition-all"
                        style={{ width: `${(count / maxCount) * 100}%`, backgroundColor: "#1a3a6b" }}
                      >
                        {count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right sidebar stats */}
          <div className="space-y-4">
            {/* Teacher stats */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-700 mb-4">Teacher Stats</h2>
              {[
                { label: "Total", value: teachers.length, color: "text-[#1a3a6b]" },
                { label: "Active", value: active, color: "text-green-600" },
                { label: "Inactive", value: inactive, color: "text-red-500" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-600">{label}</span>
                  <span className={`font-bold ${color}`}>{value}</span>
                </div>
              ))}
            </div>

            {/* Other stats */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-700 mb-4">Content & Activity</h2>
              {[
                { label: "Alumni", value: studentStats?.alumni ?? 0, icon: "🎓" },
                { label: "Recent Admissions (30d)", value: studentStats?.recentCount ?? 0, icon: "📋" },
                { label: "Notices Published", value: noticeCount, icon: "📢" },
              ].map(({ label, value, icon }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-600">{icon} {label}</span>
                  <span className="font-bold text-[#1a3a6b]">{fetching ? "—" : value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-700 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Manage Teachers", path: "/admin/teachers", color: "#1a3a6b" },
              { label: "Student List", path: "/admin/students", color: "#2563eb" },
              { label: "Admission Inquiries", path: "/admin/admissions", color: "#16a34a" },
              { label: "Notice Board", path: "/admin/notices", color: "#d97706" },
              { label: "Leave Requests", path: "/admin/leave", color: "#7c3aed" },
              { label: "Public Disclosure", path: "/admin/disclosures", color: "#0891b2" },
              { label: "Timetable", path: "/admin/timetable", color: "#db2777" },
              { label: "Teacher Tasks", path: "/admin/teacher-tasks", color: "#059669" },
            ].map(({ label, path, color }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-white text-sm font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: color }}
              >
                {label}
                <ArrowRight size={15} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
