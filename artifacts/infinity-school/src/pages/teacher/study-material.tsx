import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { TeacherLayout } from "@/components/teacher/TeacherLayout";
import { useTeacherAuth } from "@/hooks/useTeacherAuth";
import {
  fetchStudyMaterials,
  uploadStudyMaterial,
  deleteStudyMaterial,
  type StudyMaterial,
} from "@/lib/teacherApi";
import { Upload, Trash2, FileText, Image, FolderOpen, X } from "lucide-react";
import { toast } from "sonner";

const CLASSES = ["Nursery","KG","1","2","3","4","5","6","7","8","9","10","11","12"];

function fileIcon(type: string) {
  if (type.startsWith("image/")) return <Image size={20} />;
  return <FileText size={20} />;
}

function fileColor(type: string) {
  if (type === "application/pdf") return "#dc2626";
  if (type.startsWith("image/")) return "#16a34a";
  if (type.includes("powerpoint") || type.includes("presentation")) return "#ea580c";
  return "#2563eb";
}

export default function StudyMaterialPage() {
  const { loading, authenticated } = useTeacherAuth();
  const [, setLocation] = useLocation();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !authenticated) setLocation("/teacher/login");
  }, [loading, authenticated, setLocation]);

  useEffect(() => {
    if (!authenticated) return;
    fetchStudyMaterials()
      .then(setMaterials)
      .catch(() => toast.error("Failed to load study materials"))
      .finally(() => setFetching(false));
  }, [authenticated]);

  async function handleUpload() {
    if (!title || !className || !subject || !file) {
      toast.error("All fields and a file are required");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("className", className);
      fd.append("subject", subject);
      fd.append("file", file);
      const created = await uploadStudyMaterial(fd);
      setMaterials((prev) => [created, ...prev]);
      toast.success("File uploaded successfully");
      setShowForm(false);
      setTitle(""); setClassName(""); setSubject(""); setFile(null);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this study material?")) return;
    try {
      await deleteStudyMaterial(id);
      setMaterials((prev) => prev.filter((m) => m.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  }

  if (loading || !authenticated) return null;

  return (
    <TeacherLayout title="Study Material">
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-500 text-sm">{materials.length} file{materials.length !== 1 ? "s" : ""} uploaded</p>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold"
          style={{ backgroundColor: "#16a34a" }}
        >
          <Upload size={16} /> Upload File
        </button>
      </div>

      {/* Upload modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ backgroundColor: "#16a34a" }}>
              <h2 className="text-white font-bold">Upload Study Material</h2>
              <button onClick={() => setShowForm(false)} className="text-white/70 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chapter 3 Notes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Class</label>
                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500"
                  >
                    <option value="">Select</option>
                    {CLASSES.map((c) => <option key={c} value={c}>Class {c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Physics"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>
              {/* File picker */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">File</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-green-400 transition-colors"
                >
                  {file ? (
                    <div className="flex items-center justify-center gap-2 text-green-700">
                      <FileText size={20} />
                      <span className="text-sm font-medium truncate max-w-xs">{file.name}</span>
                    </div>
                  ) : (
                    <div className="text-gray-400">
                      <Upload size={28} className="mx-auto mb-2" />
                      <p className="text-sm">Click to select a file</p>
                      <p className="text-xs mt-1">PDF, DOCX, PPT, Images (max 20MB)</p>
                    </div>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleUpload} disabled={uploading} className="flex-1 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-70" style={{ backgroundColor: "#16a34a" }}>
                {uploading ? "Uploading…" : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      {fetching ? (
        <div className="text-center py-16 text-gray-400">Loading…</div>
      ) : materials.length === 0 ? (
        <div className="text-center py-16">
          <FolderOpen size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No files uploaded yet. Click "Upload File" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((m) => (
            <div key={m.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0" style={{ backgroundColor: fileColor(m.fileType) }}>
                  {fileIcon(m.fileType)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{m.title}</p>
                  <p className="text-xs text-gray-500 truncate">{m.fileName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 rounded">Class {m.className}</span>
                <span className="bg-gray-100 px-2 py-0.5 rounded">{m.subject}</span>
              </div>
              <div className="flex gap-2 mt-auto">
                <a
                  href={m.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 text-center text-xs font-semibold rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  View / Download
                </a>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </TeacherLayout>
  );
}
