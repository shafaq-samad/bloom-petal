import React, { useEffect, useRef, useState } from "react";
import { OCCASIONS } from "../data";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface OccasionsProps {
  onExploreClick?: () => void;
  onInquireClick?: () => void;
}

export default function Occasions({ onExploreClick, onInquireClick }: OccasionsProps) {
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSectionVisible(true);
        }
      },
      { threshold: 0.05 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="occasions"
      ref={sectionRef}
      className="relative py-20 bg-brand-cream border-t border-brand-dark/5 scroll-mt-20 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl text-left space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-brand-gold" />
              <p className="text-[10px] font-bold tracking-[0.25em] text-brand-sage uppercase font-sans">
                Flower Art for Every Event
              </p>
            </div>
            <h2 className="font-serif text-5xl md:text-6xl font-semibold tracking-tight text-brand-dark">
              Flowers for <span className="text-brand-burgundy">everyday life and special events</span>
            </h2>
            <p className="text-brand-dark/70 text-base max-w-lg leading-relaxed">
              From simple home styling to large celebrations, we create arrangements that feel calm, beautiful, and easy to enjoy.
            </p>
          </div>
          
          {/* Navigation and Browse Row */}
          <div className="flex items-center gap-6 self-start md:self-end">
            <button
              onClick={onExploreClick}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-burgundy hover:text-brand-sage transition-colors focus:outline-none group shrink-0"
            >
              Browse Catalog
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
            </button>

            {/* Desktop Carousel controls */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => handleScroll("left")}
                className="h-10 w-10 rounded-none border border-brand-dark/10 hover:border-brand-dark transition-all duration-300 flex items-center justify-center bg-white text-brand-dark focus:outline-none"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleScroll("right")}
                className="h-10 w-10 rounded-none border border-brand-dark/10 hover:border-brand-dark transition-all duration-300 flex items-center justify-center bg-white text-brand-dark focus:outline-none"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Occasion Cards Gallery */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-6 md:-mx-12 px-6 md:px-12 py-4 gap-8 scroll-smooth"
        >
          {OCCASIONS.map((occasion, index) => (
            <motion.div
              key={occasion.id}
              animate={isSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 1, 0.5, 1] }}
              className="group relative w-[85%] sm:w-[60%] md:w-[45%] lg:w-[31%] shrink-0 snap-start aspect-[3/4] overflow-hidden bg-brand-cream border border-brand-dark/5 shadow-md cursor-pointer"
              onClick={onExploreClick}
            >
              <img
                src={occasion.image}
                alt={occasion.name}
                className="w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/30 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <h3 className="font-serif text-3xl lg:text-4xl font-light tracking-tight leading-none text-brand-cream">
                  {occasion.name}
                </h3>
                <p className="mt-3 text-xs text-brand-cream/80 font-light leading-relaxed line-clamp-2">
                  {occasion.description}
                </p>
                <div className="mt-5 flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-brand-gold group-hover:text-white transition-colors duration-300">
                  <span>Learn More</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic callout banner */}
        <motion.div
          animate={isSectionVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 bg-white border border-brand-dark/5 p-8 md:p-14 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative overflow-hidden"
        >
          {/* Subtle logo silhouette in background */}
          <div className="absolute right-0 bottom-0 w-44 h-44 opacity-5 text-brand-sage pointer-events-none translate-x-12 translate-y-12">
            <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
              <path d="M50 15c-3.1 0-5.7 2.6-5.7 5.7 0 2.2 1.3 4.1 3.1 5l-4.5 13.5C39.4 40.4 35 45 35 50c0 3.1 2.6 5.7 5.7 5.7s5.7-2.6 5.7-5.7c0-2.2-1.3-4.1-3.1-5l4.5-13.5C51.6 30.6 56 26 56 21c0-3.1-2.6-5.7-5.7-5.7z" />
            </svg>
          </div>

          <div className="md:col-span-8 space-y-4 text-left relative z-10">
              <span className="inline-flex items-center gap-1.5 bg-brand-gold/15 px-3 py-1 text-[8px] font-bold tracking-[0.2em] text-brand-burgundy uppercase font-sans">
                <Sparkles className="h-2.5 w-2.5 text-brand-gold animate-pulse" /> Custom flower projects
              </span>
            <h3 className="font-serif text-3xl font-semibold text-brand-dark leading-tight">
              Planning a wedding, dinner, or large display?
            </h3>
            <p className="text-sm text-brand-dark/70 font-light leading-relaxed max-w-xl">
              Our team can help create elegant flower installs for events, tables, and spaces that need a warm, polished look.
            </p>
          </div>

          <div className="md:col-span-4 flex md:justify-end relative z-10">
            <button
              onClick={onInquireClick}
              className="group relative overflow-hidden rounded-none border border-brand-dark bg-brand-dark px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-white transition-all duration-500 hover:text-brand-dark"
            >
              <span className="absolute inset-0 bg-brand-cream transition-transform duration-500 origin-left scale-x-0 group-hover:scale-x-100" />
              <span className="relative z-10">Ask About Events</span>
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
