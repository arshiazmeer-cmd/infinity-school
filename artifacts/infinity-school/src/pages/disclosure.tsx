import { useQuery } from "@tanstack/react-query";
import { FileText, Download, Clock, AlertCircle } from "lucide-react";

const BASE = `${import.meta.env.BASE_URL}api/disclosures`.replace(/\/+/g, "/").replace(/\/$/, "");

const CATEGORIES = [
  { key: "cbse_affiliation",      label: "CBSE Affiliation",        desc: "School affiliation certificate issued by CBSE." },
  { key: "society_registration",  label: "Society Registration",     desc: "Registration certificate of the managing society/trust." },
  { key: "recognition_certificate", label: "Recognition Certificate", desc: "State recognition certificate from the education department." },
  { key: "noc",                   label: "NOC",                      desc: "No Objection Certificate from the state government." },
  { key: "building_safety",       label: "Building Safety",          desc: "Building safety certificate from competent authority." },
  { key: "fire_safety",           label: "Fire Safety",              desc: "Fire safety certificate from fire department." },
  { key: "water_sanitation",      label: "Water & Sanitation",       desc: "Certificate for potable water supply and sanitation facilities." },
  { key: "staff_details",         label: "Staff Details",            desc: "Details of teaching and non-teaching staff." },
  { key: "infrastructure",        label: "Infrastructure",           desc: "Details of school infrastructure and facilities." },
  { key: "academic_calendar",     label: "Academic Calendar",        desc: "Academic calendar for the current session 2026–27." },
  { key: "fee_structure",         label: "Fee Structure",            desc: "Class-wise fee structure for session 2026–27." },
];

interface Disclosure {
  id: number;
  category: string;
  title: string;
  fileName: string | null;
  fileUrl: string | null;
  publishedAt: string;
}

export default function Disclosure() {
  const { data: documents = [] } = useQuery<Disclosure[]>({
    queryKey: ["disclosures"],
    queryFn: async () => {
      const res = await fetch(BASE);
      if (!res.ok) return [];
      return res.json();
    },
  });

  const byCategory = (key: string) => documents.filter((d) => d.category === key);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="bg-primary pt-24 pb-16 text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative z-10">
          <span className="inline-block bg-secondary/20 text-secondary border border-secondary/30 rounded-full px-4 py-1 text-xs font-bold tracking-widest uppercase mb-4">
            Transparency & Compliance
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Mandatory Public Disclosure</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            As mandated by CBSE, the following documents are made available to parents, students, and the general public.
          </p>
        </div>
      </section>
      {/* Documents Grid */}
      <section className="py-20 bg-muted flex-1">
        <div className="container mx-auto px-6 max-w-6xl">
          <p className="text-sm mb-10 bg-white border border-border rounded-xl px-5 py-3 flex items-start gap-3 text-foreground">
            <AlertCircle size={16} className="text-secondary shrink-0 mt-0.5" />
            All documents below are official records of Infinity Public School, Kursi, Barabanki. For queries, contact us at{" "}
            <a href="mailto:ipskursi@gmail.com" className="text-primary font-semibold hover:underline">ipskursi@gmail.com</a>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CATEGORIES.map(({ key, label, desc }) => {
              const docs = byCategory(key);
              return (
                <div key={key} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="bg-primary/5 border-b border-border px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText size={18} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-primary text-sm">{label}</h3>
                      <p className="text-xs mt-0.5 text-foreground">{desc}</p>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="px-6 py-4">
                    {docs.length === 0 ? (
                      <div className="flex items-center gap-2 text-sm py-2 text-foreground">
                        <Clock size={14} className="shrink-0" />
                        <span>Document will be uploaded shortly.</span>
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {docs.map((doc) => (
                          <li key={doc.id}>
                            <a
                              href={doc.fileUrl ?? "#"}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between gap-3 group hover:bg-primary/5 rounded-lg px-3 py-2 transition-colors"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText size={14} className="text-primary shrink-0" />
                                <span className="text-sm font-medium text-gray-700 truncate group-hover:text-primary">
                                  {doc.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs text-muted-foreground hidden sm:block">
                                  {new Date(doc.publishedAt).toLocaleDateString("en-IN")}
                                </span>
                                <Download size={14} className="text-secondary" />
                              </div>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Note */}
          <div className="mt-12 bg-white border border-border rounded-2xl p-6 text-sm text-muted-foreground leading-relaxed">
            <p className="font-semibold text-primary mb-2">Important Note</p>
            <p className="text-foreground">
              The above disclosures are in compliance with CBSE affiliation bye-laws. All documents are authentic and duly approved by the concerned authorities.
              Infinity Public School, Kursi, Barabanki is committed to full transparency and accountability in all its operations.
              For any queries or clarifications, please contact the school office at <a href="tel:+919118502112" className="text-primary font-semibold">+91 9118502112</a> or
              email us at <a href="mailto:ipskursi@gmail.com" className="text-primary font-semibold">ipskursi@gmail.com</a>.
            </p>
            <p className="mt-2 text-foreground">Website: <a href="https://www.ipskursi.in" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">www.ipskursi.in</a></p>
          </div>
        </div>
      </section>
    </div>
  );
}
