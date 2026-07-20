import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  Users,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  GraduationCap,
  Bell,
  ClipboardList,
  CalendarDays,
  UserCheck,
  FileText,
  CheckSquare,
} from "lucide-react";
import logoImg from "@/assets/logo.png";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Teachers", icon: Users, path: "/admin/teachers" },
  { label: "Students", icon: GraduationCap, path: "/admin/students" },
  { label: "Admission Inquiries", icon: ClipboardList, path: "/admin/admissions" },
  { label: "Notice Board", icon: Bell, path: "/admin/notices" },
  { label: "Leave Requests", icon: UserCheck, path: "/admin/leave" },
  { label: "Timetable", icon: CalendarDays, path: "/admin/timetable" },
  { label: "Teacher Tasks", icon: CheckSquare, path: "/admin/teacher-tasks" },
  { label: "Public Disclosure", icon: FileText, path: "/admin/disclosures" },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const { email, logout } = useAdminAuth();

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-30 flex flex-col
          bg-[#1a3a6b] text-white shadow-2xl transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:h-screen`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
          <div className="bg-white rounded-lg px-2 py-1.5">
            <img src={logoImg} alt="IPS Logo" className="h-7 w-auto object-contain" />
          </div>
          <div className="leading-tight min-w-0">
            <p className="font-bold text-xs tracking-wide truncate">ADMIN PANEL</p>
            <p className="text-[10px] text-white/60 uppercase tracking-widest">Infinity Public School</p>
          </div>
          <button
            className="ml-auto md:hidden text-white/60 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ label, icon: Icon, path }) => {
            const active = location === path;
            return (
              <Link key={path} href={path}>
                <div
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all text-sm font-medium
                    ${active
                      ? "bg-yellow-400 text-[#1a3a6b] shadow"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <Icon size={17} />
                  {label}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="bg-yellow-400 text-[#1a3a6b] rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
              A
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate">{email ?? "Admin"}</p>
              <p className="text-[10px] text-white/50">Administrator</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-colors"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 md:overflow-auto">
        {/* Top bar (mobile) */}
        <header className="md:hidden flex items-center gap-3 bg-white shadow px-4 py-3">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <LayoutDashboard size={16} className="text-[#1a3a6b]" />
            <span className="font-bold text-[#1a3a6b] text-sm">Admin Panel</span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
