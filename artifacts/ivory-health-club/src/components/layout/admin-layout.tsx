import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  Image as ImageIcon,
  FileText,
  PieChart,
  LogOut,
  ChevronLeft
} from "lucide-react";
import logo from "@assets/Logo_IHC_1785932659433.png";

export function AdminLayout({
  children,
  onSignOut,
}: {
  children: ReactNode;
  onSignOut: () => void;
}) {
  const [location] = useLocation();

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/enrollments", label: "Enrollments", icon: Users },
    { href: "/admin/bookings", label: "Bookings", icon: Calendar },
    { href: "/admin/messages", label: "Messages", icon: MessageSquare },
    { href: "/admin/memberships", label: "Memberships", icon: PieChart },
    { href: "/admin/blog", label: "Blog", icon: FileText },
    { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-muted/30">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-secondary text-white md:min-h-screen flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <img
            src={logo}
            alt="Ivory Health Club"
            className="h-12 w-auto object-contain bg-white rounded-sm p-1"
          />
          <div className="font-serif font-bold tracking-wider">ADMIN</div>
        </div>
        
        <nav className="flex-1 py-6 px-4 flex flex-col gap-1 overflow-y-auto">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                location === link.href
                  ? "bg-primary text-secondary"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              )}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ChevronLeft size={18} />
            Back to Website
          </Link>
          <button
            type="button"
            onClick={onSignOut}
            className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 max-w-full overflow-hidden">
        <div className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
