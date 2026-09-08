import { motion } from "framer-motion";
import { ArrowRight, Check, Dumbbell, ShieldCheck, Sparkles, Trophy, UsersRound } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import programsImg from "@assets/generated_images/programs.jpg";
import youthImg from "@assets/generated_images/youth.jpg";
import gymImg from "@assets/generated_images/gym.jpg";
import entertainmentImg from "@assets/generated_images/entertainment.jpg";
import { AnimatedPageHero } from "@/components/layout/animated-page-hero";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay },
});

type ListSectionProps = {
  title: string;
  items: readonly string[];
  icon?: typeof Check;
};

function ListSection({ title, items, icon: Icon = Check }: ListSectionProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
      <h2 className="text-2xl font-serif font-bold text-secondary mb-5">{title}</h2>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-gray-600">
            <Icon size={18} className="text-primary mt-0.5 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProgramPageShell({
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  children,
  programKey,
  ctaLabel = "Enroll Now",
}: {
  eyebrow: string;
  title: string;
  intro: string;
  image: string;
  imageAlt: string;
  children: React.ReactNode;
  programKey: string;
  ctaLabel?: string;
}) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="pt-20">
        <AnimatedPageHero
          eyebrow={eyebrow}
          title={title}
          description={intro}
          image={image}
          imageAlt={imageAlt}
          program
        >
          <Link href={`/program-enroll?program=${programKey}`}>
            <Button className="bg-primary text-secondary hover:bg-white hover:text-secondary uppercase tracking-wider font-bold rounded-full px-8 h-12">
              {ctaLabel}
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-secondary uppercase tracking-wider font-bold rounded-full px-8 h-12">
              Speak to an Advisor
            </Button>
          </Link>
        </AnimatedPageHero>
      </div>
      <section className="container mx-auto max-w-7xl px-6 pb-16 pt-16">
        <div className="grid md:grid-cols-2 gap-6">{children}</div>
      </section>
    </div>
  );
}

export function FitnessPrograms() {
  return (
    <ProgramPageShell
      eyebrow="Ivory Performance"
      title="Fitness Programs"
      intro="Build strength, energy, and confidence with expert-led programs created for every level, from first session to long-term performance."
      image={programsImg}
      imageAlt="Members training together in a fitness class"
      programKey="adult-fitness"
    >
      <ListSection
        title="Program Overview"
        items={[
          "Structured coaching in premium studios and training zones.",
          "Small-group sessions that balance energy, accountability, and individual attention.",
          "Flexible options for beginners, experienced members, and performance-focused athletes.",
        ]}
        icon={Dumbbell}
      />
      <ListSection
        title="Benefits"
        items={[
          "Improve strength, mobility, cardiovascular fitness, and recovery.",
          "Train with certified coaches who keep technique and progress at the center.",
          "Stay motivated through a welcoming community and measurable milestones.",
        ]}
        icon={Sparkles}
      />
      <ListSection
        title="Available Activities & Classes"
        items={["HIIT Intensity", "Vinyasa Flow Yoga", "Pilates Core", "Spin & Burn", "Strength & Conditioning", "Personal Training"]}
      />
      <ListSection
        title="Your Next Session"
        items={[
          "Choose a goal and preferred training style.",
          "Meet with an advisor to find the right class or coaching plan.",
          "Start with a welcoming orientation and a plan you can sustain.",
        ]}
        icon={UsersRound}
      />
    </ProgramPageShell>
  );
}

export function KidsYouthPrograms() {
  return (
    <ProgramPageShell
      eyebrow="Active Futures"
      title="Kids & Youth Programs"
      intro="Give young people a positive relationship with movement through joyful, age-appropriate activities led by caring youth fitness specialists."
      image={youthImg}
      imageAlt="Young members enjoying a youth fitness activity"
      programKey="kids-youth"
    >
      <ListSection
        title="Age Groups"
        items={["Little Movers — ages 4–6", "Kids Active Club — ages 7–12", "Teen Performance — ages 13–17"]}
        icon={UsersRound}
      />
      <ListSection
        title="Activities"
        items={["Kids Karate", "Teen Functional Fitness", "Youth Swim Club", "Movement games", "Foundational strength and coordination"]}
        icon={Trophy}
      />
      <ListSection
        title="Benefits"
        items={[
          "Build confidence, coordination, strength, and healthy habits.",
          "Learn teamwork and discipline in a fun, encouraging environment.",
          "Enjoy activities that support both physical wellbeing and social connection.",
        ]}
        icon={Sparkles}
      />
      <ListSection
        title="Safety & Community"
        items={[
          "Sessions are planned for each age group and supervised by trained team members.",
          "Clear check-in and collection routines help families feel confident.",
          "Every child is encouraged to progress at their own pace.",
        ]}
        icon={ShieldCheck}
      />
    </ProgramPageShell>
  );
}

