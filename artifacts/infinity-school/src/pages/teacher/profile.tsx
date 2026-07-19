import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";
import { fetchProfile, updateProfile, changePassword, type TeacherProfile } from "@/lib/teacherApi";
import { UserCircle, Lock, Eye, EyeOff, Save } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { loading, authenticated, refreshTeacher } = useTeacherAuth();
  const [, setLocation] = useLocation();
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [designation, setDesignation] = useState("");
  const [saving, setSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  useEffect(() => {
    if (!loading && !authenticated) setLocation("/teacher/login");
  }, [loading, authenticated, setLocation]);

  useEffect(() => {
    if (!authenticated) return;
    fetchProfile().then((p) => {
      setProfile(p);
      setName(p.name);
      setMobile(p.mobile ?? "");
      setDesignation(p.designation ?? "");
    }).catch(() => toast.error("Failed to load profile"));
  }, [authenticated]);

  async function handleSaveProfile() {
    if (!name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      const updated = await updateProfile({ name, mobile, designation });
      setProfile(updated);
      await refreshTeacher();
      toast.success("Profile updated successfully");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }
    if (newPassword.length < 6) { toast.error("New password must be at least 6 characters"); return; }
    if (newPassword !== confirmPassword) { toast.error("New passwords do not match"); return; }
    setChangingPw(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success("Password changed successfully");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setChangingPw(false);
    }
  }

  if (loading || !authenticated) return null;

  return (
    <TeacherLayout title="My Profile">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile info card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 flex items-center gap-3 border-b" style={{ backgroundColor: "#1a3a6b" }}>
            <UserCircle size={20} className="text-white" />
            <h2 className="font-bold text-white">Profile Information</h2>
          </div>

          <div className="p-6">
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: "#f0c050" }}>
                {name.charAt(0).toUpperCase() || "T"}
              </div>
              <div>
                <p className="font-bold text-gray-800">{profile?.name ?? "—"}</p>
                <p className="text-gray-500 text-sm">{profile?.email}</p>
                <p className="text-gray-400 text-xs">Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "—"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={profile?.email ?? ""}
                  disabled
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed. Contact administration.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Senior Mathematics Teacher"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-70"
              style={{ backgroundColor: "#1a3a6b" }}
            >
              <Save size={16} />
              {saving ? "Saving…" : "Save Profile"}
            </button>
          </div>
        </div>

        {/* Change password card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 flex items-center gap-3 border-b" style={{ backgroundColor: "#374151" }}>
            <Lock size={20} className="text-white" />
            <h2 className="font-bold text-white">Change Password</h2>
          </div>
          <div className="p-6 space-y-4">
            {[
              { label: "Current Password", value: currentPassword, onChange: setCurrentPassword, show: showCurrent, toggle: () => setShowCurrent((v) => !v) },
              { label: "New Password", value: newPassword, onChange: setNewPassword, show: showNew, toggle: () => setShowNew((v) => !v) },
              { label: "Confirm New Password", value: confirmPassword, onChange: setConfirmPassword, show: showNew, toggle: () => setShowNew((v) => !v) },
            ].map(({ label, value, onChange, show, toggle }, i) => (
              <div key={i}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-gray-500"
                  />
                  <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            ))}
            {newPassword && newPassword.length < 6 && (
              <p className="text-red-500 text-xs">Password must be at least 6 characters.</p>
            )}
            <button
              onClick={handleChangePassword}
              disabled={changingPw}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-semibold disabled:opacity-70"
              style={{ backgroundColor: "#374151" }}
            >
              <Lock size={16} />
              {changingPw ? "Changing…" : "Change Password"}
            </button>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
}
