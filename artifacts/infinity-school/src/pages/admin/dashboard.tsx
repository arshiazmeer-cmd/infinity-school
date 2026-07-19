import { useEffect } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Users, UserCheck, UserX, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchTeachers } from "@/lib/adminApi";

export default function AdminDashboard() {
  const { authenticated, loading } = useAdminAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && !authenticated) navigate("/admin/login");
  }, [loading, authenticated]);

  const { data: teachers = [] } = useQuery({
    queryKey: ["admin-teachers"],
    queryFn: fetchTeachers,
    enabled: authenticated,
  });

  const active = teachers.filter((t) => t.isActive).length;
  const inactive = teachers.filter((t) => !t.isActive).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#1a3a6b]" size={32} />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of teacher accounts</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Teachers", value: teachers.length, icon: Users, color: "bg-blue-50 text-blue-700 border-blue-100" },
            { label: "Active", value: active, icon: UserCheck, color: "bg-green-50 text-green-700 border-green-100" },
            { label: "Inactive", value: inactive, icon: UserX, color: "bg-red-50 text-red-700 border-red-100" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={`rounded-xl border p-5 flex items-center gap-4 bg-white shadow-sm`}>
              <div className={`rounded-full p-3 ${color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick nav */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/admin/teachers")}
              className="px-5 py-2.5 bg-[#1a3a6b] text-white rounded-lg text-sm font-medium hover:bg-[#142d54] transition-colors"
            >
              Manage Teachers
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
