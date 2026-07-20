import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";
import {
  BookOpen, ClipboardList, FolderOpen, Bell, ArrowRight,
  Clock, CheckCircle2, CalendarDays, AlertCircle,
} from "lucide-react";
import {
  fetchLessonPlans, fetchHomework, fetchStudyMaterials, fetchNotices,
} from "@/lib/teacherApi";

const API = `${import.meta.env.BASE_URL}api/teacher`.replace(/\/+/g, "/").replace(/\/$/, "");
function token() { return localStorage.getItem("teacher_token"); }
const h = () => (token() ? { Authorization: `Bearer ${token()}` } : {});

interface TimetableSlot { id: number; dayOfWeek: string; periodNumber: number; subject: string; className: string; section: string; startTime: string; endTime: string; }
interface TeacherTask { id: number; taskType: string; title: string; status: string; dueDate: string | null; }
interface Notice { id: number; title: string; content: string; postedBy: string; createdAt: string; }

export default function TeacherDashboard() {
  const { teacher, loading, authenticated } = useTeacherAuth();
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState({ lessonPlans: 0, homework: 0, studyMaterials: 0, notices: 0 });
  const [todaySlots, setTodaySlots] = useState<TimetableSlot[]>([]);
  const [pendingTasks, setPendingTasks] = useState<TeacherTask[]>([]);
  const [recentNotices, setRecentNotices] = useState<Notice[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !authenticated) setLocation("/teacher/login");
  }, [loading, authenticated, setLocation]);

  useEffect(() => {
    if (!authenticated) return;
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

    Promise.allSettled([
      fetchLessonPlans(), fetchHomework(), fetchStudyMaterials(), fetchNotices(),
      fetch(`${API}/timetable`, { headers: h() }).then((r) => r.json()),
      fetch(`${API}/tasks`, { headers: h() }).then((r) => r.json()),
    ])
      .then(([lp, hw, sm, nt, tt, tasks]) => {
        if (lp.status === "fulfilled") setStats((p) => ({ ...p, lessonPlans: lp.value.length }));
        if (hw.status === "fulfilled") setStats((p) => ({ ...p, homework: hw.value.length }));
        if (sm.status === "fulfilled") setStats((p) => ({ ...p, studyMaterials: sm.value.length }));
        if (nt.status === "fulfilled") {
          const notices = nt.value as Notice[];
          setStats((p) => ({ ...p, notices: notices.length }));
          setRecentNotices(notices.slice(0, 3));
        }
        if (tt.status === "fulfilled") {
          const slots = (tt.value as TimetableSlot[]).filter((s) => s.dayOfWeek === today);
          setTodaySlots(slots.sort((a, b) => a.periodNumber - b.periodNumber));
        }
        if (tasks.status === "fulfilled") {
          setPendingTasks((tasks.value as TeacherTask[]).filter((t) => t.status === "pending").slice(0, 5));
        }
      })
      .finally(() => setStatsLoading(false));
  }, [authenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#1a3a6b" }}>
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  if (!authenticated) return null;

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const cards = [
    { label: "Lesson Plans", count: stats.lessonPlans, icon: <BookOpen size={26} />, color: "#1a3a6b", href: "/teacher/lesson-plans" },
    { label: "Homework Assigned", count: stats.homework, icon: <ClipboardList size={26} />, color: "#2563eb", href: "/teacher/homework" },
    { label: "Study Materials", count: stats.studyMaterials, icon: <FolderOpen size={26} />, color: "#16a34a", href: "/teacher/study-material" },
    { label: "Notices", count: stats.notices, icon: <Bell size={26} />, color: "#d97706", href: "/teacher/notices" },
  ];

  return (
    <TeacherLayout title="Dashboard">
      {/* Welcome banner */}
      <div className="rounded-xl p-5 mb-6 text-white" style={{ background: "linear-gradient(135deg, #1a3a6b, #2563eb)" }}>
        <p className="text-blue-200 text-sm mb-0.5">👋 Welcome back,</p>
        <h2 className="text-xl font-bold">{teacher?.name ?? "Teacher"}</h2>
        <p className="text-blue-200 text-sm">{teacher?.designation ?? ""}</p>
        <p className="text-blue-100 text-xs mt-2">📅 {today}</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <a className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: card.color }}>
                  {card.icon}
                </div>
                <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-0.5">
                {statsLoading ? "—" : card.count}
              </div>
              <div className="text-xs text-gray-500">{card.label}</div>
            </a>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        {/* Today's Timetable */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <Clock size={16} className="text-[#1a3a6b]" /> Today's Classes
            </h3>
            <Link href="/teacher/timetable">
              <a className="text-xs text-[#1a3a6b] hover:underline flex items-center gap-1">
                View All <ArrowRight size={11} />
              </a>
            </Link>
          </div>
          {statsLoading ? (
            <p className="text-sm text-gray-400 text-center py-4">Loading…</p>
          ) : todaySlots.length === 0 ? (
            <div className="text-center py-6">
              <CalendarDays size={28} className="text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No classes today</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todaySlots.map((s, i) => {
                const colors = ["#1a3a6b","#2563eb","#16a34a","#d97706","#7c3aed","#db2777"];
                return (
                  <div key={s.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                      style={{ backgroundColor: colors[i % colors.length] }}>
                      {s.periodNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{s.subject}</p>
                      <p className="text-xs text-gray-400">{s.className}-{s.section} · {s.startTime}–{s.endTime}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pending Tasks */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <AlertCircle size={16} className="text-orange-500" /> Pending Tasks
              {pendingTasks.length > 0 && (
                <span className="bg-orange-100 text-orange-600 text-xs rounded-full px-2 py-0.5 font-medium">
                  {pendingTasks.length}
                </span>
              )}
            </h3>
            <Link href="/teacher/tasks">
              <a className="text-xs text-[#1a3a6b] hover:underline flex items-center gap-1">
                View All <ArrowRight size={11} />
              </a>
            </Link>
          </div>
          {statsLoading ? (
            <p className="text-sm text-gray-400 text-center py-4">Loading…</p>
          ) : pendingTasks.length === 0 ? (
            <div className="text-center py-6">
              <CheckCircle2 size={28} className="text-green-300 mx-auto mb-2" />
              <p className="text-sm text-green-500 font-medium">All caught up! 🎉</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingTasks.map((t) => (
                <div key={t.id} className="flex items-start gap-2.5 p-2.5 rounded-lg border border-gray-100 hover:border-orange-100 hover:bg-orange-50/30 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 truncate">{t.title}</p>
                    {t.dueDate && (
                      <p className="text-xs text-gray-400 mt-0.5">Due: {new Date(t.dueDate).toLocaleDateString("en-IN")}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Announcements */}
      {recentNotices.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <Bell size={16} className="text-[#d97706]" /> Recent Announcements
            </h3>
            <Link href="/teacher/notices">
              <a className="text-xs text-[#1a3a6b] hover:underline flex items-center gap-1">
                View All <ArrowRight size={11} />
              </a>
            </Link>
          </div>
          <div className="space-y-3">
            {recentNotices.map((n) => (
              <div key={n.id} className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                <p className="text-sm font-medium text-gray-800">{n.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {n.postedBy} · {new Date(n.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <h3 className="text-sm font-semibold text-gray-600 mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { href: "/teacher/lesson-plans", label: "Add Lesson Plan", color: "#1a3a6b" },
          { href: "/teacher/homework", label: "Create Homework", color: "#2563eb" },
          { href: "/teacher/study-material", label: "Upload Material", color: "#16a34a" },
          { href: "/teacher/timetable", label: "View Timetable", color: "#0891b2" },
          { href: "/teacher/tasks", label: "My Tasks", color: "#d97706" },
          { href: "/teacher/leave", label: "Apply Leave", color: "#7c3aed" },
        ].map((a) => (
          <Link key={a.href} href={a.href}>
            <a className="flex items-center justify-between px-4 py-3 rounded-xl text-white text-sm font-medium shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
              style={{ backgroundColor: a.color }}>
              {a.label}
              <ArrowRight size={16} />
            </a>
          </Link>
        ))}
      </div>
    </TeacherLayout>
  );
}
