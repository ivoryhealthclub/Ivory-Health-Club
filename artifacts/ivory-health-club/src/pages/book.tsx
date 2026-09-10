import { useState } from "react";
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
import { useCreateBooking, type Booking } from "@workspace/api-client-react";
import { CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { AnimatedPageHero } from "@/components/layout/animated-page-hero";
import { BankTransferDetails, BankTransferPanel } from "@/components/payments/bank-transfer-panel";

const bookingSchema = z.object({
  serviceType: z.enum(["restaurant", "spa", "fitness_program", "gym"]),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  bookingDate: z.string().min(1, "Date is required"),
  bookingTime: z.string().optional(),
  numberOfGuests: z.coerce.number().min(1).optional(),
  specialRequests: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export default function Book() {
  const { toast } = useToast();
  const [success, setSuccess] = useState<Booking | null>(null);
  const createBooking = useCreateBooking();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      bookingDate: "",
      bookingTime: "",
      numberOfGuests: 1,
      specialRequests: "",
    },
  });

  const onSubmit = (data: BookingFormValues) => {
    createBooking.mutate(
      { data },
      {
        onSuccess: (booking) => {
          setSuccess(booking);
          window.scrollTo(0, 0);
        },
        onError: () => {
          toast({
            title: "Booking Failed",
            description: "There was an error processing your request. Please try again.",
            variant: "destructive",
          });
        }
      }
    );
  };

  if (success) {
    return (
      <div className="pt-32 pb-24 min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-lg mx-auto px-6 bg-white p-12 shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-serif text-secondary font-bold mb-4">Request Received</h2>
          <p className="text-gray-600 mb-8">
            Thank you for choosing Ivory Health Club. Your booking request is pending confirmation. Complete your bank transfer and upload the receipt below so our team can match your payment.
          </p>
          <div className="mb-8 text-left">
            <BankTransferPanel entityType="booking" entityId={success.id} uploadToken={success.receiptUploadToken} />
          </div>
          <div className="flex flex-col gap-4">
            <Button onClick={() => setSuccess(null)} variant="outline" className="w-full rounded-[10px] border-secondary text-secondary h-12 uppercase tracking-wider font-bold">
              Make Another Booking
            </Button>
            <Link href="/">
              <Button className="w-full rounded-[10px] bg-secondary text-white hover:bg-primary h-12 uppercase tracking-wider font-bold">
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
      <AnimatedPageHero
        eyebrow="The Ivory Concierge"
        title="Book an Experience"
        description="Reserve a service, treatment, or space."
        compact
        className="mb-12"
      />

      <div className="container mx-auto px-6 max-w-4xl">
        <div className="bg-white p-8 md:p-12 shadow-sm rounded-sm border border-gray-100">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Service Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-secondary border-b pb-2">Service Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="serviceType"
                    render={({ field }) => (
                      <FormItem>
                           <FormLabel>Booking type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-none bg-gray-50">
                              <SelectValue placeholder="Select service..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="spa">Luxury Spa Treatment</SelectItem>
                            <SelectItem value="restaurant">Restaurant Reservation</SelectItem>
                            <SelectItem value="fitness_program">Fitness Class</SelectItem>
                           <SelectItem value="gym">Gym Services / Activities</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="numberOfGuests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Guests</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} className="h-12 rounded-none bg-gray-50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="bookingDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Date</FormLabel>
                        <FormControl>
                          <Input type="date" className="h-12 rounded-none bg-gray-50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="bookingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Time (Optional)</FormLabel>
                        <FormControl>
                          <Input type="time" className="h-12 rounded-none bg-gray-50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-secondary border-b pb-2">Your Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                
                <FormField
                  control={form.control}
                  name="specialRequests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Requests / Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          className="min-h-[120px] rounded-none bg-gray-50 resize-none" 
                          placeholder="Tell us anything we should know to make your experience perfect..."
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <BankTransferDetails compact />
              <p className="text-sm text-gray-500">After submitting this booking, upload your bank transfer receipt using the secure link on the confirmation screen.</p>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg bg-primary text-secondary hover:bg-secondary hover:text-white rounded-none uppercase tracking-wider font-bold transition-colors shadow-lg"
                  disabled={createBooking.isPending}
                >
                  {createBooking.isPending ? "Submitting Request..." : "Request Booking"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
