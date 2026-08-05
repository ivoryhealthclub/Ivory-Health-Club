import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@assets/Logo_IHC_1785932659433.png";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Membership", href: "/membership" },
    { label: "Programs", href: "/programs" },
    { label: "Gallery", href: "/gallery" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm py-4"
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        <Link href="/" className="group flex items-center">
          <img
            src={logo}
            alt="Ivory Health Club"
            className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-semibold tracking-wide uppercase transition-colors hover:text-primary",
                location === link.href
                  ? "text-primary"
                  : isScrolled
                  ? "text-foreground"
                  : "text-white/90"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-4 ml-4">
            <Link href="/book">
              <Button
                variant={isScrolled ? "secondary" : "outline"}
                className={cn(
                  "uppercase tracking-wider rounded-none font-bold px-6",
                  !isScrolled &&
                    "text-white border-white/50 hover:bg-white hover:text-secondary"
                )}
              >
                Book Service
              </Button>
            </Link>
            <Link href="/enroll">
              <Button className="uppercase tracking-wider rounded-none font-bold px-6 bg-primary text-secondary hover:bg-primary/90">
                Join Now
              </Button>
            </Link>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button
          className={cn(
            "lg:hidden p-2 -mr-2",
            isScrolled ? "text-secondary" : "text-white"
          )}
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
