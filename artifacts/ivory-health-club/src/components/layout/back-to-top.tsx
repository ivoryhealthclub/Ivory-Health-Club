import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const SHOW_AFTER_PX = 400;

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > SHOW_AFTER_PX);

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  if (!visible) return null;

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-[5.5rem] right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-secondary text-white shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:bottom-[6rem] sm:right-7"
      aria-label="Back to top"
      title="Back to top"
    >
      <ArrowUp size={19} strokeWidth={2.25} aria-hidden="true" />
    </button>
  );
}