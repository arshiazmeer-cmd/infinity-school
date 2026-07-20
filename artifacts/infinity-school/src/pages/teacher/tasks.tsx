import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";
import { CheckCircle2, Circle, ClipboardList, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface TeacherTask {
  id: number;
  taskType: string;
  title: string;
  description: string | null;
  status: string;
  dueDate: string | null;
  createdAt: string;
}

const API = `${import.meta.env.BASE_URL}api/teacher`.replace(/\/+/g, "/").replace(/\/$/, "");

async function fetchTasks(): Promise<TeacherTask[]> {
  const token = localStorage.getItem("teacher_token");
  const res = await fetch(`${API}/tasks`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  if (!res.ok) throw new Error("Failed to load tasks");
  return res.json();
}

async function toggleTask(id: number, status: string): Promise<TeacherTask> {
  const token = localStorage.getItem("teacher_token");
  const res = await fetch(`${API}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

const taskTypeLabels: Record<string, { label: string; color: string }> = {
  homework_pending: { label: "Homework Pending", color: "bg-blue-100 text-blue-700" },
  lesson_plan_pending: { label: "Lesson Plan", color: "bg-purple-100 text-purple-700" },
  attendance_pending: { label: "Attendance", color: "bg-yellow-100 text-yellow-700" },
  exam_duty: { label: "Exam Duty", color: "bg-red-100 text-red-700" },
  admin_assigned: { label: "Admin Task", color: "bg-gray-100 text-gray-700" },
};

export default function TeacherTasks() {
  const { loading, authenticated } = useTeacherAuth();
  const [, setLocation] = useLocation();
  const [tasks, setTasks] = useState<TeacherTask[]>([]);
  const [fetching, setFetching] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  useEffect(() => {
    if (!loading && !authenticated) setLocation("/teacher/login");
  }, [loading, authenticated, setLocation]);

  useEffect(() => {
    if (!authenticated) return;
    fetchTasks()
      .then(setTasks)
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [authenticated]);

  if (loading) return null;

  const filtered = tasks.filter((t) => filter === "all" || t.status === filter);
  const pending = tasks.filter((t) => t.status === "pending").length;
  const completed = tasks.filter((t) => t.status === "completed").length;

  async function handleToggle(task: TeacherTask) {
    const newStatus = task.status === "pending" ? "completed" : "pending";
    try {
      const updated = await toggleTask(task.id, newStatus);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      toast.success(newStatus === "completed" ? "Marked as completed!" : "Marked as pending");
    } catch {
      toast.error("Failed to update task");
    }
  }

  function isOverdue(task: TeacherTask) {
    if (!task.dueDate || task.status === "completed") return false;
    return new Date(task.dueDate) < new Date();
  }

  return (
    <TeacherLayout title="Pending Tasks">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-[#1a3a6b]">{tasks.length}</p>
          <p className="text-sm text-gray-500">Total Tasks</p>
        </div>
        <div className="bg-orange-50 rounded-xl border border-orange-100 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-orange-600">{pending}</p>
          <p className="text-sm text-orange-500">Pending</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-4 shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">{completed}</p>
          <p className="text-sm text-green-500">Completed</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filter tabs */}
        <div className="flex border-b border-gray-100 px-4">
          {(["all", "pending", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                filter === f
                  ? "border-[#1a3a6b] text-[#1a3a6b]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="divide-y divide-gray-50">
          {fetching ? (
            <div className="text-center py-12 text-gray-400">Loading tasks…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ClipboardList size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">
                {filter === "pending" ? "No pending tasks!" : filter === "completed" ? "No completed tasks" : "No tasks assigned"}
              </p>
              {filter === "pending" && (
                <p className="text-sm text-green-500 mt-1">You're all caught up 🎉</p>
              )}
            </div>
          ) : (
            filtered.map((task) => (
              <div
                key={task.id}
                className={`flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors ${
                  task.status === "completed" ? "opacity-60" : ""
                }`}
              >
                <button
                  onClick={() => handleToggle(task)}
                  className="mt-0.5 flex-shrink-0 text-gray-400 hover:text-[#1a3a6b] transition-colors"
                >
                  {task.status === "completed" ? (
                    <CheckCircle2 size={22} className="text-green-500" />
                  ) : (
                    <Circle size={22} />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap">
                    <span
                      className={`font-medium text-gray-800 ${
                        task.status === "completed" ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {task.title}
                    </span>
                    {isOverdue(task) && (
                      <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
                        <AlertCircle size={12} /> Overdue
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-500 mt-0.5">{task.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span
                      className={`text-xs rounded-full px-2 py-0.5 font-medium ${
                        taskTypeLabels[task.taskType]?.color ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {taskTypeLabels[task.taskType]?.label ?? task.taskType}
                    </span>
                    {task.dueDate && (
                      <span className="text-xs text-gray-400">
                        Due: {new Date(task.dueDate).toLocaleDateString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </TeacherLayout>
  );
}
