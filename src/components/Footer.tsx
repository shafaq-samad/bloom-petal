import React from "react";
import { Mail, Phone, MapPin, Instagram, Facebook, Compass, Heart, ArrowUp, Clock, Flower } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="relative bg-brand-dark text-brand-cream pt-20 pb-10 overflow-hidden">
      {/* Absolute decorative glow */}
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-brand-blush/10 rounded-full blur-3xl pointer-events-none opacity-40" />

      <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-brand-cream/10 pb-16">
          
          {/* Column 1: Brand & Bio */}
          <div className="md:col-span-4 space-y-6 text-left">
            <div className="flex items-center gap-2">
              <Flower className="h-5 w-5 text-brand-blush" />
              <span className="font-serif text-2xl font-semibold tracking-wide text-white">
                Bloom & Petal
              </span>
            </div>
            <p className="text-xs md:text-sm text-brand-cream/70 font-sans font-light leading-relaxed max-w-xs">
              A flower studio creating fresh, thoughtful arrangements for homes, gifts, and celebrations.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="rounded-full bg-brand-cream/5 p-2.5 hover:bg-brand-burgundy hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="rounded-full bg-brand-cream/5 p-2.5 hover:bg-brand-burgundy hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="rounded-full bg-brand-cream/5 p-2.5 hover:bg-brand-burgundy hover:text-white transition-all duration-300"
                aria-label="Pinterest"
              >
                {/* Compass or custom floral asset for Pinterest styling */}
                <Compass className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="md:col-span-2 space-y-6 text-left">
            <h4 className="font-serif text-lg font-bold tracking-tight text-white">
              Studio Links
            </h4>
            <ul className="space-y-3 text-xs md:text-sm font-sans font-light text-brand-cream/75">
              <li>
                <a href="#hero" className="hover:text-brand-blush transition-colors">Home</a>
              </li>
              <li>
                <a href="#collections" className="hover:text-brand-blush transition-colors">Collections</a>
              </li>
              <li>
                <a href="#occasions" className="hover:text-brand-blush transition-colors">Occasions</a>
              </li>
              <li>
                <a href="#about" className="hover:text-brand-blush transition-colors">Our Approach</a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-brand-blush transition-colors">Guest Reviews</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Hours */}
          <div className="md:col-span-3 space-y-6 text-left">
            <h4 className="font-serif text-lg font-bold tracking-tight text-white">
              The Greenhouse
            </h4>
            <ul className="space-y-4 text-xs md:text-sm font-sans font-light text-brand-cream/75">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4.5 w-4.5 text-brand-sage shrink-0 mt-0.5" />
                <span>
                  142 Sterling Way,<br />
                  Historic Greenhouse District,<br />
                  Floral Valley, CA 90210
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4.5 w-4.5 text-brand-sage shrink-0" />
                <span>(555) 837-2526</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4.5 w-4.5 text-brand-sage shrink-0" />
                <span>curator@bloomandpetal.com</span>
              </li>
              <li className="flex items-start gap-2.5 pt-2 border-t border-brand-cream/5">
                <Clock className="h-4.5 w-4.5 text-brand-sage shrink-0 mt-0.5" />
                <span>
                  Mon — Fri: 9:00 AM – 6:00 PM<br />
                  Sat — Sun: 10:00 AM – 4:00 PM
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Elegant Map Blueprint Location Note */}
          <div className="md:col-span-3 space-y-4 text-left">
            <h4 className="font-serif text-lg font-bold tracking-tight text-white">
              Our Location
            </h4>
            <div className="relative rounded-xl overflow-hidden bg-brand-cream/5 border border-brand-cream/10 p-3 flex flex-col justify-between aspect-video group">
              {/* Styled Mock Blueprint Vector Map */}
              <div className="absolute inset-0 opacity-20 pointer-events-none p-1">
                <svg viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-brand-cream">
                  <line x1="10" y1="20" x2="190" y2="20" strokeDasharray="3,3" />
                  <line x1="10" y1="60" x2="190" y2="60" />
                  <line x1="50" y1="5" x2="50" y2="95" />
                  <line x1="130" y1="5" x2="130" y2="95" strokeDasharray="3,3" />
                  <rect x="70" y="30" width="40" height="30" rx="4" fill="currentColor" fillOpacity="0.1" />
                  <circle cx="90" cy="45" r="5" fill="currentColor" />
                </svg>
              </div>

              <div className="relative z-10 flex flex-col justify-between h-full">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-sage">
                  Historic Studio Campus
                </p>
                <div className="text-[10px] text-brand-cream/60 leading-tight">
                  <p className="font-semibold text-white">Garden Greenhouse No. 4</p>
                  <p className="mt-0.5">Complimentary driveway client parking available.</p>
                </div>
              </div>

              {/* External interactive map locator mock */}
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-3 bottom-3 rounded-full bg-brand-burgundy/80 text-white p-1.5 shadow-sm hover:bg-brand-sage hover:scale-105 transition-all"
                aria-label="Open maps"
              >
                <Compass className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Footer Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-brand-cream/50">
          <p>© {currentYear} Bloom & Petal. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="h-3 w-3 text-brand-blush" />
            <span>for Fine Living.</span>
          </div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-brand-cream hover:text-brand-blush transition-colors focus:outline-hidden"
          >
            <span>Back to Top</span>
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
