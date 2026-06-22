import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

export default function FAQ() {
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
      q: "What is the student-to-teacher ratio?",
      a: "We maintain a healthy student-to-teacher ratio of 30:1 to ensure personalized attention and effective doubt-clearing for every student."
    },
    {
      q: "How often are tests conducted?",
      a: "We conduct bi-weekly minor tests and monthly major tests mimicking the exact pattern of JEE/NEET examinations to help students get accustomed to the testing environment."
    },
    {
      q: "Are there any scholarships available?",
      a: "Yes, we offer up to 100% scholarships to meritorious students based on their performance in our Admission cum Scholarship Test (AST)."
    },
    {
      q: "Do students need to join extra coaching classes?",
      a: "No, our Integrated Program is designed such that school curriculum and competitive exam preparation (JEE/NEET) happen simultaneously during school hours by expert faculty."
    },
    {
      q: "Is transportation facility available?",
      a: "Yes, we have a fleet of buses covering major routes in and around Barabanki and nearby areas to ensure safe transit for day scholars."
    },
    {
      q: "How do you communicate student progress to parents?",
      a: "We have a dedicated parent portal, send regular SMS updates, and conduct Parent-Teacher Meetings (PTM) every month to discuss the student's academic progress and well-being."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-primary pt-24 pb-16 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Frequently Asked Questions</h1>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto">
          Find answers to common questions about our programs, admissions, and facilities.
        </p>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-3xl">
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
        </div>
      </section>
    </div>
  );
}