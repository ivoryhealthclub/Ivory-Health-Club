import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, Utensils, GlassWater } from "lucide-react";
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

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [foodOpen, setFoodOpen] = useState(false);
  const [mobileFoodOpen, setMobileFoodOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setFoodOpen(false);
  }, [location]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFoodOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinksLeft = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Membership", href: "/membership" },
  ];

  const navLinksRight = [
    { label: "Programs", href: "/programs" },
    { label: "Gallery", href: "/gallery" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  const navLinks = [...navLinksLeft, ...navLinksRight];

  const isFoodActive = location === "/restaurant" || location === "/juice-bar";
  const linkBase = "text-sm font-semibold tracking-wide uppercase transition-colors hover:text-primary";
  const linkColor = (active: boolean) =>
    active ? "text-primary" : isScrolled ? "text-foreground" : "text-white/90";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm py-4" : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center gap-6">
        <Link href="/" className="group flex items-center shrink-0">
          <img
            src={logo}
            alt="Ivory Health Club"
            className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Nav — centered */}
        <nav className="hidden lg:flex flex-1 items-center justify-center gap-6">
          {navLinksLeft.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(linkBase, linkColor(location === link.href))}
            >
              {link.label}
            </Link>
          ))}

          {/* Food & Beverages dropdown — right after Membership */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setFoodOpen((o) => !o)}
              className={cn(
                linkBase,
                "flex items-center gap-1",
                linkColor(isFoodActive)
              )}
            >
              Food & Beverages
              <ChevronDown
                size={14}
                className={cn("transition-transform duration-200", foodOpen && "rotate-180")}
              />
            </button>

            <AnimatePresence>
              {foodOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-white shadow-2xl border border-gray-100 rounded-xl overflow-hidden"
                >
                  {foodItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group border-b border-gray-50 last:border-0"
                    >
                      <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-secondary transition-colors">
                        <item.icon size={16} className="text-primary group-hover:text-secondary transition-colors" />
                      </div>
                      <div>
                        <p className="font-bold text-secondary text-sm group-hover:text-primary transition-colors uppercase tracking-wide">
                          {item.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-snug">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {navLinksRight.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(linkBase, linkColor(location === link.href))}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <Link href="/book">
            <Button
              variant={isScrolled ? "secondary" : "outline"}
              className={cn(
                "uppercase tracking-wider rounded-full font-bold px-6 transition-all duration-200",
                isScrolled
                  ? "hover:bg-secondary hover:text-white"
                  : "text-white border-white/50 hover:bg-white hover:text-secondary"
              )}
            >
              Book Service
            </Button>
          </Link>
          <Link href="/enroll">
            <Button className="uppercase tracking-wider rounded-full font-bold px-6 bg-primary text-secondary hover:bg-primary/80 hover:scale-105 transition-all duration-200">
              Join Now
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className={cn("lg:hidden p-2 -mr-2", isScrolled ? "text-secondary" : "text-white")}
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
            className="absolute top-full left-0 right-0 bg-white shadow-xl border-t lg:hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-lg font-serif py-2 border-b border-gray-100",
                    location === link.href ? "text-primary font-bold" : "text-secondary"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Food & Beverages accordion */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => setMobileFoodOpen((o) => !o)}
                  className={cn(
                    "w-full flex items-center justify-between text-lg font-serif py-2",
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

              <div className="flex flex-col gap-4 mt-4">
                <Link href="/book">
                  <Button variant="secondary" className="w-full uppercase tracking-wider rounded-none">
                    Book Service
                  </Button>
                </Link>
                <Link href="/enroll">
                  <Button className="w-full uppercase tracking-wider rounded-none bg-primary text-secondary">
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
