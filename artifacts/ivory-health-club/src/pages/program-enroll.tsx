import { useMemo, useState } from "react";
import { useSearch } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";
import { useCreateEnrollment } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { AnimatedPageHero } from "@/components/layout/animated-page-hero";
import { BankTransferDetails, BankTransferPanel } from "@/components/payments/bank-transfer-panel";

type ProgramAudience = "adult" | "youth" | "corporate";
export type ProgramEnrollmentConfig = {
  key: string;
  title: string;
  eyebrow: string;
  intro: string;
  audience: ProgramAudience;
  levels: readonly string[];
};

export const PROGRAM_ENROLLMENT_OPTIONS: readonly ProgramEnrollmentConfig[] = [
  {
    key: "adult-fitness",
    title: "Adult Fitness Classes",
    eyebrow: "Ivory Performance",
    intro: "Choose from energetic group classes and structured coaching for every level.",
    audience: "adult",
    levels: ["New to training", "Regular exerciser", "Experienced athlete"],
  },
  {
    key: "kids-youth",
    title: "Kids & Youth Programs",
    eyebrow: "Active Futures",
    intro: "Give a young person a positive relationship with movement in a safe, supportive setting.",
    audience: "youth",
    levels: ["Little Movers — ages 4–6", "Kids Active Club — ages 7–12", "Teen Performance — ages 13–17"],
  },
  {
    key: "summer-camp",
    title: "Summer Camp & Fun Club",
    eyebrow: "School Holiday Experiences",
    intro: "Register for an active holiday experience filled with sports, games, and new friendships.",
    audience: "youth",
    levels: ["Junior Fun Club — ages 4–6", "Explorers Camp — ages 7–12", "Teen Leadership Club — ages 13–17"],
  },
  {
    key: "70-plus-club",
    title: "Ivory 70 Plus Club",
    eyebrow: "Active Ageing",
    intro: "Stay active, connected, and confident with gentle fitness and social activities for ages 70 and above.",
    audience: "adult",
    levels: ["New member", "Returning participant", "Joining with a friend"],
  },
  {
    key: "weight-loss-challenge",
    title: "Weight Loss Challenge",
    eyebrow: "Healthy Transformation",
    intro: "Build sustainable habits with the support, structure, and accountability to keep moving forward.",
    audience: "adult",
    levels: ["Starting my journey", "Returning to fitness", "Already active"],
  },
  {
    key: "bond4fitness",
    title: "Bond4Fitness",
    eyebrow: "Corporate Wellness",
    intro: "Bring your team together through a practical, energising corporate wellness programme.",
    audience: "corporate",
    levels: ["Exploring a team programme", "Planning a team launch", "Expanding an existing programme"],
  },
  {
    key: "fit2live-bootcamp",
    title: "Fit2Live Bootcamp",
    eyebrow: "Bootcamp",
    intro: "Build the energy, confidence, and consistency to make every day feel stronger.",
    audience: "adult",
    levels: ["New to bootcamp", "Some group training experience", "Regular bootcamp participant"],
  },
  {
    key: "personal-training",
    title: "Customised & Personal Training",
    eyebrow: "Personal Training",
    intro: "Work one-to-one with a coach on a plan designed around your body, goals, and schedule.",
    audience: "adult",
    levels: ["Beginner", "Intermediate", "Advanced"],
  },
  {
    key: "boxing-class",
    title: "Boxing Class",
    eyebrow: "Boxing",
    intro: "Build conditioning, confidence, and focus with a powerful coach-led boxing workout.",
    audience: "adult",
    levels: ["Complete beginner", "Some boxing experience", "Experienced boxer"],
  },
  {
    key: "soccer-academy",
    title: "Ivory Soccer Academy",
    eyebrow: "Sports Academy",
    intro: "Help a young player grow technically, tactically, physically, and as a teammate.",
    audience: "youth",
    levels: ["Foundation — ages 5–7", "Development — ages 8–12", "Performance — ages 13–17"],
  },
  {
    key: "tennis-academy",
    title: "Ivory Tennis Academy",
    eyebrow: "Sports Academy",
    intro: "Build a reliable all-court game with focused coaching and purposeful practice.",
    audience: "youth",
    levels: ["Mini Tennis — ages 5–7", "Junior Development — ages 8–12", "Teen Performance — ages 13–17"],
  },
  {
    key: "swimming-club",
    title: "Ivory Swimming Club",
    eyebrow: "Sports Academy",
    intro: "Build water confidence, safe progression, and a lifelong love of the water.",
    audience: "youth",
    levels: ["Water Explorers — ages 4–6", "Stroke Development — ages 7–12", "Performance Swim — ages 13–17"],
  },
  {
    key: "basketball-academy",
    title: "Ivory Basketball Academy",
    eyebrow: "Sports Academy",
    intro: "Learn the fundamentals, play creatively, and grow into a smart, confident teammate.",
    audience: "youth",
    levels: ["Rookies — ages 5–7", "Junior Development — ages 8–12", "Performance — ages 13–17"],
  },
] as const;

