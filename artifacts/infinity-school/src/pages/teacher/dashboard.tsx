import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useLocation } from "wouter";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";
import {
  BookOpen,
  ClipboardList,
  FolderOpen,
  Bell,
  ArrowRight,
} from "lucide-react";
import {
  fetchLessonPlans,
  fetchHomework,
  fetchStudyMaterials,
  fetchNotices,
} from "@/lib/teacherApi";

interface Stats {
  lessonPlans: number;
  homework: number;
  studyMaterials: number;
  notices: number;
}

export default function TeacherDashboard() {
  const { teacher, loading, authenticated } = useTeacherAuth();
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState<Stats>({ lessonPlans: 0, homework: 0, studyMaterials: 0, notices: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !authenticated) {
      setLocation("/teacher/login");
    }
  }, [loading, authenticated, setLocation]);

  useEffect(() => {
    if (!authenticated) return;
    Promise.all([
      fetchLessonPlans(),
      fetchHomework(),
      fetchStudyMaterials(),
      fetchNotices(),
    ])
      .then(([lp, hw, sm, nt]) => {
        setStats({ lessonPlans: lp.length, homework: hw.length, studyMaterials: sm.length, notices: nt.length });
      })
      .catch(() => {})
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

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const cards = [
    { label: "Lesson Plans", count: stats.lessonPlans, icon: <BookOpen size={28} />, color: "#1a3a6b", href: "/teacher/lesson-plans" },
    { label: "Homework Assigned", count: stats.homework, icon: <ClipboardList size={28} />, color: "#2563eb", href: "/teacher/homework" },
    { label: "Study Materials", count: stats.studyMaterials, icon: <FolderOpen size={28} />, color: "#16a34a", href: "/teacher/study-material" },
    { label: "Latest Notices", count: stats.notices, icon: <Bell size={28} />, color: "#d97706", href: "/teacher/notices" },
  ];

  return (
    <TeacherLayout title="Dashboard">
      {/* Welcome banner */}
      <div
        className="rounded-xl p-6 mb-6 text-white"
        style={{ background: "linear-gradient(135deg, #1a3a6b, #2563eb)" }}
      >
        <p className="text-blue-200 text-sm mb-1">👋 Welcome back,</p>
        <h2 className="text-2xl font-bold">{teacher?.name ?? "Teacher"}</h2>
        <p className="text-blue-200 text-sm mt-1">{teacher?.designation ?? ""}</p>
        <p className="text-blue-100 text-xs mt-3 flex items-center gap-1">
          📅 {today}
        </p>
      </div>

      {/* Stats cards */}
      <h3 className="text-base font-bold text-gray-700 mb-4">Quick Summary</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <a className="block bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: card.color }}>
                  {card.icon}
                </div>
                <ArrowRight size={18} className="text-gray-300 group-hover:text-gray-500 transition-colors mt-1" />
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">
                {statsLoading ? "—" : card.count}
              </div>
              <div className="text-sm text-gray-500">{card.label}</div>
            </a>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <h3 className="text-base font-bold text-gray-700 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { href: "/teacher/lesson-plans", label: "Add New Lesson Plan", color: "#1a3a6b" },
          { href: "/teacher/homework", label: "Create Homework", color: "#2563eb" },
          { href: "/teacher/study-material", label: "Upload Study Material", color: "#16a34a" },
          { href: "/teacher/notices", label: "View Notices", color: "#d97706" },
        ].map((a) => (
          <Link key={a.href} href={a.href}>
            <a
              className="flex items-center justify-between px-5 py-4 rounded-xl text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
              style={{ backgroundColor: a.color }}
            >
              {a.label}
              <ArrowRight size={18} />
            </a>
          </Link>
        ))}
      </div>
    </TeacherLayout>
  );
}
