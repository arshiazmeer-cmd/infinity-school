import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  Search, PlusCircle, Pencil, Trash2, X, Eye, Download, Printer, Upload,
  ChevronLeft, ChevronRight, User
} from "lucide-react";
import { toast } from "sonner";

interface Student {
  id: number;
  admissionNumber: string;
  rollNumber: string | null;
  name: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup: string | null;
  aadhaarNumber: string | null;
  religion: string | null;
  category: string | null;
  address: string | null;
  photoUrl: string | null;
  fatherName: string;
  motherName: string;
  guardianName: string | null;
  guardianOccupation: string | null;
  parentMobile: string;
  alternateMobile: string | null;
  parentEmail: string | null;
  emergencyContact: string | null;
  className: string;
  section: string;
  house: string | null;
  admissionDate: string;
  previousSchool: string | null;
  transportRequired: boolean;
  hostelRequired: boolean;
  feeStatus: string;
  studentStatus: string;
  createdAt: string;
}

interface StudentForm {
  admissionNumber: string; rollNumber: string; name: string; gender: string;
  dateOfBirth: string; bloodGroup: string; aadhaarNumber: string; religion: string;
  category: string; address: string;
  fatherName: string; motherName: string; guardianName: string; guardianOccupation: string;
  parentMobile: string; alternateMobile: string; parentEmail: string; emergencyContact: string;
  className: string; section: string; house: string; admissionDate: string; previousSchool: string;
  transportRequired: string; hostelRequired: string; feeStatus: string; studentStatus: string;
  photo: File | null;
}

const EMPTY: StudentForm = {
  admissionNumber: "", rollNumber: "", name: "", gender: "Male", dateOfBirth: "",
  bloodGroup: "", aadhaarNumber: "", religion: "", category: "General", address: "",
  fatherName: "", motherName: "", guardianName: "", guardianOccupation: "",
  parentMobile: "", alternateMobile: "", parentEmail: "", emergencyContact: "",
  className: "", section: "A", house: "", admissionDate: "", previousSchool: "",
  transportRequired: "false", hostelRequired: "false", feeStatus: "pending", studentStatus: "active",
  photo: null,
};

const BASE = `${import.meta.env.BASE_URL}api/admin`.replace(/\/+/g, "/").replace(/\/$/, "");
function token() { return localStorage.getItem("admin_token"); }

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-50 text-green-700 border-green-200",
  inactive: "bg-gray-100 text-gray-600 border-gray-200",
  transferred: "bg-yellow-50 text-yellow-700 border-yellow-200",
  alumni: "bg-blue-50 text-blue-700 border-blue-200",
};

const FEE_COLORS: Record<string, string> = {
  paid: "bg-green-50 text-green-700",
  pending: "bg-red-50 text-red-600",
  partial: "bg-yellow-50 text-yellow-700",
};

const CLASSES = [
  "Nursery","LKG","UKG",
  "Class 1","Class 2","Class 3","Class 4","Class 5",
  "Class 6","Class 7","Class 8","Class 9","Class 10","Class 11","Class 12"
];

