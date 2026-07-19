import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import { loginAdmin, isAdminLoggedIn } from "@/lib/adminApi";
import { toast } from "sonner";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminLoggedIn()) navigate("/admin/dashboard");
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await loginAdmin(email, password);
      navigate("/admin/dashboard");
    } catch (err: any) {
      toast.error(err.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a3a6b] p-4"
      style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #1e4a8a 0%, #0f2447 100%)" }}>
      <div className="w-full max-w-sm">
        {/* Card header */}
        <div className="bg-[#1a3a6b] rounded-t-2xl px-8 pt-8 pb-6 text-center border-b border-white/10">
          <div className="inline-flex items-center justify-center bg-yellow-400 rounded-full w-16 h-16 mb-4 shadow-lg">
            <Shield size={28} className="text-[#1a3a6b]" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-white/60 text-sm mt-1">Infinity Public School</p>
        </div>

        {/* Card body */}
        <div className="bg-white rounded-b-2xl px-8 py-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ipskursi.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/40 focus:border-[#1a3a6b]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/40 focus:border-[#1a3a6b]"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a3a6b] hover:bg-[#142d54] text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            © {new Date().getFullYear()} Infinity Public School, Kursi, Barabanki
          </p>
        </div>
      </div>
    </div>
  );
}