export function SummerCamp() {
  return (
    <ProgramPageShell
      eyebrow="School Holiday Experiences"
      title="Summer Camp & Fun Club"
      intro="A vibrant holiday experience where children can move, make friends, discover new sports, and fill their days with memorable adventures."
      image={entertainmentImg}
      imageAlt="Children enjoying a fun club activity"
      programKey="summer-camp"
      ctaLabel="Register Now"
    >
      <ListSection
        title="Camp Activities"
        items={["Daily movement sessions", "Team challenges", "Dance and rhythm", "Wellness discovery", "Friendship-building group activities"]}
        icon={Sparkles}
      />
      <ListSection
        title="Sports & Games"
        items={["Soccer fundamentals", "Basketball skills", "Swimming activities", "Relay races", "Indoor and outdoor team games"]}
        icon={Trophy}
      />
      <ListSection
        title="Creative Activities"
        items={["Arts and crafts", "Music and performance", "Imagination-led games", "Creative problem solving", "Showcase moments for families"]}
      />
      <ListSection
        title="Age Groups & Registration"
        items={[
          "Junior Fun Club — ages 4–6",
          "Explorers Camp — ages 7–12",
          "Teen Leadership Club — ages 13–17",
          "Places are limited so every camper receives attentive supervision.",
        ]}
        icon={ShieldCheck}
      />
    </ProgramPageShell>
  );
}

const academies = [
  {
    title: "Ivory Soccer Academy",
    href: "/programs/academies/soccer",
    programKey: "soccer-academy",
    image: programsImg,
    description: "Technical training, game intelligence, and teamwork for every stage of the journey.",
  },
  {
    title: "Ivory Tennis Academy",
    href: "/programs/academies/tennis",
    programKey: "tennis-academy",
    image: gymImg,
    description: "Build a confident all-court game with focused coaching and purposeful practice.",
  },
  {
    title: "Ivory Swimming Club",
    href: "/programs/academies/swimming",
    programKey: "swimming-club",
    image: youthImg,
    description: "Water confidence, stroke development, and safe progression in a supportive club.",
  },
  {
    title: "Ivory Basketball Academy",
    href: "/programs/academies/basketball",
    programKey: "basketball-academy",
    image: entertainmentImg,
    description: "Develop fundamentals, athleticism, and court awareness through energetic sessions.",
  },
];

