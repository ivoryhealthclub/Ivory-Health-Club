import { ReactNode, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import heroBg from "@assets/generated_images/hero-bg.jpg";

type AnimatedPageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
  compact?: boolean;
  className?: string;
};

export function AnimatedPageHero({
  eyebrow,
  title,
  description,
  image = heroBg,
  imageAlt = "Ivory Health Club",
  children,
  compact = false,
  className = "",
}: AnimatedPageHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 70]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.06, reduceMotion ? 1.06 : 1.14]);

  return (
    <section
      ref={heroRef}
      className={`relative isolate flex min-h-[460px] items-center justify-center overflow-hidden bg-secondary ${
        compact ? "min-h-[360px]" : "h-[min(70vh,680px)]"
      } ${className}`}
    >
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 -z-20"
        transition={{ duration: 0.8 }}
      >
        <img src={image} alt={imageAlt} className="h-full w-full object-cover opacity-75" />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_25%,rgba(248,195,1,0.18),transparent_32%),linear-gradient(115deg,rgba(20,10,58,0.96),rgba(41,22,111,0.7)_48%,rgba(20,10,58,0.94))]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#140A3A]/30 via-transparent to-[#140A3A]/90" />

      <motion.div
        aria-hidden="true"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="absolute -right-28 -top-36 -z-10 h-[28rem] w-[28rem] rounded-full border border-primary/20"
      >
        <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_30px_rgba(248,195,1,0.9)]" />
      </motion.div>
      <motion.div
        aria-hidden="true"
        animate={reduceMotion ? undefined : { y: [0, -14, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-16 left-[12%] -z-10 h-24 w-24 rounded-full bg-primary/10 blur-2xl"
      />

      <div className="container mx-auto max-w-5xl px-6 py-24 text-center text-white md:py-28">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="mb-5 text-sm font-bold uppercase tracking-[0.24em] text-primary"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className={`font-serif font-bold leading-[1.08] tracking-tight text-white ${
            compact ? "text-4xl md:text-5xl" : "text-5xl md:text-7xl"
          }`}
        >
          {title}
        </motion.h1>
        {description && (
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.22 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl"
          >
            {description}
          </motion.div>
        )}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.36 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            {children}
          </motion.div>
        )}
      </div>

      {!compact && (
        <motion.div
          aria-hidden="true"
          animate={reduceMotion ? undefined : { y: [0, 8, 0], opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 text-primary"
        >
          <ChevronDown size={22} />
        </motion.div>
      )}
    </section>
  );
}