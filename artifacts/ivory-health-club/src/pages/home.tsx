import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroBg from "@assets/generated_images/hero-bg-luxury.jpg";
import heroGymImg from "@assets/generated_images/hero-gym-luxury.jpg";
import heroSpaImg from "@assets/generated_images/hero-spa-luxury.jpg";
import heroRestaurantImg from "@assets/generated_images/hero-restaurant-luxury.jpg";
import heroLoungeImg from "@assets/generated_images/hero-lounge-luxury.jpg";
import gymImg from "@assets/generated_images/gym.jpg";
import spaImg from "@assets/generated_images/spa.jpg";
import restImg from "@assets/generated_images/restaurant.jpg";
import entertainmentImg from "@assets/generated_images/entertainment.jpg";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useListMembershipPlans } from "@workspace/api-client-react";
import { useEffect, useState } from "react";

const heroSlides = [
  {
    eyebrow: "Where wellness",
    title: "Becomes a lifestyle",
    description:
      "Nigeria's most exclusive health and wellness destination. Elevate your body, mind, and spirit in a sanctuary of luxury.",
    image: heroBg,
    alt: "Athlete running in the Ivory Health Club gym at golden hour",
    kicker: "Health · Fitness · Wellness · Lifestyle",
  },
  {
    eyebrow: "Move with",
    title: "quiet confidence",
    description:
      "Train with intention in a considered space where every detail is designed around your strongest self.",
    image: heroGymImg,
    alt: "Premium strength and conditioning floor inside Ivory Health Club",
    kicker: "Performance, redefined",
  },
  {
    eyebrow: "Restore your",
    title: "natural rhythm",
    description:
      "A slower kind of luxury. Let expert hands, warm water, and uninterrupted time bring you back to yourself.",
    image: heroSpaImg,
    alt: "Calm treatment room with warm ambient lighting at the Ivory spa",
    kicker: "The art of restoration",
  },
  {
    eyebrow: "Nourish the",
    title: "life you lead",
    description:
      "Thoughtful plates, fresh-pressed goodness, and the kind of hospitality that makes staying in feel like going out.",
    image: heroRestaurantImg,
    alt: "Elegant restaurant and juice bar dining area at Ivory Health Club",
    kicker: "Wellness, served beautifully",
  },
  {
    eyebrow: "Make room for",
    title: "the good life",
    description:
      "Beyond the workout, find a private world for connection, celebration, and the moments worth lingering over.",
    image: heroLoungeImg,
    alt: "Elegant social lounge inside Ivory Health Club",
    kicker: "More than a membership",
  },
];

