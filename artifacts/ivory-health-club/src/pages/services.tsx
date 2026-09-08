import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import gymImg from "@assets/generated_images/gym.jpg";
import spaImg from "@assets/generated_images/spa.jpg";
import entertainmentImg from "@assets/generated_images/entertainment.jpg";
import restImg from "@assets/generated_images/restaurant.jpg";
import gymHeroImg from "@assets/generated_images/gym.jpg";
import { AnimatedPageHero } from "@/components/layout/animated-page-hero";

export default function Services() {
  const services = [
    {
      id: "gym",
      title: "Premium Gym",
      subtitle: "State-of-the-Art Fitness",
      desc: "Our fitness floor is equipped with the latest technology from Technogym and Eleiko. Featuring dedicated strength zones, cardio theaters with immersive displays, and private training pods. The environment is climate-controlled and features specialized shock-absorbing flooring.",
      features: ["Personal Training", "InBody Analysis", "Luxury Locker Rooms", "Towel Service"],
      img: gymImg,
      reverse: false
    },
    {
      id: "spa",
      title: "Luxury Spa",
      subtitle: "Ultimate Relaxation",
      desc: "Retreat to our serene spa environment where expert therapists deliver personalized treatments. From deep tissue massage to advanced facial therapies, every experience is designed to restore balance to mind and body.",
      features: ["Massage Therapy", "Sauna & Steam", "Aesthetics & Facials", "Relaxation Lounge"],
      img: spaImg,
      reverse: true
    },
    {
      id: "restaurant",
      title: "Restaurant & Juice Bar",
      subtitle: "Nutritional Excellence",
      desc: "Nutrition is the foundation of wellness. Our executive chef crafts balanced, gourmet meals tailored to support your fitness goals. The juice bar offers customized protein shakes, cold-pressed juices, and premium specialty coffees.",
      features: ["Custom Meal Plans", "Post-Workout Nutrition", "Organic Ingredients", "Private Dining"],
      img: restImg,
      reverse: false
    },
    {
      id: "entertainment",
      title: "VIP Entertainment",
      subtitle: "Exclusive Leisure",
      desc: "Unwind after a rigorous workout in our VIP entertainment lounge. Designed with rich purple velvet, golden ambient lighting, and bespoke seating, it's the perfect place to network, relax, or simply enjoy a quiet moment of luxury.",
      features: ["Premium Bar", "High-Speed Wi-Fi", "Networking Events", "Concierge Service"],
      img: entertainmentImg,
      reverse: true
    }
  ];

  return (
    <div className="pt-24 pb-0 bg-white">
      <AnimatedPageHero
        eyebrow="Our Facilities"
        title={<>Unrivaled <span className="text-primary italic font-light">Services</span></>}
        description="Discover a holistic approach to wellness where every detail has been crafted to exceed your expectations."
        image={gymHeroImg}
        imageAlt="Ivory Health Club premium gym"
        className="mb-24"
      />

      {/* Services List */}
      <section className="flex flex-col">
        {services.map((svc, index) => (
          <div key={svc.id} id={svc.id} className={`flex flex-col ${svc.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} min-h-[70vh]`}>
            {/* Image Half */}
            <div className="w-full lg:w-1/2 relative h-[50vh] lg:h-auto overflow-hidden">
              <motion.img 
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.5 }}
                viewport={{ once: true }}
                src={svc.img} 
                alt={svc.title} 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            
            {/* Content Half */}
            <div className={`w-full lg:w-1/2 bg-${svc.reverse ? 'secondary text-white' : 'white text-secondary'} flex items-center p-12 lg:p-24`}>
              <motion.div 
                initial={{ opacity: 0, x: svc.reverse ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="max-w-xl"
              >
                <h4 className="text-primary font-bold tracking-widest uppercase mb-2 text-sm">
                  {svc.subtitle}
                </h4>
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                  {svc.title}
                </h2>
                <p className={`text-lg mb-10 leading-relaxed ${svc.reverse ? 'text-white/80' : 'text-gray-600'}`}>
                  {svc.desc}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-10">
                  {svc.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${svc.reverse ? 'bg-primary' : 'bg-primary'}`}></div>
                      <span className={`text-sm font-bold ${svc.reverse ? 'text-white/90' : 'text-secondary/80'}`}>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Link href="/book">
                  <Button 
                    className={`uppercase tracking-wider rounded-[10px] font-bold px-8 h-12 ${
                      svc.reverse 
                        ? 'bg-primary text-secondary hover:bg-white' 
                        : 'bg-secondary text-white hover:bg-primary hover:text-secondary'
                    }`}
                  >
                    Book Experience
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        ))}
      </section>
      
      {/* Event Hall CTA */}
      <section className="py-24 luxury-gradient text-white text-center px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-serif font-bold mb-6">Host Your Next Event</h2>
          <p className="text-lg text-white/90 mb-10">
            Ivory Health Club features a premium event hall perfect for corporate wellness retreats, 
            exclusive networking events, or luxury private gatherings.
          </p>
          <Link href="/book">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-secondary bg-transparent rounded-[10px] uppercase tracking-wider font-bold px-10 h-14 text-lg">
              Inquire About Events
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
