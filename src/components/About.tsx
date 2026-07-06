import React, { useEffect, useRef, useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface AboutProps {
  cms?: {
    aboutText?: string;
  };
}

export default function About({ cms }: AboutProps = {}) {
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSectionVisible(true);
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 bg-brand-cream overflow-hidden border-t border-brand-blush/20 scroll-mt-20"
    >
      {/* Decorative large geometric accent */}
      <div className="absolute -left-16 top-10 h-96 w-96 bg-brand-blush/30 opacity-40 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10 lg:px-12">
        <div className="grid items-start gap-8 md:gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <motion.div
            animate={isSectionVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-[560px] md:max-w-[640px] lg:max-w-none"
          >
            <div className="relative overflow-hidden rounded-[2.25rem] border border-brand-blush/30 bg-brand-cream shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&q=80&w=800"
                alt="Genevieve Vance handcrafting a custom floral bouquet"
                className="h-[24rem] w-full object-cover md:h-[30rem] lg:h-[34rem]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-brand-dark/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                <p className="max-w-md font-serif text-2xl font-light leading-tight md:text-3xl text-shadow">
                  “We don’t just arrange flowers; we study how they grow. That’s what makes our work feel so natural.”
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-blush/80">
                  Genevieve Vance · Founder
                </p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-8 text-left">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-brand-sage" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-sage">Our Approach</p>
              </div>
              <h2 className="font-serif text-4xl font-normal leading-tight tracking-tight text-brand-dark md:text-5xl">
                Inspired by the <br />
                <span className="italic text-brand-burgundy">Wild Beauty of Nature</span>
              </h2>
            </div>

            <div className="space-y-5 text-sm font-sans font-light leading-relaxed text-brand-dark/70 md:text-base whitespace-pre-line">
              <p>{cms?.aboutText}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 border-t border-brand-blush/30 pt-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0 rounded-full bg-brand-sage/20 p-1 text-brand-sage">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-semibold text-brand-dark">Ethical Sourcing</h4>
                  <p className="mt-0.5 text-xs leading-normal text-brand-dark/50">
                    We partner with local farms and responsible growers who prioritize sustainability.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0 rounded-full bg-brand-sage/20 p-1 text-brand-sage">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="font-serif text-base font-semibold text-brand-dark">Peak Freshness</h4>
                  <p className="mt-0.5 text-xs leading-normal text-brand-dark/50">
                    Our flowers are delivered at the perfect stage of bloom to ensure they last longer.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-brand-blush/40 bg-white/70 p-6 shadow-sm">
              <p className="text-sm font-light leading-relaxed text-brand-dark/80">
                "Our work is guided by texture, color, and movement. We focus on using unique and seasonal flowers that you won't find in a typical flower shop."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
