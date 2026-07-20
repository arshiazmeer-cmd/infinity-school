import { useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import logoImg from "@/assets/logo.png";
import { loginTeacher } from "@/lib/teacherApi";
import { toast } from "sonner";

export default function TeacherLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function validate(): boolean {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await loginTeacher(email.trim(), password);
      if (rememberMe) {
        // Token already in localStorage; nothing extra needed
      }
      setLocation("/teacher/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(135deg, #1a3a6b 0%, #0f2347 50%, #1a3a6b 100%)",
        fontFamily: "Verdana, Geneva, Tahoma, sans-serif",
      }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 25px 25px, white 2px, transparent 0)",
          backgroundSize: "50px 50px",
        }} />
      </div>

      <div className="w-full max-w-md relative">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 py-8 text-center" style={{ backgroundColor: "#1a3a6b" }}>
            <div className="inline-block bg-white rounded-xl px-4 py-2 mb-4 shadow-lg">
              <img src={logoImg} alt="Infinity Public School" className="h-10 w-auto object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-white">Teacher Login</h1>
            <p className="text-blue-200 text-sm mt-1">Infinity Public School, Kursi</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
                    placeholder="you@school.edu"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm outline-none transition-colors
                      ${errors.email ? "border-red-400 bg-red-50" : "border-gray-300 focus:border-blue-500"}`}
                    style={{ fontFamily: "Verdana, sans-serif" }}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
                    placeholder="Enter your password"
                    className={`w-full pl-10 pr-10 py-3 border rounded-lg text-sm outline-none transition-colors
                      ${errors.password ? "border-red-400 bg-red-50" : "border-gray-300 focus:border-blue-500"}`}
                    style={{ fontFamily: "Verdana, sans-serif" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Remember me + Forgot password */}
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded accent-blue-700"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm font-medium hover:underline"
                  style={{ color: "#1a3a6b" }}
                  onClick={() => toast.info("Please contact the school administration to reset your password.")}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-white font-bold text-sm transition-opacity disabled:opacity-70"
                style={{ backgroundColor: "#1a3a6b" }}
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              © {new Date().getFullYear()} Infinity Public School, Kursi, Barabanki
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
