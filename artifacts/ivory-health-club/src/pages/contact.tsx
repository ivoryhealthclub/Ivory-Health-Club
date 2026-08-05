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
import { useToast } from "@/hooks/use-toast";
import { useSubmitContact } from "@workspace/api-client-react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  const submitContact = useSubmitContact();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    submitContact.mutate(
      { data },
      {
        onSuccess: () => {
          toast({
            title: "Message Sent",
            description: "Thank you for reaching out. We will get back to you shortly.",
          });
          form.reset();
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to send message. Please try again.",
            variant: "destructive",
          });
        }
      }
    );
  };

  return (
    <div className="pt-24 pb-20 bg-white">
      {/* Map/Header Area */}
      <div className="h-[40vh] bg-secondary w-full relative flex items-center justify-center">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=2000')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
         <div className="relative z-10 text-center text-white px-6">
           <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">Contact Us</h1>
           <p className="text-xl font-light opacity-90 max-w-2xl mx-auto">
             Our concierge team is at your service. Let us know how we can assist you.
           </p>
         </div>
      </div>

      <div className="container mx-auto px-6 max-w-6xl -mt-16 relative z-20">
        <div className="flex flex-col lg:flex-row shadow-2xl bg-white">
          
          {/* Contact Info */}
          <div className="lg:w-1/3 bg-[#140A3A] text-white p-12">
            <h3 className="text-3xl font-serif font-bold text-primary mb-8">Get in Touch</h3>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <MapPin className="text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Address</h4>
                  <p className="text-white/70 leading-relaxed">
                    12 Luxury Avenue,<br />
                    Victoria Island,<br />
                    Lagos, Nigeria
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Phone className="text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Phone</h4>
                  <p className="text-white/70">+234 800 IVORY CLUB</p>
                  <p className="text-white/70">+234 801 234 5678</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Mail className="text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Email</h4>
                  <p className="text-white/70">concierge@ivoryhealth.club</p>
                  <p className="text-white/70">memberships@ivoryhealth.club</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Clock className="text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Opening Hours</h4>
                  <p className="text-white/70">Mon-Fri: 5:00 AM - 11:00 PM</p>
                  <p className="text-white/70">Sat-Sun: 6:00 AM - 10:00 PM</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Form */}
          <div className="lg:w-2/3 p-12 lg:p-16">
            <h3 className="text-2xl font-bold text-secondary mb-6">Send a Message</h3>
            
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
                          <Input className="h-12 rounded-none bg-gray-50 border-gray-200 focus-visible:ring-primary" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" className="h-12 rounded-none bg-gray-50 border-gray-200 focus-visible:ring-primary" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input type="tel" className="h-12 rounded-none bg-gray-50 border-gray-200 focus-visible:ring-primary" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input className="h-12 rounded-none bg-gray-50 border-gray-200 focus-visible:ring-primary" {...field} />
                        </FormControl>
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
                          className="min-h-[150px] rounded-none bg-gray-50 border-gray-200 focus-visible:ring-primary resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full md:w-auto px-10 h-14 text-lg bg-secondary text-white hover:bg-primary hover:text-secondary rounded-none uppercase tracking-wider font-bold transition-colors"
                  disabled={submitContact.isPending}
                >
                  {submitContact.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>
          
        </div>
      </div>
    </div>
  );
}
