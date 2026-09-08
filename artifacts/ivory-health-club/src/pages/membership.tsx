import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check, Star, Users, Trophy, Heart, ArrowRight, Sparkles } from "lucide-react";
import { useListMembershipPlans } from "@workspace/api-client-react";
import { AnimatedPageHero } from "@/components/layout/animated-page-hero";

export default function Membership() {
  const { data: plans, isLoading, isError } = useListMembershipPlans();

  const getTierIcon = (tier: string) => {
    if (tier.includes('gold')) return <Star className="text-primary" />;
    if (tier.includes('diamond')) return <Trophy className="text-primary" />;
    if (tier.includes('family')) return <Users className="text-primary" />;
    return <Heart className="text-primary" />;
  };

  return (
    <div className="pt-24 pb-20">
      <AnimatedPageHero
        eyebrow="Join The Elite"
        title={<>Membership <span className="text-primary italic">Plans</span></>}
        description="Choose the Ivory Health Club membership that fits your lifestyle, then begin your enrollment in a few simple steps."
        compact
        className="mb-20"
      />

      {/* Plans Grid */}
      <section className="container mx-auto px-6 max-w-7xl">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <div key={i} className="h-[590px] bg-gray-100 animate-pulse rounded-sm"></div>
            ))}
          </div>
        ) : isError ? (
          <div className="border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="text-xl font-serif font-bold text-secondary">Membership plans are temporarily unavailable</h2>
            <p className="mt-2 text-gray-600">Please refresh the page or contact our concierge team for assistance.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans?.map((plan, index) => {
              const isDiamond = plan.tier === 'diamond';
              const isGoldPlus = plan.tier === 'gold_plus';
              const isSeventyPlus = plan.tier === 'seventy_plus';
              const isFeatured = isDiamond || isGoldPlus;
              
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  key={plan.id} 
                  className={`relative flex flex-col overflow-hidden rounded-sm bg-white border ${
                    isFeatured ? 'border-primary shadow-xl shadow-primary/10' : 'border-gray-200 shadow-sm'
                  } group hover:-translate-y-2 hover:shadow-xl transition-all duration-300`}
                >
                  {isFeatured && (
                    <div className="absolute top-0 right-0 flex items-center gap-1 bg-primary text-secondary font-bold text-[10px] uppercase tracking-[0.18em] py-2 px-4 shadow-md">
                      <Sparkles size={12} /> Signature
                    </div>
                  )}
                  
                  <div className={`h-1 w-full ${isFeatured ? "bg-primary" : "bg-secondary"}`} />
                  <div className="flex items-start gap-3 p-8 pb-5">
                    <div className="w-12 h-12 bg-secondary/5 flex items-center justify-center rounded-sm text-primary shrink-0">
                      {getTierIcon(plan.tier)}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">
                        {isSeventyPlus ? "Active Ageing" : plan.tier.startsWith("silver") ? "Essential" : "Premium"}
                      </p>
                      <h3 className="text-xl font-serif font-bold text-secondary leading-tight">{plan.name}</h3>
                      {plan.maxMembers && plan.maxMembers > 1 && (
                        <p className="text-sm text-gray-500">Up to {plan.maxMembers} members</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mx-8 mb-6 border-y border-gray-100 py-4">
                    <p className="text-sm font-semibold text-secondary">Membership rate available on request</p>
                    {plan.discounts && (
                      <p className="text-xs text-green-700 font-medium mt-2">{plan.discounts}</p>
                    )}
                  </div>
                  
                  <p className="px-8 text-gray-600 text-sm leading-relaxed mb-6">{plan.description}</p>
                  
                  <ul className="px-8 space-y-3 mb-8 flex-1">
                    {plan.perks.map((perk, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="text-primary shrink-0 mt-0.5" size={15} strokeWidth={3} />
                        <span className="text-sm text-gray-700 leading-snug">{perk}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="p-8 pt-0">
                    <Link href={`/enroll?plan=${plan.id}`}>
                    <Button 
                      className={`w-full uppercase tracking-[0.16em] rounded-[10px] font-bold h-12 group/cta ${
                        isFeatured
                          ? 'bg-primary text-secondary hover:bg-secondary hover:text-white' 
                          : 'bg-secondary text-white hover:bg-primary hover:text-secondary'
                      }`}
                    >
                      <span>Enroll Now</span>
                      <ArrowRight size={16} className="ml-2 transition-transform group-hover/cta:translate-x-1" />
                    </Button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Corporate / Custom */}
      <section className="container mx-auto px-6 max-w-5xl mt-32 text-center">
        <div className="p-12 luxury-gradient text-white rounded-sm shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Looking for Corporate Memberships?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            We offer bespoke health and wellness packages for companies looking to invest in their executives and teams.
          </p>
          <Link href="/contact">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-secondary uppercase tracking-wider font-bold rounded-[10px] px-8 h-14 bg-transparent">
              Contact Concierge
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
