import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import faculty1 from "@/assets/faculty-1.png";
import faculty2 from "@/assets/faculty-2.png";
import faculty3 from "@/assets/faculty-3.png";
import faculty4 from "@/assets/faculty-4.png";

const facultyData = [
  { id: 1, name: "Dr. Rajesh Kumar", subject: "Physics", dept: "physics", desc: "IIT Delhi • 12 Yrs Exp", exp: 12, img: faculty1 },
  { id: 2, name: "Amit Singh", subject: "Mathematics", dept: "maths", desc: "NIT Allahabad • 10 Yrs Exp", exp: 10, img: faculty3 },
  { id: 3, name: "Dr. Priya Sharma", subject: "Biology", dept: "biology", desc: "AIIMS • 8 Yrs Exp", exp: 8, img: faculty2 },
  { id: 4, name: "Neha Gupta", subject: "Chemistry", dept: "chemistry", desc: "Delhi Univ • 7 Yrs Exp", exp: 7, img: faculty4 },
  { id: 5, name: "Vikas Yadav", subject: "Physics", dept: "physics", desc: "IIT Kanpur • 9 Yrs Exp", exp: 9, img: faculty1 },
  { id: 6, name: "Ritu Verma", subject: "Biology", dept: "biology", desc: "KGMU Lucknow • 6 Yrs Exp", exp: 6, img: faculty2 },
  { id: 7, name: "Anand Tiwari", subject: "Chemistry", dept: "chemistry", desc: "BHU • 11 Yrs Exp", exp: 11, img: faculty4 },
  { id: 8, name: "Saurabh Mishra", subject: "Mathematics", dept: "maths", desc: "IIT Roorkee • 8 Yrs Exp", exp: 8, img: faculty3 },
];

export default function Faculty() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredFaculty = activeTab === "all" 
    ? facultyData 
    : facultyData.filter(f => f.dept === activeTab);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-primary pt-24 pb-16 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Our Expert Faculty</h1>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
          Learn from the finest educators across the country. Our faculty comprises alumni from top-tier institutions.
        </p>
      </section>

      <section className="py-20 bg-muted min-h-[60vh]">
        <div className="container mx-auto px-6">
          <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full mb-12">
            <div className="flex justify-center mb-10">
              <TabsList className="bg-white border border-border p-1">
                <TabsTrigger value="all">All Departments</TabsTrigger>
                <TabsTrigger value="physics">Physics</TabsTrigger>
                <TabsTrigger value="chemistry">Chemistry</TabsTrigger>
                <TabsTrigger value="maths">Mathematics</TabsTrigger>
                <TabsTrigger value="biology">Biology</TabsTrigger>
              </TabsList>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredFaculty.map((fac) => (
                <div key={fac.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-border hover:border-primary/20">
                  <div className="aspect-[3/4] overflow-hidden bg-muted">
                    <img 
                      src={fac.img} 
                      alt={fac.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                  <div className="p-6 text-center relative">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-secondary text-white hover:bg-secondary pointer-events-none">
                        {fac.subject}
                      </Badge>
                    </div>
                    <h4 className="font-bold text-xl text-primary mt-2 mb-1">{fac.name}</h4>
                    <p className="text-muted-foreground text-sm font-medium">{fac.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Tabs>
        </div>
      </section>
    </div>
  );
}