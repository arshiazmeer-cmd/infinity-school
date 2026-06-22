import { BookOpen, Target, Award, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-primary pt-24 pb-20 text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">About Infinity Public School</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg leading-relaxed">
            Building Future Doctors & Engineers with a unique integrated approach to schooling and competitive preparation, right here in Kursi, Barabanki.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-muted p-10 rounded-3xl border border-border"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                <Target size={32} />
              </div>
              <h2 className="text-3xl font-bold font-heading text-primary mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                To be the premier educational institution in Uttar Pradesh that seamlessly integrates holistic academic development with top-tier competitive examination preparation — empowering students to achieve their highest potential without the stress of managing parallel coaching.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-primary p-10 rounded-3xl text-white shadow-xl shadow-primary/20"
            >
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-secondary">
                <Award size={32} />
              </div>
              <h2 className="text-3xl font-bold font-heading mb-4">Our Mission</h2>
              <ul className="space-y-4 text-primary-foreground/90">
                {[
                  "Provide a stress-free environment for dual preparation from Nursery to Class 12.",
                  "Bring the best educators and coaching methodology to Barabanki.",
                  "Foster discipline, ethical values, and logical thinking in every student.",
                  "Deliver academic excellence through CBSE board curriculum aligned with JEE/NEET preparation.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-secondary font-bold text-xl mt-[-2px]">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold text-secondary tracking-widest uppercase mb-2">What We Stand For</h2>
            <h3 className="text-3xl md:text-4xl font-heading font-bold text-primary">Our Core Values</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <BookOpen size={28} />, title: "Academic Excellence", desc: "We hold the highest academic standards. Every student is pushed to discover their intellectual limits and exceed them through consistent, guided effort." },
              { icon: <Award size={28} />, title: "Discipline", desc: "A structured, disciplined environment is the foundation of Infinity. Regularity, time management, and focus are non-negotiable values we instil from the earliest classes." },
              { icon: <Target size={28} />, title: "Competitive Preparation", desc: "Beyond the school curriculum, we prepare every student for the most demanding national exams — JEE, NEET, NTSE — through expert faculty and rigorous test series." },
              { icon: <Users size={28} />, title: "Holistic Development", desc: "We believe great students are built in the classroom, on the sports ground, and through cultural activities. We nurture the whole child — mind, body, and character." },
              { icon: <Award size={28} />, title: "Parental Trust", desc: "Parents are our partners. We maintain complete transparency about every student's academic progress, well-being, and growth through regular feedback and meetings." },
              { icon: <BookOpen size={28} />, title: "Innovation in Teaching", desc: "Our faculty continuously evolves teaching methodology — using smart classrooms, technology-assisted learning, and modern pedagogical approaches to make learning effective and engaging." },
            ].map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white p-8 rounded-2xl border border-border hover:shadow-md hover:border-primary/20 transition-all group"
              >
                <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center text-secondary mb-5 group-hover:scale-110 transition-transform">
                  {val.icon}
                </div>
                <h4 className="font-bold text-primary text-lg mb-2">{val.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="bg-muted rounded-3xl overflow-hidden shadow-lg border border-border">
            <div className="grid md:grid-cols-[1fr_2fr]">
              <div className="bg-primary p-8 flex flex-col justify-center items-center text-center">
                <div className="w-32 h-32 rounded-full bg-white/15 border-4 border-secondary/50 mb-6 flex items-center justify-center overflow-hidden">
                  <Users size={48} className="text-white/70" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">Mrs. Pooja Rani</h3>
                <p className="text-secondary font-semibold text-sm mb-3">Principal</p>
                <p className="text-xs text-primary-foreground/60">Ph.D. in Education<br />Academic Leader, 15+ Years</p>
              </div>
              <div className="p-10 md:p-12">
                <h2 className="text-3xl font-heading font-bold text-primary mb-6">Principal's Message</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    "Welcome to Infinity Public School. Over the years, we have observed the immense pressure students face trying to balance their regular schooling with rigorous coaching for exams like IIT-JEE and NEET. This dual pressure often leads to burnout and compromised academic performance."
                  </p>
                  <p>
                    "Our integrated curriculum is designed to eliminate this exact problem. By bringing premier competitive coaching into the regular school hours, we give students back their evening time for self-study, hobbies, and adequate rest."
                  </p>
                  <p>
                    "We don't just teach; we mentor. Our commitment is to ensure every child who walks through our gates is given the exact roadmap, resources, and emotional support needed to succeed — in exams and in life."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-sm font-bold text-secondary tracking-widest uppercase mb-2">Our Journey</h2>
          <h3 className="text-3xl md:text-5xl font-heading font-bold mb-16">Milestones of Excellence</h3>

          <div className="space-y-12">
            {[
              { year: "2023", title: "Establishment of Infinity Public School", desc: "Infinity Public School was founded in Kursi, Barabanki with a clear vision: to integrate quality CBSE schooling with competitive exam preparation under one roof, serving families across the region." },
              { year: "2024", title: "Expanded to Higher Classes", desc: "Responding to strong demand and parent trust, we expanded our programs to include Classes 6 through 12 — covering Foundation, Pre-Foundation, IIT-JEE, and NEET integrated batches." },
              { year: "2025", title: "Competitive Preparation Wing Added", desc: "A dedicated Competitive Preparation Wing was inaugurated with specialist faculty for JEE and NEET, a full-scale test series, and personalised mentorship programs for senior students." },
              { year: "2026", title: "450+ Students Enrolled", desc: "Infinity Public School reached a landmark of over 450 enrolled students across all classes — Nursery to Class 12 — cementing its reputation as the most trusted integrated school in Barabanki." },
            ].map((item, i, arr) => (
              <div key={i} className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
                <div className="md:w-1/3 text-right">
                  <span className="text-4xl font-bold text-secondary font-heading">{item.year}</span>
                </div>
                <div className="hidden md:flex flex-col items-center justify-center relative">
                  <div className="w-4 h-4 rounded-full bg-secondary z-10"></div>
                  {i !== arr.length - 1 && <div className="w-0.5 h-32 bg-white/20 absolute top-4"></div>}
                </div>
                <div className="md:w-1/2 text-left bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                  <p className="text-primary-foreground/70 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
