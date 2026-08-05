import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { useListMembershipPlans, useCreateEnrollment } from "@workspace/api-client-react";
import { CheckCircle2, ChevronRight, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const enrollSchema = z.object({
  planId: z.coerce.number().min(1, "Please select a membership plan"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  notes: z.string().optional(),
});

type EnrollFormValues = z.infer<typeof enrollSchema>;

export default function Enroll() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { toast } = useToast();
  const [success, setSuccess] = useState(false);
  
  const { data: plans, isLoading: plansLoading } = useListMembershipPlans();
  const createEnrollment = useCreateEnrollment();

  const planIdFromQuery = new URLSearchParams(search).get("plan");

  const form = useForm<EnrollFormValues>({
    resolver: zodResolver(enrollSchema),
    defaultValues: {
      planId: planIdFromQuery ? parseInt(planIdFromQuery) : 0,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      dateOfBirth: "",
      notes: "",
    },
  });

  // Update form if planId in query changes after plans load
  useEffect(() => {
    if (planIdFromQuery && plans) {
      form.setValue("planId", parseInt(planIdFromQuery));
    }
  }, [planIdFromQuery, plans, form]);

  const selectedPlanId = form.watch("planId");
  const selectedPlan = plans?.find(p => p.id === selectedPlanId);

  const onSubmit = (data: EnrollFormValues) => {
    createEnrollment.mutate(
      { data },
      {
        onSuccess: () => {
          setSuccess(true);
          window.scrollTo(0, 0);
        },
        onError: () => {
          toast({
            title: "Enrollment Failed",
            description: "There was an error processing your application. Please try again.",
            variant: "destructive",
          });
        }
      }
    );
  };

  if (success) {
    return (
      <div className="pt-32 pb-24 min-h-[80vh] flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-6">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-4xl font-serif text-secondary font-bold mb-4">Application Received</h2>
          <p className="text-gray-600 text-lg mb-8">
            Thank you for applying to Ivory Health Club. Our concierge team is reviewing your application 
            and will contact you shortly with payment details to activate your membership.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/">
              <Button variant="outline" className="border-secondary text-secondary rounded-none uppercase tracking-wider font-bold">
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
        <Link href="/membership" className="inline-flex items-center text-secondary hover:text-primary mb-8 font-medium transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to Plans
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Form Side */}
          <div className="lg:w-2/3 bg-white p-8 md:p-12 shadow-sm rounded-sm">
            <h1 className="text-3xl font-serif text-secondary font-bold mb-2">Membership Application</h1>
            <p className="text-gray-500 mb-8">Please provide your details below to begin the enrollment process.</p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-secondary border-b pb-2">Plan Selection</h3>
                  <FormField
                    control={form.control}
                    name="planId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Choose a Membership Plan</FormLabel>
                        <Select
                          onValueChange={(val) => field.onChange(parseInt(val))}
                          value={field.value ? field.value.toString() : ""}
                          disabled={plansLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-none bg-gray-50">
                              <SelectValue placeholder="Select a plan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {plans?.map((plan) => (
                              <SelectItem key={plan.id} value={plan.id.toString()}>
                                {plan.name} - ₦{plan.price.toLocaleString()} / {plan.pricePeriod}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-bold text-secondary border-b pb-2">Personal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input className="h-12 rounded-none bg-gray-50" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input className="h-12 rounded-none bg-gray-50" {...field} />
                          </FormControl>
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
                          <FormControl>
                            <Input type="email" className="h-12 rounded-none bg-gray-50" {...field} />
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
                            <Input type="tel" className="h-12 rounded-none bg-gray-50" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" className="h-12 rounded-none bg-gray-50" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home Address</FormLabel>
                        <FormControl>
                          <Input className="h-12 rounded-none bg-gray-50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Requirements / Notes</FormLabel>
                        <FormControl>
                          <Textarea className="min-h-[100px] rounded-none bg-gray-50 resize-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-6">
                  <Button 
                    type="submit" 
                    className="w-full h-14 text-lg bg-secondary text-white hover:bg-primary hover:text-secondary rounded-none uppercase tracking-wider font-bold transition-colors"
                    disabled={createEnrollment.isPending}
                  >
                    {createEnrollment.isPending ? "Submitting..." : "Submit Application"}
                  </Button>
                  <p className="text-xs text-center text-gray-400 mt-4">
                    By submitting, you agree to our Terms of Service and Privacy Policy.
                    No payment is required at this step.
                  </p>
                </div>
              </form>
            </Form>
          </div>

          {/* Summary Side */}
          <div className="lg:w-1/3">
            <div className="sticky top-32 bg-secondary text-white p-8 rounded-sm shadow-xl">
              <h3 className="text-xl font-serif font-bold text-primary mb-6 border-b border-white/20 pb-4">Order Summary</h3>
              
              {selectedPlan ? (
                <div>
                  <div className="mb-6">
                    <p className="text-white/70 text-sm mb-1">Selected Plan</p>
                    <p className="text-xl font-bold">{selectedPlan.name}</p>
                  </div>
                  
                  <div className="mb-8">
                    <p className="text-white/70 text-sm mb-1">Price</p>
                    <p className="text-3xl font-bold text-primary">
                      ₦{selectedPlan.price.toLocaleString()}
                      <span className="text-sm font-normal text-white/70 ml-1">/ {selectedPlan.pricePeriod}</span>
                    </p>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    <p className="font-bold text-sm uppercase tracking-wider text-primary">Includes:</p>
                    {selectedPlan.perks.slice(0, 3).map((perk, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-white/80">
                        <ChevronRight size={16} className="text-primary shrink-0 mt-0.5" />
                        <span>{perk}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-white/10 p-4 rounded-sm text-sm">
                    <p className="font-bold text-primary mb-1">Next Steps:</p>
                    <p className="text-white/80">Once submitted, our concierge will review your application and contact you within 24 hours.</p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-white/50">
                  Select a plan from the form to view summary.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