export default function Home() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const prefersReducedMotion = useReducedMotion();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, [prefersReducedMotion]);

  const goToSlide = (index: number) => {
    setActiveSlide((index + heroSlides.length) % heroSlides.length);
  };

  const { data: plans } = useListMembershipPlans();
  const featuredPlans = plans?.filter(p => ["gold_single", "diamond", "gold_plus"].includes(p.tier)).slice(0, 3);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative isolate min-h-[100dvh] overflow-hidden bg-[#080d13] text-white">
        <motion.div style={{ y: y1 }} className="absolute inset-0 z-0 hidden md:block">
          <AnimatePresence initial={false}>
            <motion.img
              key={heroSlides[activeSlide].image}
              src={heroSlides[activeSlide].image}
              alt={heroSlides[activeSlide].alt}
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.09 }}
              animate={{ opacity: 1, scale: prefersReducedMotion ? 1 : 1.02 }}
              exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.06 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 1.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 h-full w-full object-cover object-center"
              data-testid={`img-hero-slide-${activeSlide}`}
            />
          </AnimatePresence>
        </motion.div>
        <div className="absolute inset-0 z-0 md:hidden">
          <AnimatePresence initial={false}>
            <motion.img
              key={`mobile-${heroSlides[activeSlide].image}`}
              src={heroSlides[activeSlide].image}
              alt={heroSlides[activeSlide].alt}
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.06 }}
              animate={{ opacity: 1, scale: prefersReducedMotion ? 1 : 1.01 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.9 }}
              className="absolute inset-0 h-full w-full object-cover object-center"
              data-testid={`img-mobile-hero-slide-${activeSlide}`}
            />
          </AnimatePresence>
        </div>
        <div className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(6,11,16,0.98)_0%,rgba(6,11,16,0.91)_32%,rgba(6,11,16,0.42)_64%,rgba(6,11,16,0.5)_100%)]" />
        <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(6,11,16,0.65)_0%,transparent_24%,transparent_69%,rgba(6,11,16,0.92)_100%)]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[2] hidden w-[52%] border-l border-white/10 bg-gradient-to-l from-transparent via-transparent to-[#080d13]/10 md:block" />

        <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1440px] flex-col justify-center px-6 pb-28 pt-24 sm:px-10 lg:px-16 xl:px-20">
          <div className="max-w-[620px]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="mb-7 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.38em] text-primary sm:text-xs"
            >
              <span className="h-px w-9 bg-primary" />
              <span>Ivory Health Club</span>
            </motion.div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -18 }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 0.6, ease: "easeOut" }}
              >
                <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-white/65 sm:text-base">
                  {heroSlides[activeSlide].eyebrow}
                </p>
                <h1 className="max-w-[680px] text-[clamp(3.6rem,8vw,7.7rem)] font-serif font-medium leading-[0.88] tracking-[-0.045em] text-white">
                  <span className="block">{heroSlides[activeSlide].title.split(" ")[0]}</span>
                  <span className="block italic text-primary">
                    {heroSlides[activeSlide].title.split(" ").slice(1).join(" ")}
                  </span>
                </h1>
                <p className="mt-7 max-w-[470px] text-sm leading-7 text-white/72 sm:text-base sm:leading-8">
                  {heroSlides[activeSlide].description}
                </p>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`cta-${activeSlide}`}
                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -12 }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 0.55, delay: prefersReducedMotion ? 0 : 0.12 }}
                className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
              >
                <Link
                  href="/membership"
                  className="group inline-flex h-14 items-center justify-center gap-5 rounded-[3px] bg-primary px-6 text-xs font-bold uppercase tracking-[0.17em] text-secondary shadow-[0_10px_35px_rgba(248,195,1,0.18)] transition-colors hover:bg-[#ffe082] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#080d13] sm:min-w-[200px]"
                  data-testid="link-become-member"
                >
                  Become a Member
                  <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/services"
                  className="group inline-flex h-14 items-center justify-center gap-5 rounded-[3px] border border-white/45 bg-white/[0.02] px-6 text-xs font-bold uppercase tracking-[0.17em] text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#080d13] sm:min-w-[200px]"
                  data-testid="link-discover-ivory"
                >
                  Discover Ivory
                  <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-9 left-6 right-6 flex items-end justify-between sm:left-10 sm:right-10 lg:left-16 lg:right-16 xl:left-20 xl:right-20">
            <div className="hidden items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/45 sm:flex">
              <span className="h-px w-12 bg-white/30" />
              <span>{heroSlides[activeSlide].kicker}</span>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center gap-2" role="tablist" aria-label="Hero slides">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    role="tab"
                    aria-selected={activeSlide === index}
                    aria-label={`Show slide ${index + 1}: ${slide.title}`}
                    onClick={() => goToSlide(index)}
                    className="group flex h-8 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#080d13]"
                    data-testid={`button-hero-indicator-${index}`}
                  >
                    <span className={`block h-px transition-all duration-500 ${activeSlide === index ? "w-10 bg-primary" : "w-4 bg-white/40 group-hover:bg-white/80"}`} />
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Previous hero slide"
                  onClick={() => goToSlide(activeSlide - 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white/75 transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#080d13]"
                  data-testid="button-hero-previous"
                >
                  <ChevronLeft size={17} />
                </button>
                <button
                  type="button"
                  aria-label="Next hero slide"
                  onClick={() => goToSlide(activeSlide + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white/75 transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#080d13]"
                  data-testid="button-hero-next"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </div>
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
