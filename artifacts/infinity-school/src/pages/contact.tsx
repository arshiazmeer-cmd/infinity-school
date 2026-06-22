import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
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
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      class: "",
      message: "",
    },
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
      {/* Header */}
      <section className="bg-primary pt-24 pb-16 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Contact Us</h1>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto">
          Have questions about admissions, fees, or our programs? We're here to help. Reach out to us through any of the channels below.
        </p>
      </section>

      <section className="py-16 bg-muted">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: <Phone size={32} />, title: "Call Us", desc: "+91 9118502112", sub: "Mon-Sat, 8am to 6pm" },
              { icon: <Mail size={32} />, title: "Email Us", desc: "ipskursi@gmail.com", sub: "Online support" },
              { icon: <MapPin size={32} />, title: "Visit Us", desc: "Kursi, Barabanki", sub: "Uttar Pradesh, India" },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm text-center border border-border">
                <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 text-secondary">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
                <p className="font-semibold text-lg">{item.desc}</p>
                <p className="text-muted-foreground text-sm">{item.sub}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-border">
            <div className="grid lg:grid-cols-2">
              {/* Form */}
              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-heading font-bold text-primary mb-6">Send us a Message</h2>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+91 XXXXXXXXXX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="class"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Admission For Class</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Class" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="foundation">Classes 6-8 (Foundation)</SelectItem>
                                <SelectItem value="pre-foundation">Classes 9-10 (Pre-Foundation)</SelectItem>
                                <SelectItem value="jee">Class 11-12 (IIT-JEE)</SelectItem>
                                <SelectItem value="neet">Class 11-12 (NEET)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us how we can help you..." 
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-white h-12 text-lg">
                      <Send className="mr-2 h-5 w-5" /> Send Message
                    </Button>
                  </form>
                </Form>
              </div>

              {/* Map */}
              <div className="bg-muted h-[400px] lg:h-auto min-h-full w-full relative">
                {/* Note: This is a placeholder map. Since we can't embed an actual Google Maps iframe without an API key or an exact location embed link easily, we'll simulate it beautifully or use a generic embed */}
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d113886.68525048252!2d81.04273822180026!3d27.026723145455985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39996160da84f23b%3A0xc48083818eeb83ce!2sKursi%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1709665518428!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, minHeight: '100%' }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}