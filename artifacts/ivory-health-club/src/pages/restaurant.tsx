import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Utensils, Clock, Star, Leaf } from "lucide-react";
import restImg from "@assets/generated_images/restaurant.jpg";
import heroBg from "@assets/generated_images/hero-bg.jpg";
import { AnimatedPageHero } from "@/components/layout/animated-page-hero";

const dishes = [
  {
    name: "Pan-Seared Tilapia",
    desc: "Locally sourced tilapia, jollof-spiced quinoa, grilled asparagus, and lemon-herb beurre blanc.",
    tag: "Chef's Favourite",
  },
  {
    name: "Grilled Chicken Power Bowl",
    desc: "Marinated free-range chicken, brown rice, avocado, edamame, cucumber ribbons, and sesame-miso dressing.",
    tag: "High Protein",
  },
  {
    name: "Margaret's Signature Suya Salad",
    desc: "Tender beef suya strips over a bed of baby kale, roasted peppers, cherry tomatoes, and peanut vinaigrette.",
    tag: "Signature",
  },
  {
    name: "Truffle Mushroom Risotto",
    desc: "Arborio rice, seasonal wild mushrooms, parmesan foam, truffle oil, and toasted pine nuts.",
    tag: "Vegetarian",
  },
  {
    name: "Athlete's Breakfast Platter",
    desc: "Egg-white omelette, smoked salmon, sautéed spinach, sourdough, and a cold-pressed green juice.",
    tag: "All Day",
  },
  {
    name: "Wellness Tasting Menu",
    desc: "A five-course seasonal menu curated by our head chef and nutritionist — personalised macros on request.",
    tag: "Pre-Order",
  },
];

const features = [
  { icon: Leaf, label: "Farm-to-Table Ingredients" },
  { icon: Utensils, label: "Nutritionist-Designed Menus" },
  { icon: Clock, label: "Open 7 am – 10 pm Daily" },
  { icon: Star, label: "Private Dining Available" },
];

export default function Restaurant() {
  return (
    <div className="overflow-hidden">
      <AnimatedPageHero
        eyebrow="Food & Beverages · Restaurant"
        title="Margaret's Bistro"
        description="Where nutrition meets artistry. A culinary experience designed around your wellness."
        image={heroBg}
        imageAlt="Margaret's Bistro"
      >
        <a href="tel:+2348108897628">
          <Button size="lg" className="px-10 h-14 text-lg bg-primary text-secondary hover:bg-white hover:text-secondary rounded-[10px] uppercase tracking-wider font-bold">
            Reserve a Table <ArrowRight size={18} className="ml-2" />
          </Button>
        </a>
      </AnimatedPageHero>

      {/* Story */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 order-2 lg:order-1">
              <h4 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm">Our Story</h4>
              <h2 className="text-4xl md:text-5xl font-serif text-secondary font-bold leading-tight mb-6">
                Born from a Belief<br />That Food is Medicine
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Margaret's Bistro was named in honour of Mrs. Margaret Adeyemi — a pioneering Lagos nutritionist whose
                philosophy shaped Ivory's founding wellness vision. Her belief was simple: the right food, prepared with
                care and intention, is one of the most powerful tools we have for health.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Today, our executive chef and in-house nutritionist collaborate on every dish that leaves our kitchen.
                Menus rotate seasonally to honour local produce at its peak, and every recipe is macro-balanced —
                without ever sacrificing flavour for function.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Whether you are fuelling a 6 AM workout, entertaining a client over lunch, or unwinding with a quiet
                dinner after a long day, Margaret's Bistro meets you exactly where you are.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <f.icon size={18} className="text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-secondary">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 order-1 lg:order-2">
              <div className="relative">
                <img src={restImg} alt="Margaret's Bistro" className="w-full h-[500px] object-cover shadow-2xl" />
                <div className="absolute -bottom-6 -left-6 bg-primary text-secondary p-6 shadow-xl hidden md:block">
                  <p className="text-3xl font-serif font-bold">10+</p>
                  <p className="text-sm font-bold uppercase tracking-wider">Years of Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Highlights */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h4 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm">Seasonal Highlights</h4>
            <h2 className="text-4xl md:text-5xl font-serif text-secondary font-bold">From Our Kitchen</h2>
            <p className="text-gray-500 mt-4 text-lg">Every dish crafted to nourish and delight in equal measure.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {dishes.map((dish, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow border-l-4 border-primary"
              >
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 mb-4">
                  {dish.tag}
                </span>
                <h3 className="text-xl font-serif font-bold text-secondary mb-3">{dish.name}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{dish.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery strip */}
      <section className="py-0">
        <div className="grid grid-cols-3">
          {[restImg, restImg, restImg].map((src, i) => (
            <div key={i} className="h-64 overflow-hidden">
              <img src={src} alt="Margaret's Bistro" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" style={{ objectPosition: `${30 + i * 30}% center` }} />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 royal-purple-gradient text-white text-center">
        <div className="container mx-auto px-6 max-w-2xl">
          <h4 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm">Reserve Your Table</h4>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Dine at Margaret's Bistro
          </h2>
          <p className="text-white/70 text-lg mb-10">
            Members enjoy priority seating. Non-members are welcome — call ahead to reserve your spot.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+2348108897628">
              <Button size="lg" className="px-10 h-14 text-lg bg-primary text-secondary hover:bg-white hover:text-secondary rounded-[10px] uppercase tracking-wider font-bold">
                Call to Order
              </Button>
            </a>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="px-10 h-14 text-lg border-white text-white hover:bg-white hover:text-secondary rounded-[10px] uppercase tracking-wider font-bold bg-transparent">
                Make an Enquiry
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
