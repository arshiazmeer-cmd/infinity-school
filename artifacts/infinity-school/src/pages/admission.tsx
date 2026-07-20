import { useState } from "react";
import { useForm } from "react-hook-form";
import { BookOpen, MapPin, CheckCircle2, ChevronRight, CheckCircle, Copy, Phone, School, User, Users, Truck, Building2, Heart, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

type FormData = {
  // Student
  studentName: string;
  gender: string;
  dateOfBirth: string;
  aadhaarNumber: string;
  bloodGroup: string;
  applyingForClass: string;
  previousSchoolName: string;
  previousClass: string;
  // Parent
  fatherName: string;
  motherName: string;
  parentMobile: string;
  alternateMobile: string;
  parentEmail: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  // Other
  transportRequired: string;
  hostelRequired: string;
  medicalCondition: string;
};

const CLASSES = [
  "Nursery", "LKG", "UKG",
  "Class 1", "Class 2", "Class 3", "Class 4", "Class 5",
  "Class 6", "Class 7", "Class 8", "Class 9", "Class 10",
  "Class 11 (Science)", "Class 12 (Science)",
];

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi",
  "Jammu & Kashmir", "Ladakh",
];

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-secondary/30">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-primary">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );
}

function FormField({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-semibold text-foreground">
        {label} {required && <span className="text-red-500">*</span>}
        {!required && <span className="text-xs text-muted-foreground font-normal ml-1">(Optional)</span>}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

function SuccessPage({ admissionId }: { admissionId: string }) {
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(admissionId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const waMsg = encodeURIComponent(
    `Hello, I recently submitted an admission enquiry at Infinity Public School. My Admission ID is: ${admissionId}. Please confirm my application.`
  );
  const waLink = `https://wa.me/919118502112?text=${waMsg}`;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <section className="bg-primary pt-24 pb-16 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Admission Form</h1>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
          Infinity Public School — Kursi, Barabanki
        </p>
      </section>

      <div className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-lg w-full text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-500" size={52} />
          </div>

          <h2 className="text-3xl font-heading font-bold text-primary mb-3">Application Received!</h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Thank you for applying! Your admission enquiry has been received successfully.
            Our admission team will contact you shortly.
          </p>

          {/* Admission ID Card */}
          <div className="bg-white border-2 border-secondary/40 rounded-2xl p-6 mb-8 shadow-lg">
            <p className="text-sm text-muted-foreground mb-2 font-semibold uppercase tracking-wider">Your Admission ID</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-bold text-primary font-mono">{admissionId}</span>
              <button
                onClick={copyId}
                className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                title="Copy Admission ID"
              >
                {copied ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              📧 A confirmation has also been sent to the school email.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-primary/5 rounded-xl p-4 text-left">
              <div className="text-2xl mb-2">📞</div>
              <h4 className="font-bold text-primary text-sm mb-1">Call Us</h4>
              <a href="tel:+919118502112" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                +91 9118502112
              </a>
            </div>
            <div className="bg-secondary/10 rounded-xl p-4 text-left">
              <div className="text-2xl mb-2">⏰</div>
              <h4 className="font-bold text-primary text-sm mb-1">Response Time</h4>
              <p className="text-muted-foreground text-sm">Within 24 hours on working days</p>
            </div>
          </div>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25d366] hover:bg-[#1da851] text-white font-bold px-6 py-3 rounded-full transition-colors mb-4 text-sm"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
          </a>

          <div className="mt-4">
            <a href="/" className="text-primary text-sm font-semibold hover:underline">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Admission() {
  const [step, setStep] = useState<"process" | "form" | "success">("process");
  const [submittedId, setSubmittedId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      gender: "",
      applyingForClass: "",
      previousClass: "",
      bloodGroup: "",
      state: "",
      transportRequired: "No",
      hostelRequired: "No",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
      const response = await fetch(`${baseUrl}/api/admissions`.replace(/^\/\//, "/"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          transportRequired: data.transportRequired === "Yes",
          hostelRequired: data.hostelRequired === "Yes",
        }),
      });

      const result = await response.json() as { admissionId?: string; error?: string };

      if (!response.ok) {
        toast.error(result.error ?? "Submission failed. Please try again.");
        return;
      }

      setSubmittedId(result.admissionId ?? "");
      reset();
      setStep("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === "success") {
    return <SuccessPage admissionId={submittedId} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="bg-primary pt-24 pb-16 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Admission 2026–27</h1>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
          Join Infinity Public School and take the first step towards a brilliant future.
        </p>
      </section>

      {step === "process" && (
        <>
          {/* Process Flow */}
          <section className="py-20 bg-muted">
            <div className="container mx-auto px-6 max-w-5xl">
              <h2 className="text-3xl font-heading font-bold text-center text-primary mb-16">Simple Steps to Enroll</h2>
              <div className="grid md:grid-cols-4 gap-8 relative">
                <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-1 bg-border z-0" />
                {[
                  { step: "01", title: "Apply Online", desc: "Fill the admission enquiry form below." },
                  { step: "02", title: "Counseling", desc: "Our team contacts you within 24 hours." },
                  { step: "03", title: "Entrance Test", desc: "Appear for AST — earn up to 100% scholarship." },
                  { step: "04", title: "Admission", desc: "Submit documents & complete fee payment." },
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

          {/* Eligibility + CTA */}
          <section className="py-20 bg-white">
            <div className="container mx-auto px-6 max-w-4xl">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-heading font-bold text-primary mb-6">Eligibility Criteria</h2>
                  <ul className="space-y-4">
                    {[
                      "Class 6–8: Passed previous class from recognized board.",
                      "Class 9–10: Minimum 60% marks in previous class.",
                      "Class 11: Minimum 65% in Class 10 Boards with Science & Maths.",
                      "Aadhaar card and valid Transfer Certificate mandatory.",
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
                    <p className="text-sm text-muted-foreground">Strictly merit-based. Top scorers can avail up to 100% scholarship on tuition fees.</p>
                  </div>
                </div>
                <div className="bg-primary text-white p-8 rounded-2xl shadow-xl">
                  <h3 className="text-2xl font-bold mb-4">Ready to Apply?</h3>
                  <p className="text-primary-foreground/80 mb-6 text-sm leading-relaxed">
                    Fill our quick online admission form. Our counselling team will reach out within 24 hours of submission.
                  </p>
                  <ul className="space-y-2 mb-8">
                    {["Takes less than 5 minutes", "No fees to apply", "Instant confirmation via email", "Direct WhatsApp support"].map((t, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-primary-foreground/80">
                        <CheckCircle size={16} className="text-secondary shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full bg-secondary hover:bg-secondary/90 text-white h-14 text-lg"
                    onClick={() => { setStep("form"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  >
                    Fill Admission Form <ChevronRight className="ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {step === "form" && (
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4 max-w-3xl">
            {/* Header Card */}
            <div className="bg-primary text-white rounded-2xl p-6 mb-8 text-center shadow-lg">
              <BookOpen className="mx-auto mb-3" size={32} />
              <h2 className="text-2xl font-heading font-bold">Online Admission Enquiry Form</h2>
              <p className="text-primary-foreground/80 text-sm mt-1">Session 2026–27 · Infinity Public School, Kursi</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* STUDENT DETAILS */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-border">
                <SectionHeader icon={<User size={20} />} title="Student Details" subtitle="Information about the student applying" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <FormField label="Student Full Name" required error={errors.studentName?.message}>
                      <Input
                        placeholder="Enter student's full name"
                        {...register("studentName", { required: "Student name is required", minLength: { value: 3, message: "Name too short" } })}
                        className={errors.studentName ? "border-red-400" : ""}
                      />
                    </FormField>
                  </div>

                  <FormField label="Gender" required error={errors.gender?.message}>
                    <Select onValueChange={(v) => setValue("gender", v, { shouldValidate: true })}>
                      <SelectTrigger className={errors.gender ? "border-red-400" : ""}>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register("gender", { required: "Gender is required" })} />
                  </FormField>

                  <FormField label="Date of Birth" required error={errors.dateOfBirth?.message}>
                    <Input
                      type="date"
                      {...register("dateOfBirth", { required: "Date of birth is required" })}
                      className={errors.dateOfBirth ? "border-red-400" : ""}
                    />
                  </FormField>

                  <FormField label="Aadhaar Number" error={errors.aadhaarNumber?.message}>
                    <Input
                      placeholder="12-digit Aadhaar number"
                      maxLength={12}
                      {...register("aadhaarNumber", {
                        pattern: { value: /^\d{12}$/, message: "Aadhaar must be exactly 12 digits" },
                      })}
                    />
                  </FormField>

                  <FormField label="Blood Group">
                    <Select onValueChange={(v) => setValue("bloodGroup", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {BLOOD_GROUPS.map((bg) => (
                          <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormField>

                  <FormField label="Applying for Class" required error={errors.applyingForClass?.message}>
                    <Select onValueChange={(v) => setValue("applyingForClass", v, { shouldValidate: true })}>
                      <SelectTrigger className={errors.applyingForClass ? "border-red-400" : ""}>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {CLASSES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register("applyingForClass", { required: "Class is required" })} />
                  </FormField>

                  <FormField label="Previous School Name" required error={errors.previousSchoolName?.message}>
                    <Input
                      placeholder="Name of previous school"
                      {...register("previousSchoolName", { required: "Previous school name is required" })}
                      className={errors.previousSchoolName ? "border-red-400" : ""}
                    />
                  </FormField>

                  <FormField label="Previous Class" required error={errors.previousClass?.message}>
                    <Select onValueChange={(v) => setValue("previousClass", v, { shouldValidate: true })}>
                      <SelectTrigger className={errors.previousClass ? "border-red-400" : ""}>
                        <SelectValue placeholder="Select previous class" />
                      </SelectTrigger>
                      <SelectContent>
                        {CLASSES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register("previousClass", { required: "Previous class is required" })} />
                  </FormField>
                </div>
              </div>

              {/* PARENT DETAILS */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-border">
                <SectionHeader icon={<Users size={20} />} title="Parent / Guardian Details" subtitle="Contact information for follow-up" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField label="Father's Name" required error={errors.fatherName?.message}>
                    <Input
                      placeholder="Father's full name"
                      {...register("fatherName", { required: "Father's name is required" })}
                      className={errors.fatherName ? "border-red-400" : ""}
                    />
                  </FormField>

                  <FormField label="Mother's Name" required error={errors.motherName?.message}>
                    <Input
                      placeholder="Mother's full name"
                      {...register("motherName", { required: "Mother's name is required" })}
                      className={errors.motherName ? "border-red-400" : ""}
                    />
                  </FormField>

                  <FormField label="Parent Mobile Number" required error={errors.parentMobile?.message}>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground">
                        +91
                      </span>
                      <Input
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        className={`rounded-l-none ${errors.parentMobile ? "border-red-400" : ""}`}
                        {...register("parentMobile", {
                          required: "Mobile number is required",
                          pattern: { value: /^[6-9]\d{9}$/, message: "Enter valid 10-digit mobile number" },
                        })}
                      />
                    </div>
                  </FormField>

                  <FormField label="Alternate Mobile Number" error={errors.alternateMobile?.message}>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm text-muted-foreground">
                        +91
                      </span>
                      <Input
                        placeholder="Alternate number"
                        maxLength={10}
                        className="rounded-l-none"
                        {...register("alternateMobile", {
                          pattern: { value: /^[6-9]\d{9}$/, message: "Enter valid 10-digit mobile number" },
                        })}
                      />
                    </div>
                  </FormField>

                  <div className="md:col-span-2">
                    <FormField label="Parent Email Address" required error={errors.parentEmail?.message}>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        {...register("parentEmail", {
                          required: "Email is required",
                          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
                        })}
                        className={errors.parentEmail ? "border-red-400" : ""}
                      />
                    </FormField>
                  </div>

                  <div className="md:col-span-2">
                    <FormField label="Complete Residential Address" required error={errors.address?.message}>
                      <Textarea
                        placeholder="House / Flat No., Street, Area, Locality"
                        rows={3}
                        {...register("address", { required: "Address is required" })}
                        className={errors.address ? "border-red-400" : ""}
                      />
                    </FormField>
                  </div>

                  <FormField label="City" required error={errors.city?.message}>
                    <Input
                      placeholder="City"
                      {...register("city", { required: "City is required" })}
                      className={errors.city ? "border-red-400" : ""}
                    />
                  </FormField>

                  <FormField label="State" required error={errors.state?.message}>
                    <Select onValueChange={(v) => setValue("state", v, { shouldValidate: true })}>
                      <SelectTrigger className={errors.state ? "border-red-400" : ""}>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {STATES.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register("state", { required: "State is required" })} />
                  </FormField>

                  <FormField label="PIN Code" required error={errors.pinCode?.message}>
                    <Input
                      placeholder="6-digit PIN code"
                      maxLength={6}
                      {...register("pinCode", {
                        required: "PIN code is required",
                        pattern: { value: /^\d{6}$/, message: "Enter valid 6-digit PIN code" },
                      })}
                      className={errors.pinCode ? "border-red-400" : ""}
                    />
                  </FormField>
                </div>
              </div>

              {/* OTHER DETAILS */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-border">
                <SectionHeader icon={<Heart size={20} />} title="Other Details" />
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Truck size={16} className="text-primary" />
                        Transport Required? <span className="text-red-500">*</span>
                      </Label>
                      <RadioGroup
                        defaultValue="No"
                        onValueChange={(v) => setValue("transportRequired", v)}
                        className="flex gap-6 mt-2"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="Yes" id="transport-yes" />
                          <Label htmlFor="transport-yes" className="font-normal cursor-pointer">Yes</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="No" id="transport-no" />
                          <Label htmlFor="transport-no" className="font-normal cursor-pointer">No</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div>
                      <Label className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Building2 size={16} className="text-primary" />
                        Hostel Required? <span className="text-red-500">*</span>
                      </Label>
                      <RadioGroup
                        defaultValue="No"
                        onValueChange={(v) => setValue("hostelRequired", v)}
                        className="flex gap-6 mt-2"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="Yes" id="hostel-yes" />
                          <Label htmlFor="hostel-yes" className="font-normal cursor-pointer">Yes</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="No" id="hostel-no" />
                          <Label htmlFor="hostel-no" className="font-normal cursor-pointer">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <FormField label="Special Medical Condition / Remarks">
                    <Textarea
                      placeholder="Mention any special medical condition, allergy, disability, or other important note (if any)"
                      rows={3}
                      {...register("medicalCondition")}
                    />
                  </FormField>
                </div>
              </div>

              {/* Submit */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
                <div className="flex items-start gap-3 mb-6 p-4 bg-blue-50 rounded-xl">
                  <AlertCircle size={20} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-700">
                    By submitting this form you confirm that all information provided is accurate. Our team will contact you within 24 working hours.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep("process")}
                    disabled={isSubmitting}
                  >
                    ← Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-secondary hover:bg-secondary/90 text-white h-12 text-base font-bold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting…
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <School size={18} />
                        Submit Application
                      </span>
                    )}
                  </Button>
                </div>
                <p className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
                  <Phone size={12} /> Need help? Call us at <a href="tel:+919118502112" className="text-primary font-semibold">+91 9118502112</a>
                </p>
              </div>
            </form>
          </div>
        </section>
      )}
    </div>
  );
}
