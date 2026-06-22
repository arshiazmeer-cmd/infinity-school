import { BookOpen, MapPin, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Admission() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-primary pt-24 pb-16 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Admission Process</h1>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
          Join Infinity Public School and take the first step towards a successful career in Engineering or Medicine.
        </p>
      </section>

      {/* Process Flow */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-3xl font-heading font-bold text-center text-primary mb-16">Simple Steps to Enroll</h2>
          
          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-1 bg-border z-0"></div>
            
            {[
              { step: "01", title: "Inquiry", desc: "Submit an online inquiry or visit campus." },
              { step: "02", title: "Counseling", desc: "Expert guidance to choose the right program." },
              { step: "03", title: "Entrance Test", desc: "Appear for AST for admission & scholarship." },
              { step: "04", title: "Admission", desc: "Document submission & fee payment." },
            ].map((s, i) => (
              <div key={i} className="relative z-10 text-center">
                <div className="w-24 h-24 mx-auto bg-white rounded-full border-4 border-secondary flex items-center justify-center shadow-lg mb-6 text-2xl font-bold text-primary">
                  {s.step}
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">{s.title}</h3>
                <p className="text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold text-primary mb-6">Eligibility Criteria</h2>
              <ul className="space-y-4">
                {[
                  "Class 6-8: Passed previous class from recognized board.",
                  "Class 9-10: Minimum 60% in previous class.",
                  "Class 11: Minimum 65% in Class 10th Boards with Science & Maths.",
                  "Aadhaar card and valid transfer certificate mandatory."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-secondary mt-1 shrink-0" size={20} />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/10">
                <h3 className="font-bold text-primary mb-2 flex items-center gap-2">
                  <MapPin size={20} className="text-secondary" /> Entrance Test (AST)
                </h3>
                <p className="text-sm text-muted-foreground">Admissions to competitive batches are strictly based on performance in the Admission cum Scholarship Test. Top scorers can avail up to 100% scholarship.</p>
              </div>
            </div>
            
            <div className="bg-primary text-white p-8 rounded-2xl shadow-xl">
              <h3 className="text-2xl font-bold mb-6">Ready to Apply?</h3>
              <p className="text-primary-foreground/80 mb-8">
                Start your application process online. Our team will reach out to you within 24 hours.
              </p>
              <Link href="/contact">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-white h-14 text-lg">
                  Fill Admission Form <ChevronRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}