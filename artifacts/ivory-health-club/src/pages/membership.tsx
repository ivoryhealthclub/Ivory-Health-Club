import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check, Star, Users, Trophy, Heart } from "lucide-react";
import { useListMembershipPlans } from "@workspace/api-client-react";

export default function Membership() {
  const { data: plans, isLoading } = useListMembershipPlans();

  const getTierIcon = (tier: string) => {
    if (tier.includes('gold')) return <Star className="text-primary" />;
    if (tier.includes('diamond')) return <Trophy className="text-primary" />;
    if (tier.includes('family')) return <Users className="text-primary" />;
    return <Heart className="text-primary" />;
  };

  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <section className="bg-secondary text-white py-20 mb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540497077202-7c8a3999166f')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif font-bold mb-6"
          >
            Membership <span className="text-primary italic">Plans</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto"
          >
            Join a community dedicated to excellence. Choose the tier that best suits your lifestyle and begin your wellness journey today.
          </motion.p>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="container mx-auto px-6 max-w-7xl">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-[500px] bg-gray-100 animate-pulse rounded-sm"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans?.map((plan, index) => {
              const isDiamond = plan.tier === 'diamond';
              const isGoldPlus = plan.tier === 'gold_plus';
              
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  key={plan.id} 
                  className={`relative flex flex-col p-8 bg-white border ${
                    isDiamond || isGoldPlus ? 'border-primary shadow-xl shadow-primary/10' : 'border-gray-200'
                  } group hover:-translate-y-2 transition-transform duration-300`}
                >
                  {(isDiamond || isGoldPlus) && (
                    <div className="absolute top-0 right-0 bg-primary text-secondary font-bold text-xs uppercase tracking-wider py-1 px-4 transform translate-x-2 -translate-y-2 shadow-md">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-sm text-primary">
                      {getTierIcon(plan.tier)}
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-secondary">{plan.name}</h3>
                      {plan.maxMembers && plan.maxMembers > 1 && (
                        <p className="text-sm text-gray-500">Up to {plan.maxMembers} members</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-baseline text-secondary">
                      <span className="text-2xl font-bold">₦</span>
                      <span className="text-4xl font-bold">{plan.price.toLocaleString()}</span>
                      <span className="text-gray-500 ml-2">/ {plan.pricePeriod}</span>
                    </div>
                    {plan.discounts && (
                      <p className="text-sm text-green-600 font-medium mt-2">{plan.discounts}</p>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-6 flex-1">{plan.description}</p>
                  
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.perks.map((perk, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="text-primary shrink-0 mt-1" size={16} />
                        <span className="text-sm text-gray-700">{perk}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href={`/enroll?plan=${plan.id}`}>
                    <Button 
                      className={`w-full uppercase tracking-wider rounded-[10px] font-bold h-12 ${
                        isDiamond || isGoldPlus 
                          ? 'bg-primary text-secondary hover:bg-secondary hover:text-white' 
                          : 'bg-secondary text-white hover:bg-primary hover:text-secondary'
                      }`}
                    >
                      Choose Plan
                    </Button>
                  </Link>
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
