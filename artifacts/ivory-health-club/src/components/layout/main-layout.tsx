import { ReactNode, useEffect } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { useLocation } from "wouter";

export function MainLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary selection:text-secondary">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
