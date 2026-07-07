import React, { useState, useEffect, useRef } from "react";
import { TESTIMONIALS } from "../data";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      handleNext();
    }, 8000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [activeIndex]);

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const current = TESTIMONIALS[activeIndex];

  // Animation variants for the sliding transition
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <section
      id="testimonials"
      className="relative py-24 bg-brand-cream border-t border-brand-blush/20 overflow-hidden scroll-mt-10"
    >
      {/* Dynamic background shapes */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-blush/20 rounded-full blur-3xl pointer-events-none opacity-40 z-0" />

      <div className="mx-auto max-w-5xl px-6 md:px-12 relative z-10 text-center">
        
        {/* Header */}
        <div className="max-w-2xl mx-auto space-y-4 mb-0">
          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-6 bg-brand-sage" />
            <p className="text-[10px] font-bold tracking-widest text-brand-sage uppercase">What Our Clients Say</p>
            <span className="h-px w-6 bg-brand-sage" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light tracking-tight text-brand-dark">
            What <span className="text-brand-burgundy">Our Customers</span> Say
          </h2>
        </div>

        {/* Carousel View Container */}
        <div className="relative min-h-[360px] flex items-center justify-center">
          
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full max-w-3xl bg-white border border-brand-dark/5 p-8 md:p-14 shadow-xl flex flex-col md:flex-row items-center gap-8 md:gap-12 relative"
            >
              {/* Huge quote accent in background */}
              <Quote className="absolute top-6 right-8 h-20 w-20 text-brand-blush/20 pointer-events-none" />

              {/* Profile image with organic frame */}
              <div className="relative shrink-0">
                <img
                  key={current.id}
                  src={current.image}
                  alt={current.name}
                  referrerPolicy="no-referrer"
                  className="relative z-10 w-24 h-24 md:w-32 md:h-32 object-cover border border-brand-dark/5 shadow-md"
                />
              </div>

              {/* Quotes Content */}
              <div className="flex-1 text-left space-y-5">
                
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: current.rating }).map((_, i) => (
                    <Star key={i} className="h-4.5 w-4.5 fill-brand-gold text-brand-gold" />
                  ))}
                </div>

                {/* Quote */}
                <p className="font-serif text-lg md:text-xl font-light text-brand-dark/90 leading-relaxed">
                  "{current.quote}"
                </p>

                {/* Author Info */}
                <div className="pt-2 border-t border-brand-blush/20 flex justify-between items-center">
                  <div>
                    <h4 className="font-serif text-base font-bold text-brand-dark">{current.name}</h4>
                    <p className="text-xs text-brand-sage uppercase tracking-wider font-semibold mt-0.5">{current.role}</p>
                  </div>
                  <span className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest font-sans">
                    Happy Customer
                  </span>
                </div>

              </div>

            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls Absolute */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-2 md:-px-4 pointer-events-none z-20">
            <button
              onClick={handlePrev}
              className="pointer-events-auto h-11 w-11 rounded-full border border-brand-blush bg-white text-brand-dark shadow-sm hover:bg-brand-blush/20 hover:text-brand-burgundy transition-all duration-300 flex items-center justify-center focus:outline-hidden"
              aria-label="Previous sentiment"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="pointer-events-auto h-11 w-11 rounded-full border border-brand-blush bg-white text-brand-dark shadow-sm hover:bg-brand-blush/20 hover:text-brand-burgundy transition-all duration-300 flex items-center justify-center focus:outline-hidden"
              aria-label="Next sentiment"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > activeIndex ? 1 : -1);
                setActiveIndex(i);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 focus:outline-hidden ${
                activeIndex === i ? "w-8 bg-brand-burgundy" : "w-2.5 bg-brand-blush"
              }`}
              aria-label={`Slide to index ${i}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
