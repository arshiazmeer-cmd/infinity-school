import { Layout } from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import topper1 from "@/assets/topper-1.png";
import topper2 from "@/assets/topper-2.png";

const jeeToppers = [
  { rank: "AIR 142", name: "Rohan Srivastava", exam: "JEE Advanced 2024", img: topper1 },
  { rank: "AIR 560", name: "Aryan Singh", exam: "JEE Advanced 2024", img: topper1 },
  { rank: "99.8%ile", name: "Vivek Kumar", exam: "JEE Main 2024", img: topper1 },
];

const neetToppers = [
  { rank: "AIR 210", score: "690/720", name: "Ananya Gupta", exam: "NEET 2024", img: topper2 },
  { rank: "AIR 845", score: "675/720", name: "Shruti Verma", exam: "NEET 2024", img: topper2 },
  { rank: "AIR 1204", score: "662/720", name: "Pooja Yadav", exam: "NEET 2024", img: topper2 },
];

const yearlyData = [
  { year: '2020', selections: 25 },
  { year: '2021', selections: 38 },
  { year: '2022', selections: 45 },
  { year: '2023', selections: 62 },
  { year: '2024', selections: 85 },
];

const pieData = [
  { name: 'IITs', value: 30 },
  { name: 'NITs/IIITs', value: 45 },
  { name: 'Govt. Medical', value: 25 },
];
const COLORS = ['#063d65', '#fe8400', '#2563eb'];

export default function Results() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-primary pt-24 pb-16 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Our Wall of Fame</h1>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
          Celebrating the hard work and outstanding achievements of our students in national-level competitive exams.
        </p>
      </section>

      <section className="py-20 bg-muted">
        <div className="container mx-auto px-6">
          <Tabs defaultValue="jee" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="bg-white border border-border p-1 h-auto">
                <TabsTrigger value="jee" className="text-lg py-2 px-8">JEE Results</TabsTrigger>
                <TabsTrigger value="neet" className="text-lg py-2 px-8">NEET Results</TabsTrigger>
                <TabsTrigger value="boards" className="text-lg py-2 px-8">Board Exams</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="jee">
              <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">Top JEE Selections 2024</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {jeeToppers.map((t, i) => (
                  <Card key={i} className="overflow-hidden border-border hover:shadow-xl transition-shadow bg-gradient-to-b from-white to-primary/5">
                    <CardContent className="p-0 text-center">
                      <div className="bg-primary p-4 text-secondary font-bold text-2xl tracking-wider">
                        {t.rank}
                      </div>
                      <div className="p-6">
                        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-4 border-white shadow-md">
                          <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-xl font-bold text-primary">{t.name}</h3>
                        <p className="text-muted-foreground font-semibold mt-1">{t.exam}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="neet">
              <h2 className="text-3xl font-heading font-bold text-primary mb-8 text-center">Top NEET Selections 2024</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {neetToppers.map((t, i) => (
                  <Card key={i} className="overflow-hidden border-border hover:shadow-xl transition-shadow bg-gradient-to-b from-white to-secondary/5">
                    <CardContent className="p-0 text-center">
                      <div className="bg-secondary p-4 text-white font-bold text-2xl tracking-wider flex justify-center items-center gap-2">
                        {t.rank} <span className="text-sm font-normal">({t.score})</span>
                      </div>
                      <div className="p-6">
                        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-4 border-white shadow-md">
                          <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-xl font-bold text-primary">{t.name}</h3>
                        <p className="text-muted-foreground font-semibold mt-1">{t.exam}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="boards">
              <div className="text-center py-20 bg-white rounded-2xl border border-border">
                <h2 className="text-3xl font-bold text-primary mb-4">Board Results (Class 12th)</h2>
                <p className="text-xl text-muted-foreground">Highest Score: 98.4% | Batch Average: 86.5%</p>
                <p className="mt-4">Detailed board results will be published soon.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Success Stats */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary">Success Track Record</h2>
            <p className="text-muted-foreground mt-4">Consistent growth in selections year over year.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-muted p-8 rounded-2xl border border-border">
              <h3 className="text-xl font-bold text-primary mb-6 text-center">Year-wise Total Selections</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={yearlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="selections" fill="#063d65" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-muted p-8 rounded-2xl border border-border">
              <h3 className="text-xl font-bold text-primary mb-6 text-center">Selection Distribution (2024)</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}