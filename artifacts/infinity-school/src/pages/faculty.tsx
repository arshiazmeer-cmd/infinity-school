import { Users, Star } from "lucide-react";

import imgMMZafar from "@/assets/staff-mm-zafar.jpeg";
import imgTayyab from "@/assets/staff-tayyab.jpeg";
import imgDanishKhan from "@/assets/staff-danish-khan.jpeg";
import imgShabeenaMirza from "@/assets/staff-shabeena.jpeg";
import imgTaniyaSiraj from "@/assets/staff-taniya.jpeg";
import imgAlmeenSiddiqui from "@/assets/staff-almeen-siddiqui.jpeg";
import imgAfshan from "@/assets/staff-afshan-parveen.jpeg";
import imgNishi from "@/assets/staff-nishi-parveen.jpeg";
import imgAnamika from "@/assets/staff-anamika.jpeg";
import imgBabySana from "@/assets/staff-baby-sana.jpeg";
import imgAisha from "@/assets/staff-aysha.jpeg";
import imgVandana from "@/assets/staff-vandana.jpeg";
import imgPooja from "@/assets/staff-pooja-rani.jpeg";

type StaffMember = {
  name: string;
  role: string;
  img?: string;
};

const administration: StaffMember[] = [
  { name: "Mr. M.M. Zafar", role: "Admin", img: imgMMZafar },
  { name: "Mr. Mohd Tayyab", role: "Coordinator", img: imgTayyab },
  { name: "Mr. Mohd. Danish Khan", role: "Urdu Department Incharge", img: imgDanishKhan },
  { name: "Ms. Shabeena Mirza", role: "Academic Incharge (Juniors)", img: imgShabeenaMirza },
  { name: "Mrs. Taniya Siraj", role: "CCA Incharge", img: imgTaniyaSiraj },
  { name: "Mr. Almeen Siddiqui", role: "Sports Incharge", img: imgAlmeenSiddiqui },
];

const teachers: StaffMember[] = [
  { name: "Ms. Afshan Parveen", role: "Teacher", img: imgAfshan },
  { name: "Ms. Nishi Parveen", role: "Teacher", img: imgNishi },
  { name: "Mrs. Anamika", role: "Teacher", img: imgAnamika },
  { name: "Ms. Baby Sana", role: "Teacher", img: imgBabySana },
];

const assistantTeachers: StaffMember[] = [
  { name: "Mrs. Rubi Zafar", role: "Assistant Teacher" },
  { name: "Ms. Aisha Khatoon", role: "Assistant Teacher", img: imgAisha },
  { name: "Ms. Vandana", role: "Assistant Teacher", img: imgVandana },
  { name: "Ms. Hasan Zehra", role: "Assistant Teacher" },
];

function StaffCard({ member, accent = false }: { member: StaffMember; accent?: boolean }) {
  return (
    <div className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md hover:border-primary/20 transition-all group ${accent ? "border-secondary/30" : "border-border"}`}>
      <div className="aspect-[3/4] overflow-hidden bg-muted">
        {member.img ? (
          <img
            src={member.img}
            alt={member.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${accent ? "bg-secondary/10" : "bg-primary/5"}`}>
            <Users size={48} className={accent ? "text-secondary/40" : "text-primary/20"} />
          </div>
        )}
      </div>
      <div className="p-4 text-center">
        <h4 className="font-bold text-primary text-sm mb-1 leading-tight">{member.name}</h4>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${accent ? "bg-secondary/10 text-secondary" : "bg-primary/5 text-primary/70"}`}>
          {member.role}
        </span>
      </div>
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
                { name: "Dr. Nisar Ahmad Nadvi", role: "Director", img: null },
                { name: "Dr. Arshi Ahmad", role: "Managing Director", img: null },
                { name: "Mrs. Pooja Rani", role: "Principal", img: imgPooja },
              ].map((leader, i) => (
                <div key={i} className="bg-white/10 rounded-2xl border border-white/20 hover:bg-white/15 transition-colors overflow-hidden">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    {leader.img ? (
                      <img src={leader.img} alt={leader.name} className="w-full h-full object-cover object-center" />
                    ) : (
                      <div className="w-full h-full bg-white/15 flex items-center justify-center">
                        <Users size={56} className="text-white/40" />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/90 to-transparent pt-10 pb-4 px-4 text-center">
                      <h4 className="font-bold text-white text-base mb-1">{leader.name}</h4>
                      <span className="text-xs font-bold bg-secondary text-white px-3 py-1 rounded-full">{leader.role}</span>
                    </div>
                  </div>
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
