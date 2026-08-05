import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Heart, Shield, Zap } from "lucide-react";
import gymImg from "@assets/generated_images/gym.jpg";
import spaImg from "@assets/generated_images/spa.jpg";
import heroBg from "@assets/generated_images/hero-bg.jpg";

const values = [
  {
    icon: Award,
    title: "Excellence",
    desc: "We uphold the highest standards in every detail — from world-class equipment to the warmth of our staff.",
  },
  {
    icon: Heart,
    title: "Holistic Wellness",
    desc: "True health is physical, mental, and spiritual. Our programmes are built to nurture every dimension.",
  },
  {
    icon: Shield,
    title: "Exclusivity",
    desc: "A curated environment designed for those who value privacy, quality, and a community of like-minded individuals.",
  },
  {
    icon: Zap,
    title: "Innovation",
    desc: "We invest continuously in the latest fitness science, technology, and hospitality to stay ahead.",
  },
];

const milestones = [
  { year: "2015", event: "Ivory Health Club founded in Lagos with a vision to redefine luxury wellness in Nigeria." },
  { year: "2017", event: "Expanded to a 12,000 m² flagship facility featuring a full spa, restaurant, and Olympic-grade pool." },
  { year: "2019", event: "Launched the Ivory Academy, bringing certified personal training and nutrition coaching in-house." },
  { year: "2022", event: "Opened the VIP Entertainment Wing and members-only business lounge." },
  { year: "2024", event: "Reached 5,000 active members and earned the West Africa Luxury Wellness Award." },
];

export default function About() {
  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-secondary">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#140A3A]/85 via-[#29166F]/65 to-[#140A3A]/90 z-10 mix-blend-multiply" />
          <img src={heroBg} alt="About Ivory" className="w-full h-full object-cover opacity-70" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.h4
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-primary font-bold tracking-widest uppercase mb-4 text-sm"
          >
            Our Philosophy
          </motion.h4>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-5xl md:text-6xl font-serif font-bold text-white leading-tight mb-6"
          >
            More Than Fitness.<br />
            <span className="text-primary italic font-light">A Way of Life.</span>
          </motion.h1>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h4 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm">Who We Are</h4>
              <h2 className="text-4xl md:text-5xl font-serif text-secondary font-bold leading-tight mb-6">
                Nigeria's Premier<br />Wellness Destination
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Ivory Health Club was founded on a single conviction: that the people who push hardest in life 
                deserve a space that pushes back with equal intensity — and equal comfort. We are not a gym. 
                We are a sanctuary built for executives, families, and high-performers who refuse to compromise.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                From our Olympic-standard fitness floors to our five-star spa, nutritionist-designed restaurant, 
                and members-only lounge, every corner of Ivory is an invitation to be your absolute best.
              </p>
              <Link href="/membership">
                <Button className="bg-primary text-secondary hover:bg-secondary hover:text-white rounded-[10px] uppercase tracking-wider font-bold px-8 h-12">
                  Join Ivory <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <img src={gymImg} alt="Gym" className="w-full h-[300px] object-cover mt-12 rounded-sm shadow-xl" />
              <img src={spaImg} alt="Spa" className="w-full h-[300px] object-cover rounded-sm shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h4 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm">What Drives Us</h4>
            <h2 className="text-4xl md:text-5xl font-serif text-secondary font-bold">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                  <v.icon size={26} className="text-primary" />
                </div>
                <h3 className="text-xl font-serif font-bold text-secondary mb-3">{v.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 royal-purple-gradient text-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h4 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm">Our Journey</h4>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">A Decade of Excellence</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-primary/40 -translate-x-px" />
            <div className="space-y-12">
              {milestones.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`flex gap-8 md:gap-0 items-start ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div className={`hidden md:block md:w-1/2 ${i % 2 === 0 ? "text-right pr-12" : "text-left pl-12"}`}>
                    <span className="text-4xl font-serif font-bold text-primary">{m.year}</span>
                  </div>
                  <div className="relative flex-shrink-0 w-16 flex justify-center">
                    <div className="w-4 h-4 rounded-full bg-primary border-4 border-secondary mt-2" />
                  </div>
                  <div className={`md:w-1/2 ${i % 2 === 0 ? "md:pl-12" : "md:pr-12 md:text-right"}`}>
                    <span className="text-2xl font-serif font-bold text-primary md:hidden">{m.year}</span>
                    <p className="text-white/80 leading-relaxed">{m.event}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-6 max-w-2xl">
          <h4 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm">Ready to Begin?</h4>
          <h2 className="text-4xl md:text-5xl font-serif text-secondary font-bold mb-6">
            Experience Ivory for Yourself
          </h2>
          <p className="text-gray-600 text-lg mb-10">
            Join thousands of members who have made Ivory Health Club the cornerstone of their lifestyle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/membership">
              <Button size="lg" className="px-10 h-14 text-lg bg-secondary text-white hover:bg-primary hover:text-secondary rounded-[10px] uppercase tracking-wider font-bold">
                View Memberships
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="px-10 h-14 text-lg border-secondary text-secondary hover:bg-secondary hover:text-white rounded-[10px] uppercase tracking-wider font-bold bg-transparent">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
