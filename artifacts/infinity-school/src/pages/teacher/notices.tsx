import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";
import { fetchNotices, type Notice } from "@/lib/teacherApi";
import { Bell, Info } from "lucide-react";
import { toast } from "sonner";

export default function NoticesPage() {
  const { loading, authenticated } = useTeacherAuth();
  const [, setLocation] = useLocation();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !authenticated) setLocation("/teacher/login");
  }, [loading, authenticated, setLocation]);

  useEffect(() => {
    if (!authenticated) return;
    fetchNotices()
      .then(setNotices)
      .catch(() => toast.error("Failed to load notices"))
      .finally(() => setFetching(false));
  }, [authenticated]);

  if (loading || !authenticated) return null;

  return (
    <TeacherLayout title="Notices">
      <div className="flex items-center gap-2 mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <Info size={16} className="text-amber-600 flex-shrink-0" />
        <p className="text-amber-700 text-sm">Notices are posted by the school administration. This is read-only.</p>
      </div>

      {fetching ? (
        <div className="text-center py-16 text-gray-400">Loading…</div>
      ) : notices.length === 0 ? (
        <div className="text-center py-16">
          <Bell size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No notices posted yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((n) => (
            <div key={n.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: "#d97706" }}>
                  <Bell size={18} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{n.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Posted by {n.postedBy} · {new Date(n.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  <p className="text-gray-600 text-sm mt-3 whitespace-pre-wrap">{n.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </TeacherLayout>
  );
}
