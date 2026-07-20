import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";
import { Clock, BookOpen, Layers } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface TimetableSlot {
  id: number;
  dayOfWeek: string;
  periodNumber: number;
  subject: string;
  className: string;
  section: string;
  startTime: string;
  endTime: string;
}

const API = `${import.meta.env.BASE_URL}api/teacher`.replace(/\/+/g, "/").replace(/\/$/, "");

async function fetchTimetable(): Promise<TimetableSlot[]> {
  const token = localStorage.getItem("teacher_token");
  const res = await fetch(`${API}/timetable`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to load timetable");
  return res.json();
}

export default function TeacherTimetable() {
  const { loading, authenticated } = useTeacherAuth();
  const [, setLocation] = useLocation();
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [fetching, setFetching] = useState(true);
  const [activeDay, setActiveDay] = useState<string>("");

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    setActiveDay(today);
  }, []);

  useEffect(() => {
    if (!loading && !authenticated) setLocation("/teacher/login");
  }, [loading, authenticated, setLocation]);

  useEffect(() => {
    if (!authenticated) return;
    fetchTimetable()
      .then(setSlots)
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [authenticated]);

  if (loading) return null;

  const daySlots = slots
    .filter((s) => s.dayOfWeek === activeDay)
    .sort((a, b) => a.periodNumber - b.periodNumber);

  const todaySlots = slots.filter(
    (s) => s.dayOfWeek === new Date().toLocaleDateString("en-US", { weekday: "long" })
  );

  const subjectColors = ["#1a3a6b", "#2563eb", "#16a34a", "#d97706", "#7c3aed", "#db2777", "#0891b2", "#059669"];

  return (
    <TeacherLayout title="Timetable">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-2xl font-bold text-[#1a3a6b]">{slots.length}</p>
          <p className="text-sm text-gray-500">Total Periods / Week</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-2xl font-bold text-[#d97706]">{todaySlots.length}</p>
          <p className="text-sm text-gray-500">Today's Classes</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <p className="text-2xl font-bold text-[#16a34a]">
            {[...new Set(slots.map((s) => s.subject))].length}
          </p>
          <p className="text-sm text-gray-500">Subjects</p>
        </div>
      </div>

      {/* Day Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-100">
          {DAYS.map((day) => {
            const count = slots.filter((s) => s.dayOfWeek === day).length;
            const isToday = day === new Date().toLocaleDateString("en-US", { weekday: "long" });
            return (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeDay === day
                    ? "border-[#1a3a6b] text-[#1a3a6b] bg-blue-50"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {day.slice(0, 3)}
                {isToday && <span className="ml-1 text-[10px] text-[#d97706] font-bold">TODAY</span>}
                {count > 0 && (
                  <span className="ml-1.5 bg-gray-100 text-gray-600 text-[10px] rounded-full px-1.5 py-0.5">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-4">
          {fetching ? (
            <div className="text-center py-12 text-gray-400">Loading timetable…</div>
          ) : daySlots.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No classes scheduled</p>
              <p className="text-sm text-gray-400 mt-1">No timetable entries for {activeDay}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {daySlots.map((slot, i) => (
                <div
                  key={slot.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ backgroundColor: subjectColors[i % subjectColors.length] }}
                  >
                    {slot.periodNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-800">{slot.subject}</span>
                      <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">
                        {slot.className} – {slot.section}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                      <Clock size={12} />
                      <span>{slot.startTime} – {slot.endTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Weekly Summary */}
      {!fetching && slots.length > 0 && (
        <div className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Layers size={18} className="text-[#1a3a6b]" />
            Weekly Overview
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left text-gray-500 font-medium pb-2 pr-4">Day</th>
                  {Array.from({ length: Math.max(...slots.map((s) => s.periodNumber)) }, (_, i) => (
                    <th key={i} className="text-center text-gray-500 font-medium pb-2 px-2 min-w-[80px]">
                      P{i + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS.map((day) => {
                  const dayData = slots.filter((s) => s.dayOfWeek === day);
                  const maxPeriod = slots.length > 0 ? Math.max(...slots.map((s) => s.periodNumber)) : 0;
                  return (
                    <tr key={day} className="border-t border-gray-50">
                      <td className="py-2 pr-4 text-gray-700 font-medium whitespace-nowrap">{day.slice(0, 3)}</td>
                      {Array.from({ length: maxPeriod }, (_, i) => {
                        const slot = dayData.find((s) => s.periodNumber === i + 1);
                        return (
                          <td key={i} className="py-2 px-2 text-center">
                            {slot ? (
                              <span className="inline-block bg-blue-50 text-blue-700 text-xs rounded px-2 py-1 max-w-[80px] truncate">
                                {slot.subject}
                              </span>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </TeacherLayout>
  );
}
