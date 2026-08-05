import { Link } from "wouter";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";
import logo from "@assets/Logo_IHC_1785932659433.png";

export function Footer() {
  return (
    <footer className="bg-[#140A3A] text-white/80 pt-20 pb-10">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div>
            <div className="mb-6">
              <img
                src={logo}
                alt="Ivory Health Club"
                className="h-16 w-auto object-contain"
              />
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              A premium luxury health and wellness destination in Nigeria. 
              Transform your body, enrich your mind, and unwind in a world-class 5-star environment.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-secondary transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-secondary transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-secondary transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-serif text-lg mb-6">Explore</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/membership" className="hover:text-primary transition-colors">Membership</Link></li>
              <li><Link href="/programs" className="hover:text-primary transition-colors">Programs</Link></li>
              <li><Link href="/gallery" className="hover:text-primary transition-colors">Gallery</Link></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors">Journal</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-serif text-lg mb-6">Wellness</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/services" className="hover:text-primary transition-colors">Premium Gym</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Luxury Spa</Link></li>
              <li><Link href="/programs" className="hover:text-primary transition-colors">Fitness Classes</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">Restaurant & Juice Bar</Link></li>
              <li><Link href="/services" className="hover:text-primary transition-colors">VIP Entertainment</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-serif text-lg mb-6">Visit Us</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex gap-3 items-start">
                <MapPin className="text-primary shrink-0 mt-1" size={18} />
                <span>4, Ogundana Street, off Allen Avenue, Ikeja, Lagos State, Nigeria.</span>
              </li>
              <li className="flex gap-3 items-start">
                <Phone className="text-primary shrink-0 mt-1" size={18} />
                <div className="flex flex-col gap-1">
                  <a href="tel:+2348108897628" className="hover:text-primary transition-colors">+234 810 889 7628</a>
                  <a href="tel:+2348108897631" className="hover:text-primary transition-colors">+234 810 889 7631</a>
                  <a href="tel:+2348108897650" className="hover:text-primary transition-colors">+234 810 889 7650</a>
                  <a href="tel:+2348108897652" className="hover:text-primary transition-colors">+234 810 889 7652</a>
                </div>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="text-primary shrink-0" size={18} />
                <a href="mailto:Info@ihc-ng.com" className="hover:text-primary transition-colors">Info@ihc-ng.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
          <p>© {new Date().getFullYear()} Ivory Health Club. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/admin" className="hover:text-white transition-colors">Admin Portal</Link>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
