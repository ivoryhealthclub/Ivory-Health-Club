import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, ChevronRight, Utensils, GlassWater } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@assets/Logo_IHC_1785932659433.png";

const foodItems = [
  {
    label: "Restaurant",
    href: "/restaurant",
    icon: Utensils,
    desc: "Margaret's Bistro — nutritionist-designed gourmet dining",
  },
  {
    label: "Juice Bar",
    href: "/juice-bar",
    icon: GlassWater,
    desc: "Cold-pressed juices, shakes & wellness blends",
  },
];

const academyItems = [
  { label: "Ivory Soccer Academy", href: "/programs/academies/soccer" },
  { label: "Ivory Tennis Academy", href: "/programs/academies/tennis" },
  { label: "Ivory Swimming Club", href: "/programs/academies/swimming" },
  { label: "Ivory Basketball Academy", href: "/programs/academies/basketball" },
];

const programItems = [
  { label: "Fitness Programs", href: "/programs/fitness" },
  { label: "Kids / Youth Programs", href: "/programs/kids-youth" },
  { label: "Summer Camp and Fun Club", href: "/programs/summer-camp" },
];

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [foodOpen, setFoodOpen] = useState(false);
  const [mobileFoodOpen, setMobileFoodOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [academiesOpen, setAcademiesOpen] = useState(false);
  const [mobileProgramsOpen, setMobileProgramsOpen] = useState(false);
  const [mobileAcademiesOpen, setMobileAcademiesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const programsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setFoodOpen(false);
    setProgramsOpen(false);
    setAcademiesOpen(false);
    setMobileProgramsOpen(false);
    setMobileAcademiesOpen(false);
  }, [location]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFoodOpen(false);
      }
      if (programsRef.current && !programsRef.current.contains(e.target as Node)) {
        setProgramsOpen(false);
        setAcademiesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFoodOpen(false);
        setProgramsOpen(false);
        setAcademiesOpen(false);
        setMobileProgramsOpen(false);
        setMobileAcademiesOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navLinksLeft = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Membership", href: "/membership" },
  ];

  const navLinksRight = [
    { label: "Gallery", href: "/gallery" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  const isFoodActive = location === "/restaurant" || location === "/juice-bar";
  const isProgramsActive = location === "/programs" || location.startsWith("/programs/");
  const linkBase = "text-[11px] font-semibold tracking-[0.12em] uppercase leading-tight transition-colors hover:text-primary";
  const linkColor = (active: boolean) =>
    active ? "text-primary" : "text-secondary";

  return (
    <header
      className={cn(
        "liquid-glass fixed left-3 right-3 top-3 z-50 overflow-visible rounded-[28px] transition-all duration-300",
        isScrolled
          ? "py-3 shadow-[0_16px_42px_rgba(41,22,111,0.16)]"
          : "py-4 shadow-[0_12px_34px_rgba(41,22,111,0.12)]"
      )}
    >
      <div className="container mx-auto flex max-w-7xl items-center gap-4 px-6 lg:gap-6">
        <Link href="/" className="group flex items-center shrink-0">
          <img
            src={logo}
            alt="Ivory Health Club"
            className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Nav — centered */}
        <nav aria-label="Primary navigation" className="hidden min-w-0 flex-1 items-center justify-center gap-4 xl:flex xl:gap-5">
          {navLinksLeft.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(linkBase, linkColor(location === link.href))}
            >
              {link.label}
            </Link>
          ))}

          {/* Programs dropdown */}
          <div
            ref={programsRef}
            className="relative order-2"
            onMouseEnter={() => setProgramsOpen(true)}
            onMouseLeave={() => {
              setProgramsOpen(false);
              setAcademiesOpen(false);
            }}
          >
            <div className="flex items-center">
              <Link
                href="/programs"
                className={cn(linkBase, linkColor(isProgramsActive), "pr-1")}
              >
                Programs
              </Link>
              <button
                type="button"
                aria-label="Open Programs menu"
                aria-haspopup="menu"
                aria-expanded={programsOpen}
                onClick={() => setProgramsOpen((open) => !open)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setProgramsOpen(true);
                  }
                }}
                className={cn("p-1 rounded-sm", linkColor(isProgramsActive), "hover:text-primary")}
              >
                <ChevronDown
                  size={14}
                  className={cn("transition-transform duration-200", programsOpen && "rotate-180")}
                />
              </button>
            </div>

            <AnimatePresence>
              {programsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-80 z-50"
                >
                  <div className="bg-white shadow-2xl border border-gray-100 rounded-xl overflow-visible">
                    {programItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center justify-between px-5 py-4 text-sm font-bold uppercase tracking-wide text-secondary hover:bg-gray-50 hover:text-primary transition-colors border-b border-gray-100"
                      >
                        {item.label}
                        <ChevronRight size={16} className="text-primary/70" />
                      </Link>
                    ))}

                    <div
                      className="relative"
                      onMouseEnter={() => setAcademiesOpen(true)}
                      onFocus={() => setAcademiesOpen(true)}
                    >
                      <div className="flex items-center justify-between px-5 py-4 text-sm font-bold uppercase tracking-wide text-secondary hover:bg-gray-50 hover:text-primary transition-colors">
                        <Link href="/programs/academies" className="flex-1">
                          Academies
                        </Link>
                        <button
                          type="button"
                          aria-label="Open Academies submenu"
                          aria-haspopup="menu"
                          aria-expanded={academiesOpen}
                          onClick={() => setAcademiesOpen((open) => !open)}
                          onKeyDown={(event) => {
                            if (event.key === "ArrowRight" || event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              setAcademiesOpen(true);
                            }
                          }}
                          className="p-1 text-primary rounded-sm"
                        >
                          <ChevronRight size={17} />
                        </button>
                      </div>

                      <AnimatePresence>
                        {academiesOpen && (
                          <motion.div
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -6 }}
                            transition={{ duration: 0.16 }}
                            className="absolute left-full top-0 pl-2 w-80"
                            onMouseEnter={() => setAcademiesOpen(true)}
                          >
                            <div className="bg-white shadow-2xl border border-gray-100 rounded-xl overflow-hidden">
                              {academyItems.map((item) => (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  className="block px-5 py-4 text-sm font-bold uppercase tracking-wide text-secondary hover:bg-gray-50 hover:text-primary transition-colors border-b border-gray-100 last:border-0"
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {navLinksRight.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(linkBase, linkColor(location === link.href), "order-3")}
            >
              {link.label}
            </Link>
          ))}

          {/* Food & Beverages dropdown */}
          <div ref={dropdownRef} className="relative order-1">
            <button
              onClick={() => setFoodOpen((o) => !o)}
              className={cn(
                linkBase,
                "flex max-w-[82px] items-center justify-center gap-1 text-center",
                linkColor(isFoodActive)
              )}
            >
              Food & Beverages
              <ChevronDown
                size={12}
                className={cn("shrink-0 transition-transform duration-200", foodOpen && "rotate-180")}
              />
            </button>

            <AnimatePresence>
              {foodOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xl"
                >
                  {foodItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group flex items-start gap-4 border-b border-gray-50 px-5 py-4 transition-colors hover:bg-gray-50 last:border-0"
                    >
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-secondary">
                        <item.icon size={16} className="text-primary transition-colors group-hover:text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold uppercase tracking-wide text-secondary transition-colors group-hover:text-primary">
                          {item.label}
                        </p>
                        <p className="mt-0.5 text-xs leading-snug text-gray-500">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          <Link href="/book">
            <Button
              variant="secondary"
              className={cn(
                "rounded-full px-5 text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-200",
                "bg-secondary text-white hover:bg-secondary/90"
              )}
            >
              Book Service
            </Button>
          </Link>
          <Link href="/enroll">
            <Button className="rounded-full bg-primary px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-secondary transition-all duration-200 hover:scale-105 hover:bg-primary/80">
              Join Now
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="ml-auto p-2 text-secondary xl:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="liquid-glass-panel absolute left-0 right-0 top-full rounded-b-[28px] border-t border-white/45 shadow-xl xl:hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinksLeft.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-base font-serif py-2 border-b border-gray-100",
                    location === link.href ? "text-primary font-bold" : "text-secondary"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Programs accordion */}
              <div className="order-2 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <Link
                    href="/programs"
                    className={cn(
                      "flex-1 text-base font-serif py-2",
                      isProgramsActive ? "text-primary font-bold" : "text-secondary"
                    )}
                  >
                    Programs
                  </Link>
                  <button
                    type="button"
                    aria-label="Expand Programs menu"
                    aria-haspopup="menu"
                    aria-expanded={mobileProgramsOpen}
                    onClick={() => setMobileProgramsOpen((open) => !open)}
                    className="p-3 text-secondary"
                  >
                    <ChevronDown
                      size={18}
                      className={cn("transition-transform duration-200", mobileProgramsOpen && "rotate-180")}
                    />
                  </button>
                </div>
                <AnimatePresence>
                  {mobileProgramsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {programItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center justify-between pl-4 py-3 text-base text-gray-600 hover:text-primary transition-colors"
                        >
                          {item.label}
                          <ChevronRight size={16} className="mr-2 text-primary" />
                        </Link>
                      ))}
                      <div className="flex items-center justify-between pl-4">
                        <Link
                          href="/programs/academies"
                          className="flex-1 py-3 text-base text-gray-600 hover:text-primary transition-colors"
                        >
                          Academies
                        </Link>
                        <button
                          type="button"
                          aria-label="Expand Academies menu"
                          aria-haspopup="menu"
                          aria-expanded={mobileAcademiesOpen}
                          onClick={() => setMobileAcademiesOpen((open) => !open)}
                          className="p-3 text-secondary"
                        >
                          <ChevronDown
                            size={17}
                            className={cn("transition-transform duration-200", mobileAcademiesOpen && "rotate-180")}
                          />
                        </button>
                      </div>
                      <AnimatePresence>
                        {mobileAcademiesOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-4"
                          >
                            {academyItems.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="block py-3 pl-4 text-sm uppercase tracking-wide text-gray-500 hover:text-primary transition-colors"
                              >
                                {item.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinksRight.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "order-3 border-b border-gray-100 py-2 text-lg font-serif",
                    location === link.href ? "text-primary font-bold" : "text-secondary"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Food & Beverages accordion */}
              <div className="order-1 border-b border-gray-100">
                <button
                  onClick={() => setMobileFoodOpen((o) => !o)}
                  className={cn(
                    "w-full flex items-center justify-between text-base font-serif py-2",
                    isFoodActive ? "text-primary font-bold" : "text-secondary"
                  )}
                >
                  Food & Beverages
                  <ChevronDown
                    size={18}
                    className={cn("transition-transform duration-200", mobileFoodOpen && "rotate-180")}
                  />
                </button>
                <AnimatePresence>
                  {mobileFoodOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      {foodItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-3 pl-4 py-3 text-base text-gray-600 hover:text-primary transition-colors"
                        >
                          <item.icon size={16} className="text-primary shrink-0" />
                          {item.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="order-4 mt-4 flex flex-col gap-4">
                <Link href="/book">
                  <Button variant="secondary" className="w-full text-sm uppercase tracking-wider rounded-none">
                    Book Service
                  </Button>
                </Link>
                <Link href="/enroll">
                  <Button className="w-full text-sm uppercase tracking-wider rounded-none bg-primary text-secondary">
                    Join Now
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