const formSchema = z.object({
  programKey: z.string().min(1, "Please select a program"),
  firstName: z.string().trim().min(2, "First name is required"),
  lastName: z.string().trim().min(2, "Last name is required"),
  email: z.string().trim().email("Valid email is required"),
  phone: z.string().trim().min(10, "Valid phone number is required"),
  age: z.coerce.number().int("Age must be a whole number").min(1, "Age is required").max(120, "Please enter a valid age"),
  preferredDate: z.string().min(1, "Please choose a preferred date"),
  preferredTime: z.string().optional(),
  level: z.string().min(1, "Please select an option"),
  participantName: z.string().optional(),
  companyName: z.string().optional(),
  teamSize: z.coerce.number().int().min(1, "Enter the number of team members").optional(),
  goals: z.string().trim().min(10, "Please share a little more about your goals"),
}).superRefine((data, context) => {
  const program = getProgram(data.programKey);

  if (program.audience === "youth" && !data.participantName?.trim()) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["participantName"],
      message: "Participant name is required",
    });
  }

  if (program.audience === "corporate") {
    if (!data.companyName?.trim()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["companyName"],
        message: "Company name is required",
      });
    }
    if (!data.teamSize) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["teamSize"],
        message: "Team size is required",
      });
    }
  }
});

type ProgramEnrollmentValues = z.infer<typeof formSchema>;

function getProgram(key: string | null) {
  return PROGRAM_ENROLLMENT_OPTIONS.find((program) => program.key === key) ?? PROGRAM_ENROLLMENT_OPTIONS[0];
}

