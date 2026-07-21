import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BROCHURE_URL, BROCHURE_FILENAME } from "@/lib/brochure";
import { motion } from "framer-motion";
import {
  BookOpen, Users, Building, ShieldCheck,
  Trophy, ArrowRight, CheckCircle2, GraduationCap,
  Phone, ChevronRight, HelpCircle,
  Star, Download, Target, Heart, Lightbulb, Award,
  Bus, Monitor, FlaskConical, Library, Home, Dumbbell, Tv2
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

import heroBg from "@/assets/hero.png";
import imgPooja from "@/assets/staff-pooja-rani.jpeg";
import staffAfshan from "@/assets/staff-afshan-parveen.jpeg";
import staffNishi from "@/assets/staff-nishi-parveen.jpeg";
import staffAnamika from "@/assets/staff-anamika.jpeg";
import infraClassroom1 from "@/assets/infra-classroom-1.jpeg";
import infraLibrary from "@/assets/infra-library.jpeg";
import infraHostel1 from "@/assets/infra-hostel-1.jpeg";

export default function HomePage() {
  const faqs = [
    {
      q: "What is the admission process for the Integrated Program?",
      a: "The admission process involves an initial inquiry, followed by counseling, an entrance/scholarship test, and final admission based on the test performance and previous academic records."
    },
    {
      q: "Do you provide hostel facilities for both boys and girls?",
      a: "Yes, we provide separate, secure, and fully-equipped hostel facilities for both boys and girls with round-the-clock security and warden supervision."
    },
    {
      q: "Are there any scholarships available?",
      a: "Yes, we offer up to 100% scholarships to meritorious students based on their performance in our Admission cum Scholarship Test (AST)."
    },
    {
      q: "From which class can a student enroll at Infinity Public School?",
      a: "We welcome students from Nursery all the way to Class 12. Our Early Foundation program starts from Nursery and builds strong academic habits from the very beginning."
    },
    {
      q: "Is the school CBSE affiliated?",
      a: "Yes, Infinity Public School follows the CBSE curriculum and ensures students meet all board requirements while simultaneously preparing for competitive exams."
    },
  ];

  const testimonials = [
    {
      name: "Reena Devi",
      relation: "Parent of Nursery Student",
      text: "I am extremely happy with the way teachers handle young children here. The classroom environment is joyful and structured. My son looks forward to school every morning!",
      rating: 5,
      tag: "Nursery Section"
    },
    {
      name: "Rajesh Verma",
      relation: "Parent of Class 3 Student",
      text: "The primary section teachers are very attentive and caring. My daughter has improved remarkably in reading and maths in just six months. Best decision we made.",
      rating: 5,
      tag: "Primary Section"
    },
    {
      name: "Sunita Yadav",
      relation: "Parent of Class 7 Student",
      text: "The foundation batch has given my son a completely different perspective on science and maths. His confidence has grown tremendously. The school maintains excellent discipline.",
      rating: 5,
      tag: "Junior Section"
    },
    {
      name: "Amit Srivastava",
      relation: "Parent of Class 9 Student",
      text: "The pre-foundation program is outstanding. My daughter is now solving problems that most Class 10 students struggle with. The faculty's dedication is unmatched in this region.",
      rating: 5,
      tag: "Junior Section"
    },
    {
      name: "Pratibha Singh",
      relation: "Parent of Class 11 (NEET) Student",
      text: "Shifting to Infinity's integrated program was the best decision for my son. He no longer has the stress of attending a separate coaching institute. The results speak for themselves.",
      rating: 5,
      tag: "Senior Section"
    },
    {
      name: "Manoj Kumar Gupta",
      relation: "Parent of Class 12 (JEE) Student",
      text: "The faculty here is at par with the best coaching institutions in the country. The test series and personalized mentorship have shaped my daughter into a focused, confident student.",
      rating: 5,
      tag: "Senior Section"
    },
  ];

  const courses = [
    { level: "Nursery – Class 5", name: "Early Foundation", highlight: "Building curiosity, literacy, and numeracy from the ground up with a joyful learning environment.", accent: "bg-secondary" },
    { level: "Classes 6–8", name: "Foundation Program", highlight: "Building strong fundamentals in Science & Maths for competitive readiness.", accent: "bg-secondary" },
    { level: "Classes 9–10", name: "Pre-Foundation", highlight: "Early preparation for NTSE, Olympiads, Boards & competitive entrance exams.", accent: "bg-secondary" },
    { level: "Classes 11–12", name: "IIT-JEE Integrated", highlight: "Rigorous, focused training for JEE Main & Advanced alongside CBSE board prep.", accent: "bg-secondary" },
    { level: "Classes 11–12", name: "NEET Integrated", highlight: "Comprehensive preparation for NEET (UG) with expert Biology, Chemistry & Physics faculty.", accent: "bg-secondary" },
    { level: "Classes 6–12", name: "School + Coaching Integration", highlight: "One campus. One schedule. No separate coaching. The Infinity Advantage at its fullest.", accent: "bg-secondary" },
  ];

  const facilities = [
    { icon: <Monitor size={28} />, name: "Smart Classrooms", desc: "Digital boards, projectors, and interactive learning tools." },
    { icon: <FlaskConical size={28} />, name: "Science Labs", desc: "Fully equipped Physics, Chemistry & Biology labs for practical learning." },
    { icon: <Monitor size={28} />, name: "Computer Lab", desc: "High-speed internet and modern systems for digital education." },
    { icon: <Library size={28} />, name: "Library", desc: "A rich collection of academic books, reference material & periodicals." },
    { icon: <Home size={28} />, name: "Hostel Facility", desc: "Safe, disciplined boarding for boys & girls with hygienic meals." },
    { icon: <Dumbbell size={28} />, name: "Sports Ground", desc: "Open ground for cricket, football, athletics & outdoor activities." },
    { icon: <Bus size={28} />, name: "Transportation", desc: "Safe and reliable bus services covering key routes in Barabanki." },
    { icon: <Tv2 size={28} />, name: "Digital Learning & Activity Room", desc: "A dedicated space for audio-visual learning, group activities, and skill development workshops." },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt="Students in modern classroom"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/96 via-primary/82 to-primary/35" />
        </div>

        <div className="relative z-10 container mx-auto px-6 pt-24 pb-36">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block py-1 px-4 rounded-full bg-secondary/20 text-secondary border border-secondary/40 font-semibold tracking-wide text-sm mb-6">
                Premium Integrated School — Barabanki
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold text-white leading-tight mb-6">
                Barabanki's Premier <br />
                <span className="text-secondary">Integrated School</span> <br />
                for IIT-JEE & NEET
              </h1>
              <p className="text-xl text-gray-200 mb-10 font-inter max-w-2xl leading-relaxed">
                Academic Excellence + Competitive Preparation Under One Roof. Give your child the foundation they need to succeed in national-level examinations.
              </p>

              <div className="flex flex-wrap gap-4 mb-16">
                <Link href="/admission">
                  <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-8 text-lg h-14 shadow-[0_0_24px_rgba(254,132,0,0.45)]">
                    Apply Now
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-8 text-lg h-14 shadow-[0_0_24px_rgba(254,132,0,0.45)]">
                    Book Free Counseling
                  </Button>
                </Link>
                <a href={BROCHURE_URL} download={BROCHURE_FILENAME} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-8 text-lg h-14 shadow-[0_0_24px_rgba(254,132,0,0.45)] flex items-center gap-2">
                    <Download size={18} /> Download Brochure
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-white/10 backdrop-blur-md border-t border-white/20">
          <div className="container mx-auto px-6 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/20">
              {[
                { label: "Students Enrolled", value: "450+" },
                { label: "Years Established", value: "3+" },
                { label: "Expert Faculty", value: "20+" },
                { label: "Scholarship Seats", value: "100%" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="text-center px-4"
                >
                  <div className="text-3xl font-bold text-secondary mb-1">{stat.value}</div>
                  <div className="text-xs font-semibold text-white uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* About Infinity Public School Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-[-30%] translate-x-[30%]"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-sm font-bold text-secondary tracking-widest uppercase mb-3">Who We Are</h2>
              <h3 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-6 leading-tight">
                About Infinity Public School
              </h3>
              <p className="text-lg leading-relaxed mb-6 text-foreground">
                Infinity Public School is a premier educational institution in Kursi, Barabanki, where academic schooling and competitive exam preparation are seamlessly integrated under one roof. Founded with the vision of eliminating the dual pressure students face from managing school and coaching separately, we have built a focused, disciplined, and aspirational learning ecosystem.
              </p>
              <p className="leading-relaxed mb-8 text-foreground">
                Our curriculum is CBSE-aligned and simultaneously prepares students for IIT-JEE, NEET, and other national-level examinations — from Nursery foundations to Class 12 advanced programs.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Target size={20} />, label: "Clear Academic Vision" },
                  { icon: <Award size={20} />, label: "Excellence in Results" },
                  { icon: <Heart size={20} />, label: "Holistic Development" },
                  { icon: <Lightbulb size={20} />, label: "Competitive Preparation" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                    <span className="text-secondary">{item.icon}</span>
                    <span className="text-sm font-semibold text-primary">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              {[
                { title: "Our Vision", content: "To be the leading integrated school in Uttar Pradesh, where every student achieves board excellence and competitive exam success without the stress of managing dual schedules." },
                { title: "Our Mission", content: "Bring world-class educators and coaching methodology to Barabanki. Deliver CBSE academics and JEE/NEET preparation together, enabling students to study smarter and live better." },
                { title: "Academic Excellence", content: "We don't compromise on either front. Strong CBSE fundamentals are the backbone of our programs, complemented by intensive competitive exam preparation from early stages." },
                { title: "Discipline & Values", content: "Infinity nurtures ethical, disciplined, and socially aware students who are prepared not just for exams, but for life's challenges with confidence and integrity." },
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-2xl border border-border bg-muted/30 hover:border-primary/20 hover:bg-white transition-all">
                  <h4 className="font-bold text-primary mb-2">{item.title}</h4>
                  <p className="text-sm leading-relaxed text-foreground">{item.content}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      {/* Why Choose Infinity */}
      <section className="py-24 bg-muted relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-secondary tracking-widest uppercase mb-2">The Infinity Advantage</h2>
            <h3 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-6">Why Parents Trust Us</h3>
            <p className="text-muted-foreground text-lg">We provide a holistic ecosystem that nurtures academic excellence, competitive spirit, and personal growth.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Building className="text-secondary" size={32} />, title: "Integrated Schooling", desc: "No need for separate coaching. We cover the CBSE curriculum alongside JEE/NEET prep during regular school hours." },
              { icon: <Users className="text-secondary" size={32} />, title: "Expert Faculty", desc: "Learn from top-tier educators with proven track records from reputed national institutes and premier colleges." },
              { icon: <ShieldCheck className="text-secondary" size={32} />, title: "Hostel Facility", desc: "Safe, secure, and disciplined boarding facilities with hygienic food and dedicated doubt-clearing sessions." },
              { icon: <BookOpen className="text-secondary" size={32} />, title: "Regular Test Series", desc: "All-India level mock tests with detailed performance analysis to track progress and identify weak areas." },
              { icon: <GraduationCap className="text-secondary" size={32} />, title: "Personalized Mentorship", desc: "One-on-one attention with dedicated mentors who guide students through academic and personal challenges." },
              { icon: <Trophy className="text-secondary" size={32} />, title: "Competitive Environment", desc: "A peer group of highly motivated students that inspires healthy competition and mutual growth." },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-border p-8 rounded-2xl shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group"
              >
                <div className="w-16 h-16 rounded-xl bg-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-primary mb-3">{feature.title}</h4>
                <p className="leading-relaxed text-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Courses Offered */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-secondary tracking-widest uppercase mb-2">Academic Programs</h2>
            <h3 className="text-3xl md:text-5xl font-heading font-bold mb-6">Courses Designed for Success</h3>
            <p className="text-primary-foreground/80 text-lg">From early childhood foundation to advanced competitive preparation — one school, every stage.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors flex flex-col"
              >
                <span className={`inline-block py-1 px-3 rounded-full ${course.accent} text-white text-xs font-bold mb-4`}>
                  {course.level}
                </span>
                <h4 className="text-2xl font-bold mb-3">{course.name}</h4>
                <p className="mb-8 leading-relaxed flex-grow text-background">{course.highlight}</p>
                <Link href="/admission" className="mt-auto">
                  <Button className="w-full bg-white text-primary hover:bg-gray-100 group">
                    Enquire Now <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Key Stats Banner */}
      <section className="py-16 bg-gradient-to-r from-primary to-[#095a96] border-y-4 border-secondary text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-heading font-bold mb-10">Our Growing Legacy</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">450+</div>
              <div className="text-sm font-semibold tracking-wider">STUDENTS ENROLLED</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">3+</div>
              <div className="text-sm font-semibold tracking-wider">YEARS OF ESTABLISHMENT</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">20+</div>
              <div className="text-sm font-semibold tracking-wider">EXPERT FACULTY</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">100%</div>
              <div className="text-sm font-semibold tracking-wider">SCHOLARSHIP AVAILABLE</div>
            </div>
          </div>
        </div>
      </section>
      {/* Leadership Messages */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-secondary tracking-widest uppercase mb-2">Leadership</h2>
            <h3 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-4">Messages from Our Leaders</h3>
            <p className="text-muted-foreground">Guided by vision, driven by commitment to every student's success.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Dr. Nisar Ahmad Nadvi",
                designation: "Director",
                message: "At Infinity Public School, we are building not just students but future leaders of the nation. Our vision is to make quality integrated education accessible to every family in Barabanki and beyond. We believe that when schooling and competitive preparation work hand-in-hand, students flourish without pressure.",
              },
              {
                name: "Dr. Arshi Ahmad",
                designation: "Managing Director",
                message: "When we founded Infinity, we set out to solve the most pressing challenge facing students today — the burden of attending school and coaching separately. Our integrated model is the answer. Every rupee invested here goes back into creating the finest learning environment for your child.",
              },
              {
                name: "Mrs. Pooja Rani",
                designation: "Principal",
                message: "Our integrated curriculum brings premier competitive coaching into regular school hours, freeing up evenings for self-study and rest. We don't just teach; we mentor. Every child who walks through our gates gets a personalised roadmap, the best resources, and unwavering support to succeed.",
              },
            ].map((leader, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-muted rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="bg-primary relative flex flex-col items-center text-center overflow-hidden min-h-[220px]">
                  {leader.designation === "Principal" ? (
                    <>
                      <img
                        src={imgPooja}
                        alt={leader.name}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                      />
                      <div className="relative z-10 w-full mt-auto bg-gradient-to-t from-primary via-primary/80 to-transparent pt-12 pb-6 px-4">
                        <h4 className="text-xl font-bold text-white">{leader.name}</h4>
                        <p className="text-secondary font-semibold text-sm mt-1">{leader.designation}</p>
                      </div>
                    </>
                  ) : (
                    <div className="p-8 flex flex-col items-center w-full">
                      <div className="w-24 h-24 rounded-full bg-white/15 border-4 border-secondary/50 flex items-center justify-center mb-4">
                        <Users size={40} className="text-white/70" />
                      </div>
                      <h4 className="text-xl font-bold text-white">{leader.name}</h4>
                      <p className="text-secondary font-semibold text-sm mt-1">{leader.designation}</p>
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <div className="text-secondary text-4xl font-serif leading-none mb-2">"</div>
                  <p className="text-black font-bold text-sm leading-relaxed italic">{leader.message}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Faculty Section Preview */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold text-secondary tracking-widest uppercase mb-2">Our Mentors</h2>
              <h3 className="text-3xl md:text-5xl font-heading font-bold text-primary">Learn from the Best</h3>
            </div>
            <Link href="/faculty">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-full">
                View All Faculty
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {[
              { name: "Ms. Afshan Parveen", role: "Teacher", img: staffAfshan },
              { name: "Ms. Nishi Parveen", role: "Teacher", img: staffNishi },
              { name: "Mrs. Anamika", role: "Teacher", img: staffAnamika },
              { name: "Ms. Baby Sana", role: "Teacher", img: null },
            ].map((fac, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group border border-border hover:border-primary/20">
                <div className="aspect-[3/4] overflow-hidden bg-muted">
                  {fac.img ? (
                    <img src={fac.img} alt={fac.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/5">
                      <Users size={40} className="text-primary/20" />
                    </div>
                  )}
                </div>
                <div className="p-3 text-center">
                  <h4 className="font-bold text-xs text-primary mb-1 leading-tight">{fac.name}</h4>
                  <span className="text-xs font-semibold bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">{fac.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Top Class Facilities */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-secondary tracking-widest uppercase mb-2">Infrastructure</h2>
            <h3 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-4">Top Class Facilities</h3>
            <p className="text-muted-foreground text-lg">An environment built for focused learning, holistic development, and overall well-being.</p>
          </div>

          {/* Feature image strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { img: infraClassroom1, label: "Smart Classrooms" },
              { img: infraLibrary, label: "Library & Study Hall" },
              { img: infraHostel1, label: "Premium Hostel Facility" },
            ].map((item, i) => (
              <div key={i} className="group relative rounded-2xl overflow-hidden aspect-video shadow-md">
                <img src={item.img} alt={item.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent flex items-end p-6">
                  <h4 className="text-white font-bold text-xl">{item.label}</h4>
                </div>
              </div>
            ))}
          </div>

          {/* Facility cards grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {facilities.map((fac, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex flex-col items-center text-center p-6 bg-muted rounded-2xl border border-border hover:border-primary/20 hover:bg-white hover:shadow-md transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-secondary mb-4 group-hover:scale-110 transition-transform">
                  {fac.icon}
                </div>
                <h4 className="font-bold text-primary text-sm mb-1">{fac.name}</h4>
                <p className="text-xs leading-relaxed text-foreground">{fac.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/gallery">
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-8">
                View Full Gallery <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Admission Process & Scholarship */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-bold text-secondary tracking-widest uppercase mb-2">Admission Process</h2>
              <h3 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-10">4 Steps to Excellence</h3>

              <div className="space-y-6">
                {[
                  { step: "01", title: "Submit Inquiry", desc: "Fill out the online form or visit our campus for an initial discussion with our admission team." },
                  { step: "02", title: "Counseling Session", desc: "Meet our academic experts to understand the right program for your child's age and goals." },
                  { step: "03", title: "Entrance / Scholarship Test", desc: "Appear for our AST (Admission cum Scholarship Test) to assess eligibility and earn scholarships." },
                  { step: "04", title: "Enrollment & Confirmation", desc: "Complete documentation, fee payment, and secure your seat for the academic year." },
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full bg-secondary text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-md">
                      {s.step}
                    </div>
                    <div className="flex-1 p-5 bg-white rounded-2xl border border-border shadow-sm">
                      <h4 className="font-bold text-primary text-base mb-1">{s.title}</h4>
                      <p className="text-sm leading-relaxed text-foreground">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              <div className="relative z-10">
                <span className="inline-block py-1 px-3 rounded-full bg-secondary text-white text-xs font-bold mb-6">
                  SCHOLARSHIP PROGRAM
                </span>
                <h3 className="text-3xl font-heading font-bold mb-6">Earn Up to 100% Scholarship</h3>
                <p className="text-primary-foreground/80 mb-8 leading-relaxed">
                  We believe that financial constraints should never stand in the way of true talent. Our Infinity Admission cum Scholarship Test (IAST) offers bright minds the opportunity to study with up to 100% fee waiver.
                </p>
                <ul className="space-y-4 mb-10">
                  {[
                    "Based on merit and test performance",
                    "Available for classes Nursery to 12th",
                    "Special concessions for siblings and alumni",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="text-secondary" size={20} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/admission">
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-white h-14 text-lg">
                    Register for Scholarship Test
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-secondary tracking-widest uppercase mb-2">Testimonials</h2>
            <h3 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-4">What Parents Say About Us</h3>
            <p className="text-foreground">Trusted by parents from Nursery to Class 12 across Barabanki and neighbouring districts.</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {testimonials.map((t, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 pl-4">
                    <div className="p-8 h-full bg-muted rounded-2xl border border-border shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex gap-1 text-secondary">
                            {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                          </div>
                          <span className="text-xs font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-full">{t.tag}</span>
                        </div>
                        <p className="text-black font-bold italic mb-6 leading-relaxed text-sm">"{t.text}"</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-primary">{t.name}</h4>
                        <p className="text-xs text-muted-foreground">{t.relation}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center gap-4 mt-8">
                <CarouselPrevious className="relative static translate-x-0 translate-y-0 text-primary border-primary hover:bg-primary hover:text-white" />
                <CarouselNext className="relative static translate-x-0 translate-y-0 text-primary border-primary hover:bg-primary hover:text-white" />
              </div>
            </Carousel>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-secondary tracking-widest uppercase mb-2">Common Questions</h2>
            <h3 className="text-3xl md:text-4xl font-heading font-bold text-primary">Frequently Asked Questions</h3>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-border shadow-sm">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-b border-border last:border-0">
                  <AccordionTrigger className="text-left text-base font-semibold text-primary py-5 hover:text-secondary">
                    <span className="flex items-center gap-3">
                      <HelpCircle className="text-secondary shrink-0" size={18} />
                      {faq.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm pb-5 pl-8 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="text-center mt-8">
            <Link href="/faq" className="text-secondary font-semibold hover:underline inline-flex items-center">
              View All FAQs <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-primary rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid md:grid-cols-2">
              <div className="p-12 md:p-16 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Ready to shape your child's future?</h2>
                <p className="text-primary-foreground/80 mb-8 text-lg">Admissions are open for 2026–27 from Nursery to Class 12. Limited seats. Book a free counseling session today.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/admission">
                    <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white rounded-full">
                      Apply Online Now
                    </Button>
                  </Link>
                  <a href="tel:+919118502112">
                    <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full w-full sm:w-auto">
                      <Phone className="mr-2 w-5 h-5" /> Call Us Now
                    </Button>
                  </a>
                  <a href={BROCHURE_URL} download={BROCHURE_FILENAME} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 border border-white/20 rounded-full w-full sm:w-auto">
                      <Download className="mr-2 w-5 h-5" /> Brochure
                    </Button>
                  </a>
                </div>
              </div>
              <div className="relative min-h-[300px] bg-secondary/10 flex items-center justify-center p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-transparent opacity-50 z-0"></div>
                <div className="relative z-10 text-center space-y-4">
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto shadow-xl">
                    <GraduationCap size={36} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Admissions Open 2026–27</h3>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Nursery to Class 12<br />
                    Limited Seats Available<br />
                    Kursi, Barabanki, UP
                  </p>
                  <Link href="/contact" className="inline-block text-secondary font-semibold hover:underline text-sm">
                    Get Directions &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
