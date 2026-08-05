import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import programsImg from "@assets/generated_images/programs.jpg";
import youthImg from "@assets/generated_images/youth.jpg";

export default function Programs() {
  const adultPrograms = [
    { title: "HIIT Intensity", schedule: "Mon, Wed, Fri - 6:00 AM", trainer: "Alex M." },
    { title: "Vinyasa Flow Yoga", schedule: "Tue, Thu - 7:00 AM", trainer: "Sarah K." },
    { title: "Pilates Core", schedule: "Mon, Wed - 6:00 PM", trainer: "Sarah K." },
    { title: "Spin & Burn", schedule: "Daily - 5:30 PM", trainer: "David J." },
    { title: "Strength & Conditioning", schedule: "Tue, Thu, Sat - 8:00 AM", trainer: "Marcus T." },
  ];

  const youthPrograms = [
    { title: "Kids Karate", age: "6-12 Years", schedule: "Sat - 10:00 AM" },
    { title: "Teen Functional Fitness", age: "13-17 Years", schedule: "Wed - 4:30 PM" },
    { title: "Youth Swim Club", age: "8-14 Years", schedule: "Sun - 9:00 AM" },
  ];

  return (
    <div className="pt-24 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 max-w-7xl pb-20">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h4 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-primary font-bold tracking-widest uppercase mb-4"
          >
            Group Fitness
          </motion.h4>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-serif text-secondary font-bold mb-6"
          >
            Move Together
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600"
          >
            Experience the energy of our elite group classes led by master trainers in our specialized luxury studios.
          </motion.p>
        </div>

        {/* Adult Programs */}
        <div className="bg-white shadow-xl rounded-sm overflow-hidden mb-20 flex flex-col lg:flex-row">
          <div className="lg:w-1/2 relative min-h-[400px]">
            <img src={programsImg} alt="Fitness Classes" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-transparent flex items-center p-12">
              <h2 className="text-4xl font-serif font-bold text-white max-w-sm">Elevate Your Routine</h2>
            </div>
          </div>
          <div className="lg:w-1/2 p-12">
            <h3 className="text-2xl font-serif font-bold text-secondary mb-6 border-b border-gray-100 pb-4">Adult Fitness Classes</h3>
            <div className="space-y-4 mb-8">
              {adultPrograms.map((prog, i) => (
                <div key={i} className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 rounded-sm">
                  <div>
                    <h4 className="font-bold text-secondary">{prog.title}</h4>
                    <p className="text-sm text-gray-500">{prog.trainer}</p>
                  </div>
                  <div className="text-right text-sm text-primary font-bold">
                    {prog.schedule}
                  </div>
                </div>
              ))}
            </div>
            <Link href="/book">
              <Button className="w-full bg-secondary text-white hover:bg-primary hover:text-secondary uppercase tracking-wider font-bold rounded-none h-12">
                Book a Class
              </Button>
            </Link>
          </div>
        </div>

        {/* Youth Programs */}
        <div className="bg-white shadow-xl rounded-sm overflow-hidden flex flex-col lg:flex-row-reverse">
          <div className="lg:w-1/2 relative min-h-[400px]">
            <img src={youthImg} alt="Youth Programs" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-l from-primary/80 to-transparent flex items-center justify-end p-12 text-right">
              <h2 className="text-4xl font-serif font-bold text-secondary max-w-sm drop-shadow-md">Active Futures</h2>
            </div>
          </div>
          <div className="lg:w-1/2 p-12">
            <h3 className="text-2xl font-serif font-bold text-secondary mb-6 border-b border-gray-100 pb-4">Kids & Youth Programs</h3>
            <p className="text-gray-600 mb-8">
              Instill the value of health early. Our youth programs are designed to be fun, safe, and engaging, run by certified youth fitness specialists.
            </p>
            <div className="space-y-4 mb-8">
              {youthPrograms.map((prog, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-sm border border-gray-100">
                  <div>
                    <h4 className="font-bold text-secondary">{prog.title}</h4>
                    <p className="text-sm text-gray-500">Ages: {prog.age}</p>
                  </div>
                  <div className="text-right text-sm text-secondary font-bold">
                    {prog.schedule}
                  </div>
                </div>
              ))}
            </div>
            <Link href="/book">
              <Button variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary hover:text-white uppercase tracking-wider font-bold rounded-none h-12">
                Enroll Child
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
