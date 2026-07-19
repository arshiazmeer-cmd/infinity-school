import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchTeachers,
  createTeacher,
  updateTeacher,
  resetTeacherPassword,
  toggleTeacherStatus,
  deleteTeacher,
  type Teacher,
} from "@/lib/adminApi";
import {
  Plus,
  Pencil,
  Trash2,
  KeyRound,
  ToggleLeft,
  ToggleRight,
  Loader2,
  X,
  Eye,
  EyeOff,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";

// ── Modal types ───────────────────────────────────────────────────────────────
type ModalState =
  | { kind: "add" }
  | { kind: "edit"; teacher: Teacher }
  | { kind: "password"; teacher: Teacher }
  | { kind: "delete"; teacher: Teacher }
  | null;

// ── Helper: Modal wrapper ─────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-bold text-gray-800 text-lg">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ── Add / Edit form ───────────────────────────────────────────────────────────
function TeacherForm({
  initial,
  onSave,
  onClose,
  isAdd,
}: {
  initial?: Teacher;
  onSave: (data: any) => Promise<void>;
  onClose: () => void;
  isAdd: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [designation, setDesignation] = useState(initial?.designation ?? "");
  const [mobile, setMobile] = useState(initial?.mobile ?? "");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await onSave({ name, email, password, designation, mobile });
      onClose();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  const inputCls = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/30 focus:border-[#1a3a6b]";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelCls}>Full Name *</label>
        <input className={inputCls} required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ramesh Kumar" />
      </div>
      {isAdd && (
        <div>
          <label className={labelCls}>Email *</label>
          <input type="email" className={inputCls} required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teacher@ipskursi.com" />
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Designation</label>
          <input className={inputCls} value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="e.g. Math Teacher" />
        </div>
        <div>
          <label className={labelCls}>Mobile</label>
          <input className={inputCls} value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="98XXXXXXXX" maxLength={10} />
        </div>
      </div>
      {isAdd && (
        <div>
          <label className={labelCls}>Password *</label>
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              className={`${inputCls} pr-9`}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              minLength={6}
            />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
      )}
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose}
          className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" disabled={busy}
          className="flex-1 py-2 bg-[#1a3a6b] text-white rounded-lg text-sm font-semibold hover:bg-[#142d54] disabled:opacity-60 flex items-center justify-center gap-2">
          {busy && <Loader2 size={14} className="animate-spin" />}
          {isAdd ? "Add Teacher" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

// ── Reset password form ───────────────────────────────────────────────────────
function ResetPasswordForm({ teacher, onClose, onReset }: { teacher: Teacher; onClose: () => void; onReset: (pw: string) => Promise<void> }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    setBusy(true);
    try {
      await onReset(password);
      onClose();
      toast.success(`Password reset for ${teacher.name}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  const inputCls = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/30 focus:border-[#1a3a6b]";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-sm text-gray-500">Resetting password for <span className="font-semibold text-gray-800">{teacher.name}</span></p>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">New Password *</label>
        <div className="relative">
          <input type={showPw ? "text" : "password"} className={`${inputCls} pr-9`} required minLength={6}
            value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
        <input type="password" className={inputCls} required value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password" />
      </div>
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onClose} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
        <button type="submit" disabled={busy}
          className="flex-1 py-2 bg-[#1a3a6b] text-white rounded-lg text-sm font-semibold hover:bg-[#142d54] disabled:opacity-60 flex items-center justify-center gap-2">
          {busy && <Loader2 size={14} className="animate-spin" />}
          Reset Password
        </button>
      </div>
    </form>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminTeachers() {
  const { authenticated, loading } = useAdminAuth();
  const [, navigate] = useLocation();
  const [modal, setModal] = useState<ModalState>(null);
  const [search, setSearch] = useState("");
  const qc = useQueryClient();

  useEffect(() => {
    if (!loading && !authenticated) navigate("/admin/login");
  }, [loading, authenticated]);

  const { data: teachers = [], isLoading } = useQuery({
    queryKey: ["admin-teachers"],
    queryFn: fetchTeachers,
    enabled: authenticated,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-teachers"] });

  const addMut = useMutation({
    mutationFn: (d: Parameters<typeof createTeacher>[0]) => createTeacher(d),
    onSuccess: () => { invalidate(); toast.success("Teacher added successfully"); },
  });

  const editMut = useMutation({
    mutationFn: ({ id, ...d }: { id: number } & Parameters<typeof updateTeacher>[1]) => updateTeacher(id, d),
    onSuccess: () => { invalidate(); toast.success("Teacher updated"); },
  });

  const pwMut = useMutation({
    mutationFn: ({ id, password }: { id: number; password: string }) => resetTeacherPassword(id, password),
  });

  const statusMut = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => toggleTeacherStatus(id, isActive),
    onSuccess: () => invalidate(),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteTeacher(id),
    onSuccess: () => { invalidate(); toast.success("Teacher deleted"); setModal(null); },
  });

  const filtered = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      (t.designation ?? "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#1a3a6b]" size={32} /></div>;

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Teachers</h1>
            <p className="text-gray-500 text-sm mt-0.5">Manage all teacher accounts</p>
          </div>
          <button
            onClick={() => setModal({ kind: "add" })}
            className="flex items-center gap-2 bg-[#1a3a6b] hover:bg-[#142d54] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            <UserPlus size={16} /> Add Teacher
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or designation…"
            className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a6b]/30"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={28} className="animate-spin text-[#1a3a6b]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Plus size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">{search ? "No teachers match your search" : "No teachers yet — add one above"}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b text-left text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-4 py-3 font-semibold">#</th>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold hidden sm:table-cell">Email</th>
                    <th className="px-4 py-3 font-semibold hidden md:table-cell">Designation</th>
                    <th className="px-4 py-3 font-semibold hidden lg:table-cell">Mobile</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((t, idx) => (
                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3.5 text-gray-400">{idx + 1}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#1a3a6b]/10 text-[#1a3a6b] font-bold text-xs flex items-center justify-center shrink-0">
                            {t.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">{t.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-500 hidden sm:table-cell">{t.email}</td>
                      <td className="px-4 py-3.5 text-gray-500 hidden md:table-cell">{t.designation ?? "—"}</td>
                      <td className="px-4 py-3.5 text-gray-500 hidden lg:table-cell">{t.mobile ?? "—"}</td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => {
                            statusMut.mutate({ id: t.id, isActive: !t.isActive });
                            toast.success(`${t.name} marked as ${!t.isActive ? "Active" : "Inactive"}`);
                          }}
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                            t.isActive
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-600 hover:bg-red-200"
                          }`}
                        >
                          {t.isActive ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                          {t.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setModal({ kind: "edit", teacher: t })}
                            title="Edit"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setModal({ kind: "password", teacher: t })}
                            title="Reset password"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 transition-colors"
                          >
                            <KeyRound size={15} />
                          </button>
                          <button
                            onClick={() => setModal({ kind: "delete", teacher: t })}
                            title="Delete"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-3">{filtered.length} teacher{filtered.length !== 1 ? "s" : ""} shown</p>
      </div>

      {/* Modals */}
      {modal?.kind === "add" && (
        <Modal title="Add New Teacher" onClose={() => setModal(null)}>
          <TeacherForm isAdd onClose={() => setModal(null)} onSave={(d) => addMut.mutateAsync(d)} />
        </Modal>
      )}

      {modal?.kind === "edit" && (
        <Modal title="Edit Teacher" onClose={() => setModal(null)}>
          <TeacherForm
            isAdd={false}
            initial={modal.teacher}
            onClose={() => setModal(null)}
            onSave={(d) => editMut.mutateAsync({ id: modal.teacher.id, ...d })}
          />
        </Modal>
      )}

      {modal?.kind === "password" && (
        <Modal title="Reset Password" onClose={() => setModal(null)}>
          <ResetPasswordForm
            teacher={modal.teacher}
            onClose={() => setModal(null)}
            onReset={(pw) => pwMut.mutateAsync({ id: modal.teacher.id, password: pw })}
          />
        </Modal>
      )}

      {modal?.kind === "delete" && (
        <Modal title="Delete Teacher" onClose={() => setModal(null)}>
          <p className="text-sm text-gray-600 mb-5">
            Are you sure you want to delete <span className="font-semibold text-gray-800">{modal.teacher.name}</span>?
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setModal(null)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
              Cancel
            </button>
            <button
              onClick={() => deleteMut.mutate(modal.teacher.id)}
              disabled={deleteMut.isPending}
              className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {deleteMut.isPending && <Loader2 size={14} className="animate-spin" />}
              Delete
            </button>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
