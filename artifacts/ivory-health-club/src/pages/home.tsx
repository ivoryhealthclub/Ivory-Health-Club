import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroBg from "@assets/generated_images/hero-bg.jpg";
import gymImg from "@assets/generated_images/gym.jpg";
import spaImg from "@assets/generated_images/spa.jpg";
import restImg from "@assets/generated_images/restaurant.jpg";
import { ArrowRight, Star, ChevronRight, Check } from "lucide-react";
import { useListMembershipPlans } from "@workspace/api-client-react";

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  
  const { data: plans } = useListMembershipPlans();
  const featuredPlans = plans?.filter(p => ["gold_single", "diamond", "gold_plus"].includes(p.tier)).slice(0, 3);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[100dvh] flex items-center justify-center overflow-hidden bg-secondary">
        <motion.div 
          style={{ y: y1 }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#140A3A]/80 via-[#29166F]/60 to-[#140A3A]/90 z-10 mix-blend-multiply" />
          <img 
            src={heroBg} 
            alt="Ivory Health Club" 
            className="w-full h-full object-cover opacity-80 object-center"
          />
        </motion.div>
        
        <div className="relative z-10 container mx-auto px-6 text-center max-w-5xl mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center justify-center gap-2 mb-6 text-primary"
          >
            <Star size={16} fill="currentColor" />
            <Star size={16} fill="currentColor" />
            <Star size={16} fill="currentColor" />
            <Star size={16} fill="currentColor" />
            <Star size={16} fill="currentColor" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-tight tracking-tight mb-6 drop-shadow-lg"
          >
            Where Wellness <br />
            <span className="text-primary italic font-light">Becomes a Lifestyle</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg md:text-2xl text-white/80 max-w-2xl mx-auto mb-10 font-light"
          >
            Nigeria's most exclusive health and wellness destination. 
            Elevate your body, mind, and spirit in a sanctuary of luxury.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/membership">
              <Button size="lg" className="w-full sm:w-auto px-8 h-14 text-lg bg-primary text-secondary hover:bg-primary/90 rounded-[10px] uppercase tracking-wider font-bold">
                Become a Member
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 h-14 text-lg border-white text-white hover:bg-white hover:text-secondary rounded-[10px] uppercase tracking-wider font-bold bg-transparent">
                Discover Ivory
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h4 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm">The Ivory Experience</h4>
              <h2 className="text-4xl md:text-5xl font-serif text-secondary font-bold leading-tight mb-6">
                Not Just a Gym.<br />A Sanctuary.
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Step into a world where world-class fitness facilities meet 5-star resort hospitality. 
                At Ivory Health Club, we've redefined the concept of wellness to offer an unparalleled 
                experience for executives, families, and individuals who demand nothing but the best.
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 text-secondary font-bold hover:text-primary transition-colors border-b-2 border-primary pb-1">
                Explore Our Philosophy <ArrowRight size={20} />
              </Link>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <img src={gymImg} alt="Gym" className="w-full h-[300px] object-cover mt-12 rounded-sm shadow-xl" />
              <img src={spaImg} alt="Spa" className="w-full h-[300px] object-cover rounded-sm shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h4 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm">World-Class Facilities</h4>
            <h2 className="text-4xl md:text-5xl font-serif text-secondary font-bold mb-6">Everything You Need</h2>
            <p className="text-gray-600 text-lg">
              From state-of-the-art fitness floors to rejuvenating spa treatments, 
              discover a comprehensive approach to health and wellness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Premium Gym", desc: "Top-tier equipment in an exclusive environment.", img: gymImg, link: "/services#gym" },
              { title: "Luxury Spa", desc: "Rejuvenating treatments and holistic therapies.", img: spaImg, link: "/services#spa" },
              { title: "Restaurant & Juice Bar", desc: "Nutritious gourmet meals and fresh pressed juices.", img: restImg, link: "/services#restaurant" }
            ].map((service, i) => (
              <Link key={i} href={service.link} className="group block relative overflow-hidden h-[450px] shadow-lg">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500 z-10" />
                <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  <h3 className="text-2xl font-serif text-white font-bold mb-2">{service.title}</h3>
                  <p className="text-white/80 mb-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    {service.desc}
                  </p>
                  <span className="inline-flex items-center text-primary font-bold text-sm uppercase tracking-wider">
                    Discover <ChevronRight size={16} className="ml-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/services">
              <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white rounded-[10px] uppercase tracking-wider font-bold px-8 h-12">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Memberships */}
      <section className="py-24 royal-purple-gradient text-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h4 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm">Join The Elite</h4>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Membership Tiers</h2>
              <p className="text-white/80 text-lg">
                Choose the perfect plan tailored to your lifestyle. Exceptional value, exclusive perks.
              </p>
            </div>
            <Link href="/membership">
              <Button className="bg-primary text-secondary hover:bg-white hover:text-secondary rounded-[10px] uppercase tracking-wider font-bold">
                See All Plans
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPlans?.map((plan) => (
              <div key={plan.id} className="bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-colors">
                <h3 className="text-2xl font-serif font-bold text-primary mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold mb-6">
                  ₦{plan.price.toLocaleString()} <span className="text-sm font-normal text-white/60">/ {plan.pricePeriod}</span>
                </div>
                <p className="text-white/70 mb-8 min-h-[60px]">{plan.description}</p>
                <ul className="space-y-4 mb-8">
                  {plan.perks.slice(0, 4).map((perk, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="text-primary shrink-0 mt-0.5" size={18} />
                      <span className="text-sm text-white/90">{perk}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/enroll?plan=${plan.id}`}>
                  <Button className="w-full bg-transparent border border-primary text-primary hover:bg-primary hover:text-secondary rounded-[10px] uppercase tracking-wider font-bold">
                    Select Plan
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
