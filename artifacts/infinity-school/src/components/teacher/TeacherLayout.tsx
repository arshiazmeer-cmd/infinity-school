import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  FolderOpen,
  Bell,
  UserCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import logoImg from "@/assets/logo.png";

interface NavItem {
  href: string;
  icon: ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/teacher/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
  { href: "/teacher/lesson-plans", icon: <BookOpen size={20} />, label: "Lesson Plan" },
  { href: "/teacher/homework", icon: <ClipboardList size={20} />, label: "Homework" },
  { href: "/teacher/study-material", icon: <FolderOpen size={20} />, label: "Study Material" },
  { href: "/teacher/notices", icon: <Bell size={20} />, label: "Notices" },
  { href: "/teacher/profile", icon: <UserCircle size={20} />, label: "My Profile" },
];

interface TeacherLayoutProps {
  children: ReactNode;
  title: string;
}

export function TeacherLayout({ children, title }: TeacherLayoutProps) {
  const [location] = useLocation();
  const { teacher, logout } = useTeacherAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50" style={{ fontFamily: "Verdana, Geneva, Tahoma, sans-serif" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-30 flex flex-col transition-transform duration-300
          lg:static lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ backgroundColor: "#1a3a6b" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
          <div className="bg-white rounded-lg px-2 py-1.5">
            <img src={logoImg} alt="IPS Logo" className="h-7 w-auto object-contain" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-bold text-xs leading-tight truncate">TEACHER PORTAL</p>
            <p className="text-blue-200 text-[10px]">Infinity Public School</p>
          </div>
          <button
            className="ml-auto lg:hidden text-white/70 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Teacher info */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2" style={{ backgroundColor: "#f0c050" }}>
            {teacher?.name?.charAt(0).toUpperCase() ?? "T"}
          </div>
          <p className="text-white font-semibold text-sm truncate">{teacher?.name ?? "Teacher"}</p>
          <p className="text-blue-200 text-xs truncate">{teacher?.designation ?? "Teacher"}</p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer
                    ${active
                      ? "text-white"
                      : "text-blue-200 hover:text-white hover:bg-white/10"
                    }`}
                  style={active ? { backgroundColor: "#f0c050", color: "#1a3a6b" } : {}}
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-300 hover:text-white hover:bg-red-600/30 transition-all duration-150"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} style={{ color: "#1a3a6b" }} />
          </button>
          <h1 className="text-lg font-bold" style={{ color: "#1a3a6b" }}>{title}</h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-gray-500 hidden sm:block">
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