export default function AdminStudents() {
  const { authenticated, loading } = useAdminAuth();
  const [, navigate] = useLocation();
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [viewing, setViewing] = useState<Student | null>(null);
  const [form, setForm] = useState<StudentForm>({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (!loading && !authenticated) navigate("/admin/login"); }, [loading, authenticated]);

  async function load(pg = 1, s = search, cls = classFilter, st = statusFilter) {
    setFetching(true);
    const p = new URLSearchParams({ page: String(pg) });
    if (s) p.set("search", s);
    if (cls) p.set("class", cls);
    if (st) p.set("status", st);
    try {
      const res = await fetch(`${BASE}/students?${p}`, { headers: token() ? { Authorization: `Bearer ${token()}` } : {} });
      const data = await res.json();
      setStudents(data.students);
      setTotal(data.total);
      setPage(data.page);
      setPages(data.pages);
    } catch { toast.error("Failed to load students"); }
    finally { setFetching(false); }
  }

  useEffect(() => { if (authenticated) load(); }, [authenticated]);

  function openCreate() { setEditing(null); setForm({ ...EMPTY }); setShowForm(true); }
  function openEdit(s: Student) {
    setEditing(s);
    setForm({
      admissionNumber: s.admissionNumber, rollNumber: s.rollNumber ?? "",
      name: s.name, gender: s.gender, dateOfBirth: s.dateOfBirth, bloodGroup: s.bloodGroup ?? "",
      aadhaarNumber: s.aadhaarNumber ?? "", religion: s.religion ?? "", category: s.category ?? "General",
      address: s.address ?? "", fatherName: s.fatherName, motherName: s.motherName,
      guardianName: s.guardianName ?? "", guardianOccupation: s.guardianOccupation ?? "",
      parentMobile: s.parentMobile, alternateMobile: s.alternateMobile ?? "",
      parentEmail: s.parentEmail ?? "", emergencyContact: s.emergencyContact ?? "",
      className: s.className, section: s.section, house: s.house ?? "", admissionDate: s.admissionDate,
      previousSchool: s.previousSchool ?? "", transportRequired: String(s.transportRequired),
      hostelRequired: String(s.hostelRequired), feeStatus: s.feeStatus, studentStatus: s.studentStatus,
      photo: null,
    });
    setShowForm(true);
  }

  function set(field: keyof StudentForm, value: string) { setForm((p) => ({ ...p, [field]: value })); }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.admissionNumber || !form.name || !form.gender || !form.dateOfBirth
      || !form.fatherName || !form.motherName || !form.parentMobile
      || !form.className || !form.admissionDate) {
      toast.error("Please fill all required fields");
      return;
    }
    setSaving(true);
    const fd = new FormData();
    (Object.keys(form) as (keyof StudentForm)[]).forEach((k) => {
      if (k === "photo") { if (form.photo) fd.append("photo", form.photo); }
      else fd.append(k, form[k] as string);
    });
    try {
      if (editing) {
        const res = await fetch(`${BASE}/students/${editing.id}`, {
          method: "PUT", headers: token() ? { Authorization: `Bearer ${token()}` } : {}, body: fd,
        });
        if (!res.ok) { const b = await res.json().catch(() => ({})); throw new Error((b as any).error); }
        toast.success("Student updated");
      } else {
        const res = await fetch(`${BASE}/students`, {
          method: "POST", headers: token() ? { Authorization: `Bearer ${token()}` } : {}, body: fd,
        });
        if (!res.ok) { const b = await res.json().catch(() => ({})); throw new Error((b as any).error); }
        toast.success("Student added");
      }
      setShowForm(false);
      load(1);
    } catch (err: any) {
      toast.error(err.message || "Failed to save student");
    } finally { setSaving(false); }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this student? This action cannot be undone.")) return;
    setDeleting(id);
    try {
      await fetch(`${BASE}/students/${id}`, { method: "DELETE", headers: token() ? { Authorization: `Bearer ${token()}` } : {} });
      setStudents((p) => p.filter((s) => s.id !== id));
      setTotal((p) => p - 1);
      toast.success("Student deleted");
    } catch { toast.error("Failed to delete"); }
    finally { setDeleting(null); }
  }

  function exportCSV() {
    const headers = ["Admission No","Name","Class","Section","Gender","DOB","Father","Phone","Status","Fee Status"];
    const rows = students.map((s) => [
      s.admissionNumber, s.name, s.className, s.section, s.gender, s.dateOfBirth,
      s.fatherName, s.parentMobile, s.studentStatus, s.feeStatus,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `students-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  function printProfile(s: Student) {
    setViewing(s);
    setTimeout(() => window.print(), 300);
  }

  const photoBase = (url: string | null) =>
    url ? `${import.meta.env.BASE_URL}${url}`.replace(/\/+/g, "/") : null;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Student Management</h1>
            <p className="text-sm text-gray-500 mt-1">{total} students registered</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <Download size={15} /> Export CSV
            </button>
            <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90" style={{ backgroundColor: "#1a3a6b" }}>
              <PlusCircle size={15} /> Add Student
            </button>
          </div>
        </div>

        {/* Filters */}
        <form onSubmit={(e) => { e.preventDefault(); load(1); }} className="flex flex-wrap gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, admission no, phone…"
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1a3a6b]" />
          </div>
          <select value={classFilter} onChange={(e) => { setClassFilter(e.target.value); load(1, search, e.target.value, statusFilter); }}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a3a6b]">
            <option value="">All Classes</option>
            {CLASSES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); load(1, search, classFilter, e.target.value); }}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a3a6b]">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="transferred">Transferred</option>
            <option value="alumni">Alumni</option>
          </select>
          {(search || classFilter || statusFilter) && (
            <button type="button" onClick={() => { setSearch(""); setClassFilter(""); setStatusFilter(""); load(1, "", "", ""); }}
              className="p-2.5 border border-gray-200 rounded-lg text-gray-400 hover:bg-gray-50"><X size={15} /></button>
          )}
          <button type="submit" className="px-4 py-2.5 rounded-lg text-white text-sm font-medium hover:opacity-90" style={{ backgroundColor: "#1a3a6b" }}>Search</button>
        </form>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {fetching ? (
            <div className="text-center py-12 text-gray-400">Loading students…</div>
          ) : students.length === 0 ? (
            <div className="text-center py-14">
              <User size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No students found</p>
              <button onClick={openCreate} className="mt-3 text-sm text-[#1a3a6b] hover:underline">Add first student</button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Student</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium hidden sm:table-cell">Class</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium hidden md:table-cell">Parent</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium hidden lg:table-cell">Fee</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                      <th className="text-right px-4 py-3 text-gray-500 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {students.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {photoBase(s.photoUrl) ? (
                              <img src={photoBase(s.photoUrl)!} alt={s.name}
                                className="w-8 h-8 rounded-full object-cover border border-gray-100 flex-shrink-0" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-[#1a3a6b]/10 flex items-center justify-center flex-shrink-0">
                                <User size={14} className="text-[#1a3a6b]" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-800">{s.name}</p>
                              <p className="text-xs text-gray-400">{s.admissionNumber}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{s.className} – {s.section}</td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <p className="text-gray-700">{s.fatherName}</p>
                          <p className="text-xs text-gray-400">{s.parentMobile}</p>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${FEE_COLORS[s.feeStatus] ?? "bg-gray-50 text-gray-500"}`}>
                            {s.feeStatus.charAt(0).toUpperCase() + s.feeStatus.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs rounded-full px-2.5 py-0.5 border font-medium ${STATUS_COLORS[s.studentStatus] ?? ""}`}>
                            {s.studentStatus.charAt(0).toUpperCase() + s.studentStatus.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => setViewing(s)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-400 transition-colors" title="View">
                              <Eye size={15} />
                            </button>
                            <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-yellow-50 text-yellow-500 transition-colors" title="Edit">
                              <Pencil size={15} />
                            </button>
                            <button onClick={() => printProfile(s)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors" title="Print">
                              <Printer size={15} />
                            </button>
                            <button onClick={() => handleDelete(s.id)} disabled={deleting === s.id}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors disabled:opacity-50" title="Delete">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {pages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                  <p className="text-sm text-gray-500">Showing {students.length} of {total}</p>
                  <div className="flex gap-2">
                    <button disabled={page <= 1} onClick={() => load(page - 1)}
                      className="p-2 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"><ChevronLeft size={16} /></button>
                    <span className="px-3 py-1.5 text-sm text-gray-600">Page {page} of {pages}</span>
                    <button disabled={page >= pages} onClick={() => load(page + 1)}
                      className="p-2 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"><ChevronRight size={16} /></button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* View Modal */}
      {viewing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 print:bg-white print:inset-auto print:p-0">
          <div ref={printRef} className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto print:max-h-none print:shadow-none print:rounded-none">
            <div className="flex items-center justify-between p-5 border-b print:hidden">
              <h2 className="font-bold text-gray-800">Student Profile</h2>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50"><Printer size={16} /></button>
                <button onClick={() => setViewing(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
            </div>
            <div className="p-6">
              {/* Profile header */}
              <div className="flex items-center gap-4 mb-6 p-4 rounded-xl" style={{ background: "linear-gradient(135deg, #1a3a6b, #2563eb)" }}>
                {photoBase(viewing.photoUrl) ? (
                  <img src={photoBase(viewing.photoUrl)!} alt={viewing.name}
                    className="w-20 h-20 rounded-xl object-cover border-2 border-white/30" />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-white/20 flex items-center justify-center">
                    <User size={36} className="text-white" />
                  </div>
                )}
                <div className="text-white">
                  <h3 className="text-xl font-bold">{viewing.name}</h3>
                  <p className="text-white/70 text-sm">{viewing.admissionNumber}</p>
                  <p className="text-white/70 text-sm">{viewing.className} – Section {viewing.section}</p>
                </div>
              </div>
              {/* Details grid */}
              {[
                { title: "Personal Information", rows: [
                  ["Gender", viewing.gender], ["Date of Birth", viewing.dateOfBirth],
                  ["Blood Group", viewing.bloodGroup], ["Aadhaar", viewing.aadhaarNumber],
                  ["Religion", viewing.religion], ["Category", viewing.category],
                  ["Address", viewing.address],
                ]},
                { title: "Parent Information", rows: [
                  ["Father's Name", viewing.fatherName], ["Mother's Name", viewing.motherName],
                  ["Guardian", viewing.guardianName], ["Occupation", viewing.guardianOccupation],
                  ["Mobile", viewing.parentMobile], ["Alternate Mobile", viewing.alternateMobile],
                  ["Email", viewing.parentEmail], ["Emergency Contact", viewing.emergencyContact],
                ]},
                { title: "Academic Information", rows: [
                  ["Class", `${viewing.className} – ${viewing.section}`], ["Roll Number", viewing.rollNumber],
                  ["House", viewing.house], ["Admission Date", viewing.admissionDate],
                  ["Previous School", viewing.previousSchool],
                  ["Transport", viewing.transportRequired ? "Yes" : "No"],
                  ["Hostel", viewing.hostelRequired ? "Yes" : "No"],
                  ["Fee Status", viewing.feeStatus], ["Student Status", viewing.studentStatus],
                ]},
              ].map(({ title, rows }) => (
                <div key={title} className="mb-5">
                  <h4 className="text-sm font-bold text-[#1a3a6b] uppercase tracking-wider mb-3 pb-1 border-b border-gray-100">{title}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {rows.filter(([, v]) => v).map(([k, v]) => (
                      <div key={k} className="text-sm">
                        <span className="text-gray-500">{k}: </span>
                        <span className="text-gray-800 font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-gray-800">{editing ? "Edit Student" : "Add New Student"}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6">
              {[
                {
                  heading: "Personal Information",
                  fields: [
                    { label: "Admission Number *", key: "admissionNumber", required: true },
                    { label: "Roll Number", key: "rollNumber" },
                    { label: "Full Name *", key: "name", required: true, full: true },
                    { label: "Gender *", key: "gender", type: "select", options: ["Male","Female","Other"], required: true },
                    { label: "Date of Birth *", key: "dateOfBirth", type: "date", required: true },
                    { label: "Blood Group", key: "bloodGroup", type: "select", options: ["A+","A-","B+","B-","O+","O-","AB+","AB-"] },
                    { label: "Aadhaar Number", key: "aadhaarNumber" },
                    { label: "Religion", key: "religion" },
                    { label: "Category", key: "category", type: "select", options: ["General","OBC","SC","ST","EWS"] },
                    { label: "Address", key: "address", full: true },
                  ],
                },
                {
                  heading: "Parent / Guardian",
                  fields: [
                    { label: "Father's Name *", key: "fatherName", required: true },
                    { label: "Mother's Name *", key: "motherName", required: true },
                    { label: "Guardian Name", key: "guardianName" },
                    { label: "Guardian Occupation", key: "guardianOccupation" },
                    { label: "Parent Mobile *", key: "parentMobile", required: true },
                    { label: "Alternate Mobile", key: "alternateMobile" },
                    { label: "Parent Email", key: "parentEmail" },
                    { label: "Emergency Contact", key: "emergencyContact" },
                  ],
                },
                {
                  heading: "Academic Information",
                  fields: [
                    { label: "Class *", key: "className", type: "select", options: CLASSES, required: true },
                    { label: "Section", key: "section", type: "select", options: ["A","B","C","D","E"] },
                    { label: "House", key: "house" },
                    { label: "Admission Date *", key: "admissionDate", type: "date", required: true },
                    { label: "Previous School", key: "previousSchool", full: true },
                    { label: "Transport", key: "transportRequired", type: "select", options: ["false","true"], optionLabels: ["No","Yes"] },
                    { label: "Hostel", key: "hostelRequired", type: "select", options: ["false","true"], optionLabels: ["No","Yes"] },
                    { label: "Fee Status", key: "feeStatus", type: "select", options: ["pending","paid","partial"], optionLabels: ["Pending","Paid","Partial"] },
                    { label: "Student Status", key: "studentStatus", type: "select", options: ["active","inactive","transferred","alumni"], optionLabels: ["Active","Inactive","Transferred","Alumni"] },
                  ],
                },
              ].map(({ heading, fields }) => (
                <div key={heading} className="mb-6">
                  <h3 className="text-xs font-bold text-[#1a3a6b] uppercase tracking-wider mb-4 pb-1.5 border-b border-gray-100">{heading}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {(fields as any[]).map(({ label, key, type, options, optionLabels, required, full }) => (
                      <div key={key} className={full ? "col-span-2" : ""}>
                        <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                        {type === "select" ? (
                          <select value={form[key as keyof StudentForm] as string}
                            onChange={(e) => set(key as keyof StudentForm, e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a3a6b]"
                            required={required}>
                            {options.map((o: string, i: number) => (
                              <option key={o} value={o}>{optionLabels ? optionLabels[i] : o}</option>
                            ))}
                          </select>
                        ) : (
                          <input type={type || "text"} value={form[key as keyof StudentForm] as string}
                            onChange={(e) => set(key as keyof StudentForm, e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a3a6b]"
                            required={required} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Photo */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-[#1a3a6b] uppercase tracking-wider mb-4 pb-1.5 border-b border-gray-100">Photo</h3>
                <label className="flex items-center gap-3 border border-dashed border-gray-300 rounded-lg p-3 cursor-pointer hover:border-[#1a3a6b] transition-colors w-fit">
                  <Upload size={18} className="text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {form.photo ? form.photo.name : editing?.photoUrl ? "Replace photo" : "Upload student photo"}
                  </span>
                  <input type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden"
                    onChange={(e) => setForm((p) => ({ ...p, photo: e.target.files?.[0] ?? null }))} />
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 text-white rounded-lg py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "#1a3a6b" }}>
                  {saving ? "Saving…" : editing ? "Update Student" : "Add Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
