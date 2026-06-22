import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  BookOpen, Users, Building, ShieldCheck, 
  Trophy, ArrowRight, CheckCircle2, GraduationCap, 
  Clock, MapPin, Phone, ChevronRight, HelpCircle,
  Star
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

import heroBg from "@/assets/hero.png";
import faculty1 from "@/assets/faculty-1.png";
import faculty2 from "@/assets/faculty-2.png";
import faculty3 from "@/assets/faculty-3.png";
import faculty4 from "@/assets/faculty-4.png";
import topper1 from "@/assets/topper-1.png";
import topper2 from "@/assets/topper-2.png";
import facility1 from "@/assets/facility-1.png";
import facility2 from "@/assets/facility-2.png";
import facility3 from "@/assets/facility-3.png";

export default function Home() {
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
    }
  ];

  const testimonials = [
    { name: "Suresh Gupta", relation: "Parent of Class 11 Student", text: "The integrated approach at Infinity saved my son from the exhaustion of attending school and coaching separately. He is now much more relaxed and his mock test scores are improving steadily.", rating: 5 },
    { name: "Rahul Sharma", relation: "JEE Advanced 2023 Qualifier", text: "The faculty here is top-notch. They clear doubts patiently and the test series exactly mirrors the real exam pattern. I owe my success entirely to the mentors here.", rating: 5 },
    { name: "Anita Yadav", relation: "Parent of Class 9 Student", text: "We shifted our daughter to the pre-foundation batch and the change in her analytical thinking is remarkable. The environment is competitive yet highly supportive.", rating: 5 },
    { name: "Sneha Singh", relation: "NEET 2023 Qualifier", text: "The biology department is outstanding. The hostel facility meant I didn't waste any time commuting. It truly is a premium institute in Barabanki.", rating: 5 }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 2. Admission Open Banner */}
      <div className="bg-primary text-secondary overflow-hidden py-2 whitespace-nowrap">
        <div className="inline-block animate-[marquee_20s_linear_infinite]">
          <span className="text-sm font-bold tracking-wider uppercase flex items-center gap-4">
            <span>🎓 Admissions Open 2025-26</span>
            <span>|</span>
            <span>Limited Seats</span>
            <span>|</span>
            <span><Link href="/admission" className="underline hover:text-white transition-colors">Apply Now</Link></span>
            <span className="ml-4">🎓 Admissions Open 2025-26</span>
            <span>|</span>
            <span>Limited Seats</span>
            <span>|</span>
            <span><Link href="/admission" className="underline hover:text-white transition-colors">Apply Now</Link></span>
          </span>
        </div>
      </div>

      {/* 3. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="Students in modern classroom" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
        </div>

        <div className="relative z-10 container mx-auto px-6 pt-20 pb-32">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-secondary/20 text-secondary border border-secondary/30 font-semibold tracking-wide text-sm mb-6">
                Premium Integrated School
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold text-white leading-tight mb-6">
                Barabanki's Premier <br />
                <span className="text-secondary">Integrated School</span> <br />
                for IIT-JEE & NEET
              </h1>
              <p className="text-xl text-gray-200 mb-10 font-inter max-w-2xl leading-relaxed">
                Academic Excellence + Competitive Preparation Under One Roof. Give your child the foundation they need to succeed in national-level examinations without compromising their schooling.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-16">
                <Link href="/admission">
                  <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white rounded-full px-8 text-lg h-14 shadow-[0_0_20px_rgba(254,132,0,0.4)]">
                    Apply Now
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-white text-primary hover:bg-white rounded-full px-8 text-lg h-14">
                    Book Free Counseling
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 rounded-full px-8 text-lg h-14">
                    Download Brochure
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-white/10 backdrop-blur-md border-t border-white/20">
          <div className="container mx-auto px-6 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/20">
              {[
                { label: "Students", value: "500+" },
                { label: "Success Rate", value: "95%" },
                { label: "Years Experience", value: "10+" },
                { label: "Top Rankers", value: "50+" },
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="text-center px-4"
                >
                  <div className="text-3xl font-bold text-secondary mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-white uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Notice Board / Latest Updates */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-sm border border-border p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-3 shrink-0 bg-primary/5 text-primary px-4 py-2 rounded-lg font-semibold">
              <Clock className="text-secondary" size={20} />
              Latest Updates
            </div>
            <div className="overflow-hidden relative w-full h-8">
              <div className="absolute top-0 left-0 w-full animate-[marquee_15s_linear_infinite] whitespace-nowrap text-muted-foreground">
                <span className="mx-4 inline-flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-secondary"></div> Scholarship Test Date Announced: 15th Oct 2024</span>
                <span className="mx-4 inline-flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-secondary"></div> Class 11th Foundation Batch Starting from 1st April</span>
                <span className="mx-4 inline-flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-secondary"></div> NEET 2024 Results Declared - 5 Selections!</span>
              </div>
            </div>
            <Link href="/blog" className="shrink-0 text-sm font-semibold text-primary hover:text-secondary flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Infinity Public School */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/3"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-secondary tracking-widest uppercase mb-2">The Infinity Advantage</h2>
            <h3 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-6">Why Parents Trust Us</h3>
            <p className="text-muted-foreground text-lg">We provide a holistic ecosystem that nurtures academic excellence, competitive spirit, and personal growth.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Building className="text-secondary" size={32} />, title: "Integrated Schooling", desc: "No need for separate coaching. We cover CBSE curriculum alongside JEE/NEET prep during regular school hours." },
              { icon: <Users className="text-secondary" size={32} />, title: "Expert Faculty", desc: "Learn from top-tier educators with proven track records from reputed national institutes and premier colleges." },
              { icon: <ShieldCheck className="text-secondary" size={32} />, title: "Hostel Facility", desc: "Safe, secure, and disciplined boarding facilities with hygienic food and dedicated doubt-clearing sessions." },
              { icon: <BookOpen className="text-secondary" size={32} />, title: "Regular Test Series", desc: "All-India level mock tests with detailed performance analysis to track progress and identify weak areas." },
              { icon: <GraduationCap className="text-secondary" size={32} />, title: "Personalized Mentorship", desc: "One-on-one attention with dedicated mentors who guide students through academic and psychological challenges." },
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
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Courses Offered */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-secondary tracking-widest uppercase mb-2">Academic Programs</h2>
            <h3 className="text-3xl md:text-5xl font-heading font-bold mb-6">Courses Designed for Success</h3>
            <p className="text-primary-foreground/80 text-lg">From early foundation to advanced competitive preparation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { level: "Classes 6-8", name: "Foundation Program", highlight: "Building strong fundamentals in Science & Maths." },
              { level: "Classes 9-10", name: "Pre-Foundation", highlight: "Early preparation for NTSE, Olympiads & Boards." },
              { level: "Classes 11-12", name: "IIT-JEE Integrated", highlight: "Rigorous training for JEE Main & Advanced." },
              { level: "Classes 11-12", name: "NEET Integrated", highlight: "Comprehensive preparation for Medical entrances." },
            ].map((course, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
                <span className="inline-block py-1 px-3 rounded-full bg-secondary text-white text-xs font-bold mb-4">
                  {course.level}
                </span>
                <h4 className="text-2xl font-bold mb-3">{course.name}</h4>
                <p className="text-primary-foreground/70 mb-8 h-12">{course.highlight}</p>
                <Link href="/admission">
                  <Button className="w-full bg-white text-primary hover:bg-gray-100 group">
                    Enquire Now <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Key Stats / Achievements Banner */}
      <section className="py-16 bg-gradient-to-r from-primary to-[#095a96] border-y-4 border-secondary text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-heading font-bold mb-10">A Legacy of Consistent Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">500+</div>
              <div className="text-sm font-semibold tracking-wider">STUDENTS ENROLLED</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">150+</div>
              <div className="text-sm font-semibold tracking-wider">IIT/NEET SELECTIONS</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">95%</div>
              <div className="text-sm font-semibold tracking-wider">BOARD RESULT</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">10+</div>
              <div className="text-sm font-semibold tracking-wider">YEARS OF EXCELLENCE</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Faculty Section Preview */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { img: faculty1, name: "Dr. Rajesh Kumar", desc: "IIT Delhi • 12 Yrs Exp", sub: "Physics Expert" },
              { img: faculty2, name: "Dr. Priya Sharma", desc: "AIIMS • 8 Yrs Exp", sub: "Biology Head" },
              { img: faculty3, name: "Amit Singh", desc: "NIT Allahabad • 10 Yrs Exp", sub: "Mathematics" },
              { img: faculty4, name: "Neha Gupta", desc: "Delhi Univ • 7 Yrs Exp", sub: "Chemistry" },
            ].map((fac, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <div className="aspect-[3/4] overflow-hidden">
                  <img src={fac.img} alt={fac.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 text-center">
                  <h4 className="font-bold text-lg text-primary mb-1">{fac.name}</h4>
                  <p className="text-secondary font-semibold text-sm mb-2">{fac.sub}</p>
                  <p className="text-muted-foreground text-xs">{fac.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Toppers Wall */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-secondary tracking-widest uppercase mb-2">Hall of Fame</h2>
            <h3 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-6">Our Proud Achievers</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { rank: "AIR 142", name: "Rohan Srivastava", exam: "JEE Advanced", img: topper1 },
              { rank: "AIR 210", name: "Ananya Gupta", exam: "NEET 2024", img: topper2 },
              { rank: "AIR 560", name: "Aryan Singh", exam: "JEE Advanced", img: topper1 },
              { rank: "AIR 845", name: "Shruti Verma", exam: "NEET 2024", img: topper2 },
            ].map((t, i) => (
              <div key={i} className="bg-muted p-6 rounded-2xl border border-border text-center hover:border-primary/20 hover:shadow-md transition-all">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-white shadow-sm mb-4">
                  <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div className="inline-block px-3 py-1 bg-secondary/10 text-secondary font-bold text-sm rounded-full mb-2">
                  {t.rank}
                </div>
                <h4 className="font-bold text-lg text-primary">{t.name}</h4>
                <p className="text-muted-foreground text-sm">{t.exam}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/results">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-full">
                View All Results
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Campus Facilities */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-secondary tracking-widest uppercase mb-2">Infrastructure</h2>
            <h3 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-6">World-Class Facilities</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group relative rounded-2xl overflow-hidden aspect-video md:col-span-2 shadow-sm">
              <img src={facility1} alt="Smart Classrooms" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent flex items-end p-6">
                <h4 className="text-white font-bold text-2xl">Smart Classrooms</h4>
              </div>
            </div>
            <div className="group relative rounded-2xl overflow-hidden aspect-video shadow-sm">
              <img src={facility2} alt="Science Labs" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent flex items-end p-6">
                <h4 className="text-white font-bold text-xl">Advanced Science Labs</h4>
              </div>
            </div>
            <div className="group relative rounded-2xl overflow-hidden aspect-video shadow-sm">
              <img src={facility3} alt="Premium Hostel" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent flex items-end p-6">
                <h4 className="text-white font-bold text-xl">Premium Hostel Facility</h4>
              </div>
            </div>
            <div className="group relative rounded-2xl overflow-hidden aspect-video md:col-span-2 shadow-sm bg-primary flex flex-col justify-center items-center text-center p-8">
              <h4 className="text-white font-bold text-2xl mb-4">Experience Our Campus</h4>
              <p className="text-primary-foreground/80 mb-6 max-w-md">Discover an environment built for focused learning, holistic development, and overall well-being.</p>
              <Link href="/gallery">
                <Button className="bg-secondary hover:bg-secondary/90 text-white rounded-full">
                  View Full Gallery
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 12. Admission Process & 13. Scholarship */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-bold text-secondary tracking-widest uppercase mb-2">Admission Process</h2>
              <h3 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-10">4 Steps to Excellence</h3>
              
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {[
                  { step: "01", title: "Submit Inquiry", desc: "Fill out the online form or visit our campus for counseling." },
                  { step: "02", title: "Entrance Test", desc: "Appear for our AST (Admission cum Scholarship Test)." },
                  { step: "03", title: "Counseling", desc: "Meet experts to discuss test results and choose the right program." },
                  { step: "04", title: "Enrollment", desc: "Complete documentation and secure your seat." },
                ].map((s, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-secondary text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                      {s.step}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 bg-muted rounded-2xl border border-border shadow-sm">
                      <h4 className="font-bold text-primary text-lg mb-1">{s.title}</h4>
                      <p className="text-muted-foreground text-sm">{s.desc}</p>
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
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="text-secondary" size={20} />
                    <span>Based on merit and test performance</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="text-secondary" size={20} />
                    <span>Available for classes 6th to 12th</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="text-secondary" size={20} />
                    <span>Special concessions for siblings and alumni</span>
                  </li>
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

      {/* 11. Testimonials */}
      <section className="py-24 bg-muted">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-secondary tracking-widest uppercase mb-2">Testimonials</h2>
            <h3 className="text-3xl md:text-5xl font-heading font-bold text-primary mb-6">What Parents & Students Say</h3>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {testimonials.map((t, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2 pl-4">
                    <div className="p-8 h-full bg-white rounded-2xl border border-border shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex gap-1 mb-4 text-secondary">
                          {[...Array(t.rating)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                        </div>
                        <p className="text-muted-foreground italic mb-6 leading-relaxed">"{t.text}"</p>
                      </div>
                      <div>
                        <h4 className="font-bold text-primary">{t.name}</h4>
                        <p className="text-sm text-muted-foreground">{t.relation}</p>
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

      {/* 14. FAQ Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">Frequently Asked Questions</h2>
          </div>
          <div className="bg-muted p-8 rounded-2xl border border-border">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-b border-border last:border-0">
                  <AccordionTrigger className="text-left text-lg font-semibold text-primary py-6 hover:text-secondary">
                    <span className="flex items-center gap-3">
                      <HelpCircle className="text-secondary shrink-0" size={20} />
                      {faq.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base pb-6 pl-8 leading-relaxed">
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
      
      {/* 15. Contact Preview / CTA */}
      <section className="py-24 bg-white relative overflow-hidden pt-0">
        <div className="container mx-auto px-6 relative z-10">
          <div className="bg-primary rounded-3xl overflow-hidden shadow-2xl">
            <div className="grid md:grid-cols-2">
              <div className="p-12 md:p-16 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Ready to shape your child's future?</h2>
                <p className="text-primary-foreground/80 mb-8 text-lg">Admissions are open for the academic session 2025-26. Book a free counseling session today.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/admission">
                    <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white rounded-full">
                      Apply Online Now
                    </Button>
                  </Link>
                  <a href="tel:+919118502112">
                    <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full w-full sm:w-auto">
                      <Phone className="mr-2 w-5 h-5" /> Call Us
                    </Button>
                  </a>
                </div>
              </div>
              <div className="relative min-h-[300px] bg-secondary/10 flex items-center justify-center p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-transparent opacity-50 z-0"></div>
                <div className="relative z-10 text-center space-y-6">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto text-secondary shadow-xl">
                    <MapPin size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Visit Our Campus</h3>
                  <p className="text-white/80">
                    Infinity Public School<br />
                    Kursi, Barabanki<br />
                    Uttar Pradesh, India
                  </p>
                  <Link href="/contact" className="inline-block text-secondary font-semibold hover:underline">
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