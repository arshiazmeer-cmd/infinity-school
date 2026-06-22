import { Users, Star } from "lucide-react";

type StaffMember = {
  name: string;
  role: string;
};

const administration: StaffMember[] = [
  { name: "Mr. M.M. Zafar", role: "Admin" },
  { name: "Mr. Mohd Tayyab", role: "Coordinator" },
  { name: "Mr. Mohd. Danish Khan", role: "Urdu Department Incharge" },
  { name: "Ms. Shabeena Mirza", role: "Academic Incharge (Juniors)" },
  { name: "Mrs. Taniya Siraj", role: "CCA Incharge" },
  { name: "Mr. Almeen Siddiqui", role: "Sports Incharge" },
];

const teachers: StaffMember[] = [
  { name: "Ms. Afshan Parveen", role: "Teacher" },
  { name: "Ms. Nishi Parveen", role: "Teacher" },
  { name: "Mrs. Anamika", role: "Teacher" },
  { name: "Ms. Baby Sana", role: "Teacher" },
  { name: "Ms. Arshiya Kamil", role: "Teacher" },
  { name: "Ms. Hira", role: "Teacher" },
];

const assistantTeachers: StaffMember[] = [
  { name: "Mrs. Rubi Zafar", role: "Assistant Teacher" },
  { name: "Ms. Aisha Khatoon", role: "Assistant Teacher" },
  { name: "Ms. Vandana", role: "Assistant Teacher" },
  { name: "Ms. Hasan Zehra", role: "Assistant Teacher" },
];

function StaffCard({ member, accent = false }: { member: StaffMember; accent?: boolean }) {
  return (
    <div className={`bg-white rounded-2xl border p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:border-primary/20 transition-all group ${accent ? "border-secondary/30" : "border-border"}`}>
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${accent ? "bg-secondary/10" : "bg-primary/5"} group-hover:scale-110 transition-transform`}>
        <Users size={28} className={accent ? "text-secondary" : "text-primary/50"} />
      </div>
      <h4 className="font-bold text-primary text-base mb-1 leading-tight">{member.name}</h4>
      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${accent ? "bg-secondary/10 text-secondary" : "bg-primary/5 text-primary/70"}`}>
        {member.role}
      </span>
    </div>
  );
}

function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="flex items-center gap-2">
        <Star size={16} className="text-secondary fill-secondary" />
        <span className="text-xs font-bold text-secondary tracking-widest uppercase">{label}</span>
      </div>
      <div className="flex-1 h-px bg-border"></div>
      <h3 className="text-xl font-bold text-primary">{title}</h3>
    </div>
  );
}

export default function Faculty() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-primary pt-24 pb-16 text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Team</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
            Meet the dedicated professionals who make Infinity Public School an institution of trust, discipline, and academic excellence.
          </p>
        </div>
      </section>

      <section className="py-20 bg-muted min-h-[60vh]">
        <div className="container mx-auto px-6 max-w-6xl space-y-16">

          {/* Leadership */}
          <div className="bg-gradient-to-br from-primary to-[#095a96] rounded-3xl p-10 text-white shadow-xl">
            <div className="text-center mb-10">
              <span className="text-xs font-bold text-secondary tracking-widest uppercase">Leadership</span>
              <h2 className="text-3xl font-bold text-white mt-2">School Leadership</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { name: "Dr. Nisar Ahmad Nadvi", role: "Director" },
                { name: "Dr. Arshi Ahmad", role: "Managing Director" },
                { name: "Mrs. Pooja Rani", role: "Principal" },
              ].map((leader, i) => (
                <div key={i} className="flex flex-col items-center text-center p-6 bg-white/10 rounded-2xl border border-white/20 hover:bg-white/15 transition-colors">
                  <div className="w-20 h-20 rounded-full bg-white/15 border-4 border-secondary/60 flex items-center justify-center mb-4">
                    <Users size={36} className="text-white/70" />
                  </div>
                  <h4 className="font-bold text-white text-lg mb-1">{leader.name}</h4>
                  <span className="text-xs font-bold bg-secondary text-white px-3 py-1 rounded-full">{leader.role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Administration */}
          <div>
            <SectionHeader label="Management" title="Administration" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5">
              {administration.map((m, i) => (
                <StaffCard key={i} member={m} accent />
              ))}
            </div>
          </div>

          {/* Teachers */}
          <div>
            <SectionHeader label="Academic Staff" title="Teachers" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5">
              {teachers.map((m, i) => (
                <StaffCard key={i} member={m} />
              ))}
            </div>
          </div>

          {/* Assistant Teachers */}
          <div>
            <SectionHeader label="Support Staff" title="Assistant Teachers" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {assistantTeachers.map((m, i) => (
                <StaffCard key={i} member={m} />
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
