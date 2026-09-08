import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import programsImg from "@assets/generated_images/programs.jpg";
import youthImg from "@assets/generated_images/youth.jpg";
import sevenPlusImg from "@assets/generated_images/70-plus-club.jpg";
import weightLossImg from "@assets/generated_images/weight-loss-challenge.jpg";
import bond4Img from "@assets/generated_images/bond4fitness.jpg";
import fit2LiveImg from "@assets/generated_images/fit2live-bootcamp.jpg";
import personalTrainingImg from "@assets/generated_images/personal-training.jpg";
import boxingImg from "@assets/generated_images/boxing-class.jpg";
import { AnimatedPageHero } from "@/components/layout/animated-page-hero";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay },
});

interface SpecialProgramProps {
  image: string;
  tag: string;
  title: string;
  body: React.ReactNode;
  reverse?: boolean;
  accent?: "gold" | "navy";
  programKey: string;
}

function SpecialProgram({ image, tag, title, body, reverse, accent = "navy", programKey }: SpecialProgramProps) {
  const overlayClass =
    accent === "gold"
      ? reverse
        ? "bg-gradient-to-r from-primary/70 to-transparent"
        : "bg-gradient-to-l from-primary/70 to-transparent"
      : reverse
      ? "bg-gradient-to-r from-secondary/80 to-transparent"
      : "bg-gradient-to-l from-secondary/80 to-transparent";

  return (
    <motion.div
      {...fadeUp()}
      className={`bg-white shadow-xl rounded-xl overflow-hidden flex flex-col ${
        reverse ? "lg:flex-row-reverse" : "lg:flex-row"
      } mb-16`}
    >
      {/* Image */}
      <div className="lg:w-1/2 relative min-h-[360px]">
        <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
        <div className={`absolute inset-0 ${overlayClass}`} />
        <div
          className={`absolute inset-0 flex items-end p-10 ${
            reverse ? "justify-start" : "justify-end text-right"
          }`}
        >
          <span className="bg-primary text-secondary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
            {tag}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="lg:w-1/2 p-10 lg:p-14 flex flex-col justify-center">
        <h3 className="text-3xl font-serif font-bold text-secondary mb-5">{title}</h3>
        <div className="text-gray-600 leading-relaxed space-y-3 mb-8">{body}</div>
        <Link href={`/program-enroll?program=${programKey}`}>
          <Button className="self-start uppercase tracking-wider rounded-full font-bold px-8 bg-secondary text-white hover:bg-primary hover:text-secondary transition-all duration-200">
            Enroll Now
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

export default function Programs() {
  const adultPrograms = [
    { title: "HIIT Intensity", schedule: "Mon, Wed, Fri — 6:00 AM", trainer: "Alex M.", programKey: "adult-fitness" },
    { title: "Vinyasa Flow Yoga", schedule: "Tue, Thu — 7:00 AM", trainer: "Sarah K.", programKey: "adult-fitness" },
    { title: "Pilates Core", schedule: "Mon, Wed — 6:00 PM", trainer: "Sarah K.", programKey: "adult-fitness" },
    { title: "Spin & Burn", schedule: "Daily — 5:30 PM", trainer: "David J.", programKey: "adult-fitness" },
    { title: "Strength & Conditioning", schedule: "Tue, Thu, Sat — 8:00 AM", trainer: "Marcus T.", programKey: "adult-fitness" },
  ];

  const youthPrograms = [
    { title: "Kids Karate", age: "6–12 Years", schedule: "Sat — 10:00 AM", programKey: "kids-youth" },
    { title: "Teen Functional Fitness", age: "13–17 Years", schedule: "Wed — 4:30 PM", programKey: "kids-youth" },
    { title: "Youth Swim Club", age: "8–14 Years", schedule: "Sun — 9:00 AM", programKey: "kids-youth" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="pt-20">
        <AnimatedPageHero
          eyebrow="Group Fitness"
          title="Move Together"
          description="Experience the energy of our elite group classes led by master trainers in our specialized luxury studios."
          image={programsImg}
          imageAlt="Ivory Health Club group fitness class"
          program
        />
      </div>

      <div className="container mx-auto max-w-7xl px-6 pb-24 pt-20">

        {/* Adult Fitness Classes */}
        <motion.div
          {...fadeUp()}
          className="bg-white shadow-xl rounded-xl overflow-hidden mb-16 flex flex-col lg:flex-row"
        >
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
                <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 rounded-lg">
                  <div>
                    <h4 className="font-bold text-secondary">{prog.title}</h4>
                    <p className="text-sm text-gray-500">{prog.trainer}</p>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2">
                    <div className="text-sm text-primary font-bold">{prog.schedule}</div>
                    <Link href={`/program-enroll?program=${prog.programKey}`}>
                      <Button size="sm" className="bg-secondary text-white hover:bg-primary hover:text-secondary uppercase tracking-wider font-bold rounded-full">
                        Enroll Now
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/program-enroll?program=adult-fitness">
              <Button className="w-full bg-secondary text-white hover:bg-primary hover:text-secondary uppercase tracking-wider font-bold rounded-full h-12 transition-all duration-200">
                Enroll Now
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Kids & Youth */}
        <motion.div
          {...fadeUp()}
          className="bg-white shadow-xl rounded-xl overflow-hidden mb-16 flex flex-col lg:flex-row-reverse"
        >
          <div className="lg:w-1/2 relative min-h-[400px]">
            <img src={youthImg} alt="Youth Programs" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-l from-primary/80 to-transparent flex items-center justify-end p-12 text-right">
              <h2 className="text-4xl font-serif font-bold text-secondary max-w-sm drop-shadow-md">Active Futures</h2>
            </div>
          </div>
          <div className="lg:w-1/2 p-12">
            <h3 className="text-2xl font-serif font-bold text-secondary mb-6 border-b border-gray-100 pb-4">Kids & Youth Programs</h3>
            <p className="text-gray-600 mb-8">
              Instill the value of health early. Our youth programs are designed to be fun, safe, and engaging — run by certified youth fitness specialists.
            </p>
            <div className="space-y-4 mb-8">
              {youthPrograms.map((prog, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <h4 className="font-bold text-secondary">{prog.title}</h4>
                    <p className="text-sm text-gray-500">Ages: {prog.age}</p>
                  </div>
                  <div className="flex flex-col sm:items-end gap-2">
                    <div className="text-sm text-secondary font-bold">{prog.schedule}</div>
                    <Link href={`/program-enroll?program=${prog.programKey}`}>
                      <Button size="sm" variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white uppercase tracking-wider font-bold rounded-full">
                        Enroll Now
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/program-enroll?program=kids-youth">
              <Button variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary hover:text-white uppercase tracking-wider font-bold rounded-full h-12 transition-all duration-200">
                Enroll Now
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* ── Divider ── */}
        <motion.div {...fadeUp()} className="text-center mb-16">
          <span className="inline-block bg-primary/10 text-primary font-bold tracking-widest uppercase text-sm px-6 py-2 rounded-full">
            Specialty Programmes
          </span>
          <h2 className="text-4xl font-serif font-bold text-secondary mt-4">Built for Every Goal</h2>
        </motion.div>

        {/* 70 Plus Club */}
        <SpecialProgram
          image={sevenPlusImg}
          tag="70 Plus Club"
          title="Ivory 70 Plus Club"
          accent="gold"
         programKey="70-plus-club"
          body={
            <p>
              A platform designed to keep seniors thriving. We provide healthy, recreational, and fun activities — gentle exercise, dance, walks, yoga, interactive nutritional talks, and social activities — for individuals aged 70 and above.
            </p>
          }
        />

        {/* Weight Loss Challenge */}
        <SpecialProgram
          image={weightLossImg}
          tag="Weight Loss"
          title="Weight Loss Challenge"
          reverse
         programKey="weight-loss-challenge"
          body={
            <>
              <p>
                A complete healthy lifestyle platform for everybody and every-body. We provide all the support for your weight-loss and fitness goals.
              </p>
              <p>
                It's simple, affordable, effective… and <strong>FUN!</strong> Whether your goal is losing a few inches, staying active, or completely transforming yourself — we have everything you need.
              </p>
            </>
          }
        />

        {/* Bond4Fitness */}
        <SpecialProgram
          image={bond4Img}
          tag="Corporate Wellness"
          title="Bond4Fitness"
          accent="gold"
         programKey="bond4fitness"
          body={
            <>
              <p>
                Improved employee productivity can have considerable impact on an organization's profitability. Our corporate wellness programs improve overall morale as participating teams develop a genuine team spirit.
              </p>
              <p>
                As staff bond, fitness is promoted, accountability increases, and friendships form — creating a more energetic, positive, and productive workplace.
              </p>
            </>
          }
        />

        {/* Fit2Live Bootcamp */}
        <SpecialProgram
          image={fit2LiveImg}
          tag="Bootcamp"
          title="Fit2Live (Bootcamp)"
          reverse
         programKey="fit2live-bootcamp"
          body={
            <>
              <p>
                <strong>FIT:</strong> A state of complete physical, social, and mental well-being — the ability to function effectively in all day-to-day activities and remain healthy.
              </p>
              <p>
                <strong>LIVE:</strong> Two things that will never change — the will to change and the fear of change. Both are essential for well-being. Hurry to live and think that each day is, by itself, a life.
              </p>
            </>
          }
        />

        {/* Personal Training */}
        <SpecialProgram
          image={personalTrainingImg}
          tag="Personal Training"
          title="Customised & Personal Training"
          accent="gold"
         programKey="personal-training"
          body={
            <p>
              Personalized training services designed around your needs and goals, with a wide range of solutions to suit you. If there is one thing we should never stop doing, it is perfecting ourselves — <em>"Go the extra mile."</em> We can always be better, do better, live better.
            </p>
          }
        />

        {/* Boxing Class */}
        <SpecialProgram
          image={boxingImg}
          tag="Boxing"
          title="Boxing Class"
          reverse
         programKey="boxing-class"
          body={
            <p>
              This class is not intended to teach self-defence — it is designed to build fitness and conditioning, foster personal development and self-confidence, and give you a healthy way to blow off steam. A powerful workout unlike any other.
            </p>
          }
        />

        {/* Bottom CTA */}
        <motion.div
          {...fadeUp()}
          className="mt-8 text-center bg-secondary rounded-2xl py-16 px-8"
        >
          <h3 className="text-3xl font-serif font-bold text-white mb-4">Ready to Start Your Journey?</h3>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            Speak with one of our wellness advisors and find the programme that is right for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/program-enroll?program=adult-fitness">
              <Button className="bg-primary text-secondary hover:bg-primary/80 uppercase tracking-wider font-bold rounded-full px-10 h-12 hover:scale-105 transition-all duration-200">
                Enroll Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-secondary uppercase tracking-wider font-bold rounded-full px-10 h-12 transition-all duration-200">
                Speak to an Advisor
              </Button>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
