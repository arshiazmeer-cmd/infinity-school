import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

import heroBg from "@/assets/hero.png";
import facility2 from "@/assets/facility-2.png";

const posts = [
  {
    id: 1,
    title: "How to Balance School Boards and JEE Preparation Effectively",
    date: "March 5, 2024",
    category: "JEE Tips",
    img: heroBg,
    excerpt: "Discover the proven strategies to manage your time between CBSE board curriculum and advanced JEE problem-solving without burning out."
  },
  {
    id: 2,
    title: "Top 10 Important Chapters for NEET Biology",
    date: "February 28, 2024",
    category: "NEET Guide",
    img: facility2,
    excerpt: "An analysis of the past 5 years of NEET papers reveals the high-weightage chapters you cannot afford to skip in Biology."
  },
  {
    id: 3,
    title: "The Importance of Mock Tests in Competitive Exams",
    date: "February 15, 2024",
    category: "Exam Strategy",
    img: heroBg,
    excerpt: "Why studying theory is not enough. Learn how attempting regular full-length mock tests improves speed, accuracy, and temperament."
  },
  {
    id: 4,
    title: "Managing Stress: A Guide for Aspirants and Parents",
    date: "January 30, 2024",
    category: "Mental Health",
    img: facility2,
    excerpt: "Practical tips for students to handle exam anxiety and how parents can create a supportive environment at home."
  }
];

export default function Blog() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-primary pt-24 pb-16 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">News & Resources</h1>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
          Preparation strategies, exam updates, and success tips from our expert mentors.
        </p>
      </section>

      <section className="py-20 bg-muted min-h-screen">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden border-border hover:shadow-xl transition-shadow bg-white flex flex-col">
                <div className="aspect-[16/9] overflow-hidden relative">
                  <Badge className="absolute top-4 left-4 z-10 bg-secondary text-white border-none">{post.category}</Badge>
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <CardHeader className="pb-2">
                  <p className="text-sm text-muted-foreground mb-2">{post.date}</p>
                  <CardTitle className="text-2xl font-bold text-primary leading-tight hover:text-secondary cursor-pointer transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <Link href="#" className="inline-flex items-center text-secondary font-semibold hover:underline mt-auto">
                    Read Full Article <ArrowRight size={16} className="ml-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}