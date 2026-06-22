import { CheckCircle2, Shield, Utensils, Wifi, Book } from "lucide-react";
import facility3 from "@/assets/facility-3.png";

export default function Hostel() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-primary pt-24 pb-16 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Hostel Facilities</h1>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
          A home away from home. Safe, disciplined, and nurturing environment for focused preparation.
        </p>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-6">Premium Boarding Experience</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Our hostel facilities are designed specifically keeping in mind the rigorous routine of JEE and NEET aspirants. We eliminate all daily chores and distractions so students can focus entirely on their studies.
              </p>
              <ul className="space-y-4">
                {[
                  "Separate secure buildings for boys and girls.",
                  "Spacious, well-ventilated air-conditioned rooms.",
                  "24/7 power backup and RO drinking water.",
                  "Dedicated wardens and strict disciplinary protocols.",
                  "In-house medical facility and tie-ups with top hospitals."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-secondary shrink-0 mt-1" />
                    <span className="text-primary font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img src={facility3} alt="Modern Hostel Room" className="w-full h-auto object-cover" />
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Shield size={32} />, title: "24/7 Security", desc: "CCTV surveillance and professional guards ensuring complete safety." },
              { icon: <Utensils size={32} />, title: "Nutritious Food", desc: "Hygienic, dietician-approved pure vegetarian mess serving 4 meals a day." },
              { icon: <Book size={32} />, title: "Study Rooms", desc: "Quiet zones and dedicated study hours with resident doubt-clearing faculties." },
              { icon: <Wifi size={32} />, title: "Digital Access", desc: "Controlled Wi-Fi access specifically whitelisted for educational resources." },
            ].map((feature, i) => (
              <div key={i} className="bg-muted p-8 rounded-2xl border border-border text-center hover:border-primary/20 hover:shadow-md transition-all">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-secondary shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}