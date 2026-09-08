import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Droplets, Zap, Heart, Leaf } from "lucide-react";
import spaImg from "@assets/generated_images/spa.jpg";
import heroBg from "@assets/generated_images/hero-bg.jpg";
import { AnimatedPageHero } from "@/components/layout/animated-page-hero";
import programsImg from "@assets/generated_images/programs.jpg";

const drinks = [
  {
    name: "Ivory Green Detox",
    desc: "Cold-pressed spinach, cucumber, green apple, ginger, lemon, and spirulina. A chlorophyll-rich cleanse in a glass.",
    tag: "Detox",
    color: "from-green-900/80",
  },
  {
    name: "Mango Passion Bliss",
    desc: "Fresh mango, passion fruit, orange juice, turmeric, and a hint of black pepper for maximum nutrient absorption.",
    tag: "Immunity",
    color: "from-yellow-900/80",
  },
  {
    name: "Berry Power Shake",
    desc: "Mixed berries, banana, almond milk, whey protein, chia seeds, and raw honey. The post-workout favourite.",
    tag: "High Protein",
    color: "from-purple-900/80",
  },
  {
    name: "Pineapple Coconut Refresh",
    desc: "Freshly pressed pineapple, coconut water, mint, and a squeeze of lime. Tropical hydration at its finest.",
    tag: "Hydration",
    color: "from-teal-900/80",
  },
  {
    name: "Chocolate Peanut Butter Shake",
    desc: "Cacao powder, natural peanut butter, banana, oat milk, and vanilla protein. Indulgent. Functional. Guilt-free.",
    tag: "Meal Replacement",
    color: "from-amber-900/80",
  },
  {
    name: "Beet & Carrot Glow",
    desc: "Cold-pressed beetroot, carrot, orange, ginger, and flaxseed oil. Rich in antioxidants and heart-healthy nitrates.",
    tag: "Recovery",
    color: "from-red-900/80",
  },
];

const benefits = [
  { icon: Droplets, label: "Cold-Pressed Daily" },
  { icon: Zap, label: "Pre & Post Workout Blends" },
  { icon: Heart, label: "No Artificial Sweeteners" },
  { icon: Leaf, label: "100% Natural Ingredients" },
];

export default function JuiceBar() {
  return (
    <div className="overflow-hidden">
      <AnimatedPageHero
        eyebrow="Food & Beverages · Juice Bar"
        title="The Ivory Juice Bar"
        description="Pure. Cold-pressed. Crafted to fuel your performance — one glass at a time."
        image={heroBg}
        imageAlt="The Ivory Juice Bar"
      >
        <a href="tel:+2348108897628">
          <Button size="lg" className="px-10 h-14 text-lg bg-primary text-secondary hover:bg-white hover:text-secondary rounded-[10px] uppercase tracking-wider font-bold">
            Order Now <ArrowRight size={18} className="ml-2" />
          </Button>
        </a>
      </AnimatedPageHero>

      {/* Story */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h4 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm">Our Philosophy</h4>
              <h2 className="text-4xl md:text-5xl font-serif text-secondary font-bold leading-tight mb-6">
                Nutrition in<br />Its Purest Form
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                The Ivory Juice Bar was built on a single conviction: that what you drink matters as much as what you eat.
                Every blend is freshly prepared to order using whole fruits, vegetables, and superfoods — never from
                concentrate, never artificially sweetened, never frozen.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our cold-press process preserves up to 70% more nutrients than centrifugal juicing, delivering maximum
                vitamins, enzymes, and antioxidants in every sip. Our in-house nutritionist designed each recipe to serve
                a specific wellness goal — from post-workout muscle recovery to morning detox and immune support.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Whether you stop by before a gym session for an energy-boosting pre-workout shake, or after a spa
                treatment for a calming green detox, the Juice Bar is your ritual within a ritual.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <b.icon size={18} className="text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-secondary">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <img src={programsImg} alt="Fresh juices" className="w-full h-[280px] object-cover shadow-xl mt-10" />
              <img src={spaImg} alt="Juice Bar" className="w-full h-[280px] object-cover shadow-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h4 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm">Our Blends</h4>
            <h2 className="text-4xl md:text-5xl font-serif text-secondary font-bold">Signature Drinks</h2>
            <p className="text-gray-500 mt-4 text-lg">Every recipe developed by our nutritionist for a specific wellness goal.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {drinks.map((drink, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-white p-8 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
              >
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${drink.color} via-primary to-transparent`} />
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 mb-4">
                  {drink.tag}
                </span>
                <h3 className="text-xl font-serif font-bold text-secondary mb-3 group-hover:text-primary transition-colors">
                  {drink.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">{drink.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-0">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {[spaImg, programsImg, spaImg, programsImg].map((src, i) => (
            <div key={i} className="h-56 overflow-hidden">
              <img
                src={src}
                alt="Juice bar"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                style={{ objectPosition: `${20 + i * 20}% center` }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-secondary text-white text-center">
        <div className="container mx-auto px-6 max-w-2xl">
          <h4 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm">Sip & Thrive</h4>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Ready to Order Your Blend?
          </h2>
          <p className="text-white/70 text-lg mb-10">
            Walk in, or call ahead to have your order ready when you arrive. Members enjoy complimentary top-ups on select juice cleanses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+2348108897628">
              <Button size="lg" className="px-10 h-14 text-lg bg-primary text-secondary hover:bg-white hover:text-secondary rounded-[10px] uppercase tracking-wider font-bold">
                Call to Order
              </Button>
            </a>
            <Link href="/book">
              <Button size="lg" variant="outline" className="px-10 h-14 text-lg border-white text-white hover:bg-white hover:text-secondary rounded-[10px] uppercase tracking-wider font-bold bg-transparent">
                Book a Session
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