export default function ProgramEnroll() {
  const search = useSearch();
  const { toast } = useToast();
  const [success, setSuccess] = useState<{ id: number; programName: string; uploadToken?: string | null } | null>(null);
  const initialProgram = useMemo(() => getProgram(new URLSearchParams(search).get("program")), [search]);
  const createEnrollment = useCreateEnrollment();

  const form = useForm<ProgramEnrollmentValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      programKey: initialProgram.key,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      age: undefined,
      preferredDate: "",
      preferredTime: "",
      level: "",
      participantName: "",
      companyName: "",
      teamSize: undefined,
      goals: "",
    },
  });

  const selectedKey = form.watch("programKey");
  const selectedProgram = getProgram(selectedKey);
  const isYouth = selectedProgram.audience === "youth";
  const isCorporate = selectedProgram.audience === "corporate";
  const today = new Date().toISOString().slice(0, 10);

  const onSubmit = (data: ProgramEnrollmentValues) => {
    const program = getProgram(data.programKey);
    const details = [
      `Program: ${program.title}`,
      `Age: ${data.age}`,
      `Experience / programme option: ${data.level}`,
      data.participantName ? `Participant name: ${data.participantName}` : null,
      data.companyName ? `Company: ${data.companyName}` : null,
      data.teamSize ? `Team size: ${data.teamSize}` : null,
      `Goals and additional information: ${data.goals}`,
    ].filter(Boolean).join("\n");

    createEnrollment.mutate(
      {
        data: {
          enrollmentType: program.key.includes("academy") ? "academy" : "program",
          programKey: program.key,
          programName: program.title,
          enrollmentDate: data.preferredDate,
          participantName: data.participantName || undefined,
          companyName: data.companyName || undefined,
          teamSize: data.teamSize || undefined,
          age: data.age,
          experience: data.level,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          notes: `${details}${data.preferredTime ? `\nPreferred time: ${data.preferredTime}` : ""}`,
        },
      },
      {
        onSuccess: (enrollment) => {
          setSuccess({ id: enrollment.id, programName: program.title, uploadToken: enrollment.receiptUploadToken });
          window.scrollTo(0, 0);
        },
        onError: () => {
          toast({
            title: "Enrollment could not be submitted",
            description: "Please check your details and try again. Our concierge team is also available to help.",
            variant: "destructive",
          });
        },
      },
    );
  };

  if (success) {
    return (
      <div className="pt-32 pb-24 min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-xl mx-auto px-6 bg-white p-10 md:p-14 shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={42} />
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary mb-3">Ivory Concierge</p>
          <h2 className="text-3xl md:text-4xl font-serif text-secondary font-bold mb-4">Enrollment Received</h2>
          <p className="text-gray-600 text-lg mb-4">
            Thank you for your interest in <strong>{success.programName}</strong>. Complete the bank transfer and upload your receipt below. Our programme team will review it before confirming your enrollment.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Reference: <span className="font-bold text-secondary">PRG-{success.id.toString().padStart(5, "0")}</span>
          </p>
          <div className="mb-8 text-left">
            <BankTransferPanel entityType="enrollment" entityId={success.id} uploadToken={success.uploadToken} />
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/programs">
              <Button variant="outline" className="w-full sm:w-auto border-secondary text-secondary rounded-[10px] uppercase tracking-wider font-bold">
                Back to Programs
              </Button>
            </Link>
            <Link href="/">
              <Button className="w-full sm:w-auto bg-secondary text-white hover:bg-primary hover:text-secondary rounded-[10px] uppercase tracking-wider font-bold">
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-6xl">
        <AnimatedPageHero
          eyebrow={selectedProgram.eyebrow}
          title="Programme Enrollment"
          description={`Take the first step toward joining ${selectedProgram.title}.`}
          compact
          className="mb-10"
        />
        <Link href="/programs" className="inline-flex items-center text-secondary hover:text-primary mb-8 font-medium transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Programs
        </Link>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-2/3 bg-white p-8 md:p-12 shadow-sm rounded-sm border border-gray-100">
            <p className="text-gray-500 mb-8">
              Complete the form below and our programme team will contact you to confirm the best session for your goals. Bank transfer is the only accepted payment method.
            </p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-secondary border-b pb-2">Programme Details</h3>
                  <FormField
                    control={form.control}
                    name="programKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selected Programme</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-none bg-gray-50">
                              <SelectValue placeholder="Select a programme" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PROGRAM_ENROLLMENT_OPTIONS.map((program) => (
                              <SelectItem key={program.key} value={program.key}>{program.title}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="preferredDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Start Date</FormLabel>
                          <FormControl><Input type="date" min={today} className="h-12 rounded-none bg-gray-50" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="preferredTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Time <span className="font-normal text-gray-400">(Optional)</span></FormLabel>
                          <FormControl><Input type="time" className="h-12 rounded-none bg-gray-50" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <h3 className="text-lg font-bold text-secondary border-b pb-2">{isYouth ? "Parent / Guardian Details" : "Your Details"}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{isYouth ? "Guardian First Name" : "First Name"}</FormLabel>
                          <FormControl><Input className="h-12 rounded-none bg-gray-50" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{isYouth ? "Guardian Last Name" : "Last Name"}</FormLabel>
                          <FormControl><Input className="h-12 rounded-none bg-gray-50" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl><Input type="email" className="h-12 rounded-none bg-gray-50" {...field} /></FormControl>
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
                          <FormControl><Input type="tel" className="h-12 rounded-none bg-gray-50" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {isYouth && (
                    <FormField
                      control={form.control}
                      name="participantName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Participant Full Name</FormLabel>
                          <FormControl><Input className="h-12 rounded-none bg-gray-50" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {isCorporate && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl><Input className="h-12 rounded-none bg-gray-50" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="teamSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Approximate Team Size</FormLabel>
                            <FormControl><Input type="number" min={1} className="h-12 rounded-none bg-gray-50" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>

                <BankTransferDetails compact />

                <div className="space-y-4 pt-2">
                  <h3 className="text-lg font-bold text-secondary border-b pb-2">About Your Goals</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{isYouth ? "Participant Age" : "Your Age"}</FormLabel>
                          <FormControl><Input type="number" min={1} max={120} className="h-12 rounded-none bg-gray-50" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{isCorporate ? "Programme Stage" : "Experience / Age Group"}</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-none bg-gray-50">
                                <SelectValue placeholder="Choose an option" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {selectedProgram.levels.map((level) => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="goals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{isCorporate ? "Tell Us About Your Team" : "Goals & Additional Information"}</FormLabel>
                        <FormControl>
                          <Textarea
                            className="min-h-[120px] rounded-none bg-gray-50 resize-none"
                            placeholder={isYouth ? "Share anything helpful about the participant's interests, needs, or experience..." : "Tell us what you want to achieve and anything our team should know..."}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-3">
                  <Button type="submit" className="w-full h-14 text-lg bg-secondary text-white hover:bg-primary hover:text-secondary rounded-none uppercase tracking-wider font-bold" disabled={createEnrollment.isPending}>
                    {createEnrollment.isPending ? "Submitting Enrollment..." : "Submit Enrollment"}
                  </Button>
                  <p className="text-xs text-center text-gray-400 mt-4">After submitting, upload your bank transfer receipt from the confirmation screen. Approval requires receipt review.</p>
                </div>
              </form>
            </Form>
          </div>

          <aside className="lg:w-1/3">
            <div className="sticky top-32 bg-secondary text-white p-8 rounded-sm shadow-xl">
              <h3 className="text-xl font-serif font-bold text-primary mb-6 border-b border-white/20 pb-4">Your Selection</h3>
              <p className="text-white/70 text-sm mb-2">Programme</p>
              <p className="text-2xl font-serif font-bold mb-7">{selectedProgram.title}</p>
              <div className="space-y-3 mb-8">
                <p className="font-bold text-sm uppercase tracking-wider text-primary">What happens next</p>
                {["Our team reviews your details", "We confirm the best session", "You receive your programme start information"].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-white/80">
                    <ChevronRight size={16} className="text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white/10 p-4 rounded-sm text-sm text-white/80">
                {selectedProgram.intro}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}