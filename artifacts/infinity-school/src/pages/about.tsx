import { BookOpen, Target, Award, Users, Trophy, Dumbbell, Monitor, Building2, Lightbulb, Heart, GraduationCap, Star } from "lucide-react";
import { motion } from "framer-motion";
import imgPooja from "@/assets/staff-pooja-rani.jpeg";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="bg-primary pt-24 pb-20 text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative z-10">
          <span className="inline-block bg-secondary/20 text-secondary border border-secondary/30 rounded-full px-4 py-1 text-xs font-bold tracking-widest uppercase mb-4">
            Our Story
          </span>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">About Infinity Public School</h1>
          <p className="text-primary-foreground/80 max-w-3xl mx-auto text-lg leading-relaxed">
            A premier integrated school in Kursi, Barabanki — combining CBSE excellence with IIT-JEE and NEET preparation to shape India's next generation of leaders, doctors, and engineers.
          </p>
        </div>
      </section>

      {/* Our Story — History */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-xs font-bold text-secondary tracking-widest uppercase">Our History</span>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mt-2 mb-6">Born from a Vision, Built on Trust</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Infinity Public School was founded in 2023 in the heart of Kursi, Barabanki, with a singular purpose — to make quality integrated education accessible to every family in the region. Our founders, Dr. Nisar Ahmad Nadvi and Dr. Arshi Ahmad, observed a troubling pattern: talented students from Barabanki were forced to travel to distant cities or manage gruelling dual schedules of school plus coaching, often at great expense and personal cost.
                </p>
                <p>
                  The answer was Infinity Public School — an institution that brings the best of CBSE schooling and competitive exam preparation under a single roof, in one timetable, on one campus. Within just three years, the school has grown to serve over 450 students from Nursery to Class 12, earning the trust of families across Barabanki and neighbouring districts.
                </p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="grid grid-cols-2 gap-4">
              {[
                { value: "450+", label: "Students Enrolled" },
                { value: "3+", label: "Years of Excellence" },
                { value: "20+", label: "Expert Faculty" },
                { value: "100%", label: "Scholarship Available" },
              ].map(({ value, label }) => (
                <div key={label} className="bg-primary/5 border border-primary/10 rounded-2xl p-6 text-center">
                  <p className="text-3xl font-bold text-secondary">{value}</p>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-white p-10 rounded-3xl border border-border shadow-sm">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                <Target size={28} />
              </div>
              <h2 className="text-2xl font-bold font-heading text-primary mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To be the premier educational institution in Uttar Pradesh — one that seamlessly integrates holistic academic growth with world-class competitive examination preparation, empowering every student to achieve their highest potential without the burden of managing parallel schooling and coaching.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="bg-primary p-10 rounded-3xl text-white shadow-xl">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-secondary">
                <Award size={28} />
              </div>
              <h2 className="text-2xl font-bold font-heading mb-4">Our Mission</h2>
              <ul className="space-y-3 text-primary-foreground/90">
                {[
                  "Deliver CBSE academics and JEE/NEET preparation in a single, stress-free schedule.",
                  "Bring the best educators and modern pedagogy to Barabanki.",
                  "Nurture discipline, ethics, and critical thinking from the earliest classes.",
                  "Build character alongside academics — producing leaders, not just exam-qualifiers.",
                  "Partner with parents as stakeholders in every child's journey.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-secondary font-bold text-lg mt-[-2px]">→</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-secondary tracking-widest uppercase">What Makes Us Different</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mt-2">The Infinity Advantage</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <GraduationCap size={26} />,
                title: "Academic Excellence",
                desc: "Our CBSE curriculum is delivered by highly qualified faculty who set the bar high. Regular assessments, doubt-clearing sessions, and personalised academic plans ensure every student performs at their best."
              },
              {
                icon: <Monitor size={26} />,
                title: "Digital Learning",
                desc: "Smart classrooms equipped with digital boards, projectors, and e-learning tools make lessons immersive and engaging. Technology is woven into our teaching to prepare students for a digital future."
              },
              {
                icon: <Star size={26} />,
                title: "Experienced Faculty",
                desc: "Our team of 20+ educators brings decades of teaching and coaching experience. Many are specialist faculty for JEE/NEET preparation, providing school-level academics and coaching-level expertise in one place."
              },
              {
                icon: <Heart size={26} />,
                title: "Character Building",
                desc: "We believe great education must shape character. Values like integrity, empathy, resilience, and responsibility are woven into daily school life through activities, mentorship, and role-model leadership."
              },
              {
                icon: <Dumbbell size={26} />,
                title: "Sports & Physical Education",
                desc: "A healthy body fosters a sharp mind. Our sports program offers structured physical education, competitive inter-class events, and dedicated grounds to ensure every student remains active, focused, and energised."
              },
              {
                icon: <Lightbulb size={26} />,
                title: "Leadership & Discipline",
                desc: "From morning assembly to classroom conduct, Infinity instils a culture of self-discipline and leadership. Students are groomed to take initiative, manage time effectively, and lead both in and out of the classroom."
              },
              {
                icon: <Building2 size={26} />,
                title: "World-Class Infrastructure",
                desc: "State-of-the-art classrooms, fully equipped science labs, a well-stocked library, dedicated computer lab, modern hostels, and secure transport make Infinity a truly self-sufficient campus."
              },
              {
                icon: <Trophy size={26} />,
                title: "Competitive Exam Preparation",
                desc: "From Class 6 foundations to Class 12 advanced batches, our integrated curriculum systematically prepares students for IIT-JEE, NEET, NTSE, and Olympiads — without the stress of a separate coaching institute."
              },
              {
                icon: <Users size={26} />,
                title: "Parent Partnership",
                desc: "Parents are co-architects of each child's success. We maintain transparent, regular communication through PTMs, progress reports, and a dedicated parent support channel — keeping families informed and involved."
              },
            ].map((pillar, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-muted p-7 rounded-2xl border border-border hover:shadow-md hover:border-primary/20 transition-all group">
                <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-secondary mb-4 group-hover:scale-110 transition-transform">
                  {pillar.icon}
                </div>
                <h4 className="font-bold text-primary text-base mb-2">{pillar.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-border">
            <div className="grid md:grid-cols-[1fr_2fr]">
              <div className="bg-primary flex flex-col justify-end items-center text-center relative overflow-hidden min-h-[340px]">
                <img src={imgPooja} alt="Mrs. Pooja Rani" className="absolute inset-0 w-full h-full object-cover object-center" />
                <div className="relative z-10 w-full bg-gradient-to-t from-primary via-primary/80 to-transparent pt-16 pb-8 px-6">
                  <h3 className="text-2xl font-bold text-white mb-1">Mrs. Pooja Rani</h3>
                  <p className="text-secondary font-semibold text-sm">Principal</p>
                  <p className="text-xs text-primary-foreground/60 mt-1">15+ Years of Academic Leadership</p>
                </div>
              </div>
              <div className="p-10 md:p-12">
                <span className="text-xs font-bold text-secondary tracking-widest uppercase">A Message From</span>
                <h2 className="text-3xl font-heading font-bold text-primary mt-1 mb-6">Our Principal</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>"At Infinity Public School, we do not simply teach — we mentor, guide, and invest in the full potential of every child. The challenge we set out to solve was real: students in Barabanki were spending their best years commuting between school and coaching, arriving home exhausted and overwhelmed. That is not how great futures are built."</p>
                  <p>"Our integrated model brings CBSE academics and competitive preparation into one seamless daily schedule. Students attend school, study for JEE and NEET within school hours, and return home with time for self-study, rest, and family. The result is a calmer, more focused, and consistently high-performing student body."</p>
                  <p>"We are deeply committed to future goals — expanding our programs, strengthening our infrastructure, and extending our reach to more families across the region. Every child who walks through our gates deserves a personalised roadmap to success, and that is exactly what we deliver — every single day."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <span className="text-xs font-bold text-secondary tracking-widest uppercase">Our Journey</span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold mt-2 mb-16">Milestones of Excellence</h2>
          <div className="space-y-12">
            {[
              { year: "2023", title: "Infinity Public School Established", desc: "Founded in Kursi, Barabanki, with a bold vision to integrate CBSE schooling and competitive exam preparation — making quality education accessible without city-level coaching costs." },
              { year: "2024", title: "Expansion to Higher Classes", desc: "Responding to overwhelming parent trust, we expanded our programs from Nursery to Class 12 — adding Foundation, Pre-Foundation, IIT-JEE, and NEET integrated batches." },
              { year: "2025", title: "Competitive Preparation Wing Inaugurated", desc: "A dedicated wing with specialist JEE and NEET faculty, a rigorous test series, and personalised mentorship was launched — raising the bar for academic performance across all senior batches." },
              { year: "2026", title: "450+ Students & Growing", desc: "Infinity crossed a landmark of 450+ enrolled students across all classes, earning recognition as the most trusted integrated school in Barabanki. Our journey towards 1000+ continues." },
            ].map((item, i, arr) => (
              <div key={i} className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
                <div className="md:w-1/3 text-right">
                  <span className="text-4xl font-bold text-secondary font-heading">{item.year}</span>
                </div>
                <div className="hidden md:flex flex-col items-center justify-center relative">
                  <div className="w-4 h-4 rounded-full bg-secondary z-10" />
                  {i !== arr.length - 1 && <div className="w-0.5 h-32 bg-white/20 absolute top-4" />}
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