export function Academies() {
  return (
    <div className="pt-24 bg-gray-50 min-h-screen">
      <AnimatedPageHero
        eyebrow="Train With Purpose"
        title="Our Academies"
        description="Discover specialist sports programs where expert coaching, character, and a love of the game come together."
        image={programsImg}
        imageAlt="Ivory Health Club sports academy"
      />
      <section className="container mx-auto px-6 max-w-7xl py-16 lg:py-24">
        <div className="grid md:grid-cols-2 gap-7">
          {academies.map((academy, index) => (
            <motion.div
              key={academy.href}
              {...fadeUp(index * 0.06)}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 group"
            >
              <div className="h-56 relative overflow-hidden">
                <img src={academy.image} alt={academy.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent" />
                <h2 className="absolute bottom-5 left-6 right-6 text-2xl font-serif font-bold text-white">{academy.title}</h2>
              </div>
              <div className="p-7">
                <p className="text-gray-600 leading-relaxed mb-6">{academy.description}</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <Link href={academy.href} className="inline-flex items-center gap-2 text-secondary font-bold uppercase tracking-wider text-sm hover:text-primary transition-colors">
                    Explore Academy <ArrowRight size={17} />
                  </Link>
                  <Link href={`/program-enroll?program=${academy.programKey}`}>
                    <Button className="w-full sm:w-auto bg-secondary text-white hover:bg-primary hover:text-secondary uppercase tracking-wider font-bold rounded-full px-5">
                      Enroll Now
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

type AcademyKey = "soccer" | "tennis" | "swimming" | "basketball";

type AcademyDetailData = {
  title: string;
  intro: string;
  image: string;
  overview: readonly string[];
  skills: readonly string[];
  ages: readonly string[];
  benefits: readonly string[];
  safety?: readonly string[];
};

const academyDetails: Record<AcademyKey, AcademyDetailData> = {
  soccer: {
    title: "Ivory Soccer Academy",
    intro: "A complete football development pathway that helps young players grow technically, tactically, physically, and as teammates.",
    image: programsImg,
    overview: ["Ball mastery and first touch", "Small-sided games and decision making", "Position-specific coaching", "Match preparation and review"],
    skills: ["Passing and receiving", "Dribbling and finishing", "Movement off the ball", "Communication and teamwork"],
    ages: ["Foundation — ages 5–7", "Development — ages 8–12", "Performance — ages 13–17"],
    benefits: ["Build confidence in every session", "Develop a disciplined training routine", "Learn to compete with respect and purpose"],
  },
  tennis: {
    title: "Ivory Tennis Academy",
    intro: "Purposeful tennis coaching for beginners and developing players who want to build a reliable game and enjoy every stage of progress.",
    image: gymImg,
    overview: ["Grip, balance, and movement fundamentals", "Rally development and court positioning", "Serve, return, and point construction", "Friendly match-play opportunities"],
    skills: ["Forehand and backhand technique", "Footwork and recovery", "Serve consistency", "Tactical awareness and resilience"],
    ages: ["Mini Tennis — ages 5–7", "Junior Development — ages 8–12", "Teen Performance — ages 13–17"],
    benefits: ["Improve coordination and agility", "Grow focus and self-belief", "Train in a positive and structured environment"],
  },
  swimming: {
    title: "Ivory Swimming Club",
    intro: "A welcoming swimming pathway that builds water confidence first, then develops safe, efficient strokes and a lifelong love of the water.",
    image: youthImg,
    overview: ["Water familiarisation and confidence", "Stroke technique and breathing", "Endurance and swim fitness", "Progress checks and club challenges"],
    skills: ["Freestyle, backstroke, breaststroke, and butterfly", "Streamlining and turns", "Breathing control", "Pool awareness and water safety"],
    ages: ["Water Explorers — ages 4–6", "Stroke Development — ages 7–12", "Performance Swim — ages 13–17"],
    benefits: ["Become safer and more confident in the water", "Improve fitness with low-impact training", "Celebrate progress at every level"],
    safety: ["All sessions are supervised by trained instructors.", "Groups are matched to ability so swimmers can progress confidently.", "Water safety and responsible pool habits are part of every stage."],
  },
  basketball: {
    title: "Ivory Basketball Academy",
    intro: "High-energy basketball sessions that teach the fundamentals, encourage creative play, and help athletes become smart, confident teammates.",
    image: entertainmentImg,
    overview: ["Ball-handling and movement", "Passing, spacing, and team concepts", "Shooting mechanics and finishing", "Game play and friendly competition"],
    skills: ["Dribbling under pressure", "Defensive stance and footwork", "Rebounding and transition play", "Communication and court vision"],
    ages: ["Rookies — ages 5–7", "Junior Development — ages 8–12", "Performance — ages 13–17"],
    benefits: ["Build athleticism and coordination", "Learn to make confident decisions in play", "Grow leadership, discipline, and teamwork"],
  },
} as const;

export function AcademyDetail({ academy }: { academy: AcademyKey }) {
  const details = academyDetails[academy];
  const programKey = academy === "swimming" ? "swimming-club" : `${academy}-academy`;

  return (
    <ProgramPageShell
      eyebrow="Ivory Sports Academy"
      title={details.title}
      intro={details.intro}
      image={details.image}
      imageAlt={`${details.title} training session`}
      programKey={programKey}
    >
      <ListSection title="Training Overview" items={details.overview} icon={Dumbbell} />
      <ListSection title="Skills Development" items={details.skills} icon={Trophy} />
      <ListSection title="Age Groups" items={details.ages} icon={UsersRound} />
      <ListSection title={details.safety ? "Safety & Benefits" : "Benefits"} items={[...details.benefits, ...(details.safety ?? [])]} icon={details.safety ? ShieldCheck : Sparkles} />
    </ProgramPageShell>
  );
}