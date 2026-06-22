import { MapPin, Phone, Mail, Send, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  class: z.string().min(1, "Please select a class"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", class: "", message: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast.success("Message Sent Successfully!", {
      description: "Our admission counselor will contact you shortly.",
    });
    form.reset();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-primary pt-24 pb-16 text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Have questions about admissions, fees, or our programs? We're here to help.
          </p>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="container mx-auto px-6 max-w-6xl">

          {/* Info Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: <Phone size={28} />, title: "Call Us", desc: "+91 9118502112", sub: "Mon–Sat, 8am to 6pm", href: "tel:+919118502112" },
              { icon: <Mail size={28} />, title: "Email Us", desc: "ipskursi@gmail.com", sub: "We reply within 24 hrs", href: "mailto:ipskursi@gmail.com" },
              { icon: <MapPin size={28} />, title: "Visit Us", desc: "Kursi, Barabanki", sub: "Uttar Pradesh, India", href: "#map" },
              { icon: <Facebook size={28} />, title: "Follow Us", desc: "Facebook & Instagram", sub: "@infinity.kursi", href: "https://www.instagram.com/infinity.kursi/" },
            ].map((item, i) => (
              <a key={i} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                className="bg-white p-6 rounded-2xl shadow-sm text-center border border-border hover:border-primary/20 hover:shadow-md transition-all block">
                <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4 text-secondary">
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-primary mb-1">{item.title}</h3>
                <p className="font-semibold text-sm text-foreground">{item.desc}</p>
                <p className="text-muted-foreground text-xs mt-1">{item.sub}</p>
              </a>
            ))}
          </div>

          {/* Social links row */}
          <div className="flex justify-center gap-4 mb-12">
            <a
              href="https://www.facebook.com/profile.php?id=100095246302881"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#1877F2] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#166fe5] transition-colors shadow-sm"
            >
              <Facebook size={16} /> Follow on Facebook
            </a>
            <a
              href="https://www.instagram.com/infinity.kursi/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
              style={{ background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)" }}
            >
              <Instagram size={16} /> Follow on Instagram
            </a>
          </div>

          {/* Form + Map */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-border">
            <div className="grid lg:grid-cols-2">
              {/* Form */}
              <div className="p-8 md:p-12">
                <h2 className="text-2xl font-bold text-primary mb-6">Send us a Message</h2>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl><Input placeholder="Your Full Name" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl><Input placeholder="+91 XXXXXXXXXX" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="class" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Admission For Class</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="nursery">Nursery – Class 5 (Early Foundation)</SelectItem>
                              <SelectItem value="foundation">Classes 6–8 (Foundation)</SelectItem>
                              <SelectItem value="pre-foundation">Classes 9–10 (Pre-Foundation)</SelectItem>
                              <SelectItem value="jee">Class 11–12 (IIT-JEE)</SelectItem>
                              <SelectItem value="neet">Class 11–12 (NEET)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="message" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="How can we help you?" className="min-h-[110px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-white h-12 text-base">
                      <Send className="mr-2 h-4 w-4" /> Send Message
                    </Button>
                  </form>
                </Form>
              </div>

              {/* Google Map */}
              <div id="map" className="h-[450px] lg:h-auto min-h-full w-full relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.5!2d81.0765!3d26.7355!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zS3Vyc2ksIEJhcmFiYW5raSwgVXR0YXIgUHJhZGVzaA!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "100%" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full"
                  title="Infinity Public School Location"
                ></iframe>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="mt-10 text-center">
            <a
              href="https://wa.me/919118502112"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#1ebe5d] transition-colors shadow-lg"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Chat on WhatsApp
            </a>
          </div>

        </div>
      </section>
    </div>
  );
}
