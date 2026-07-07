import React, { useMemo } from "react";
import { motion } from "motion/react";
import { ArrowDown, Sparkles } from "lucide-react";

interface HeroProps {
  onShopClick?: () => void;
  onAboutClick?: () => void;
}

export default function Hero({ onShopClick, onAboutClick }: HeroProps) {
  const heroTitle = (
    <>
      <span className="block">Fresh flowers</span>
      <span className="block font-body-serif font-normal text-brand-burgundy">made easy</span>
    </>
  );
  const heroSubtitle = "Beautiful bouquets, hand-picked blooms, and fast delivery so gifting feels effortless.";
  const heroImage = "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&q=80&w=1600";
  // Ultra-fine gold dust particles drifting upwards slowly
  const particles = useMemo(
    () =>
      Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        size: Math.random() * 3 + 2, // 2px to 5px
        xStart: Math.random() * 100,
        yStart: 100 + Math.random() * 20,
        duration: Math.random() * 25 + 20,
        delay: Math.random() * -20,
        drift: Math.random() * 40 - 20,
        opacity: Math.random() * 0.3 + 0.15,
      })),
    []
  );

  return (
    <section
      id="hero"
      className="relative min-h-screen bg-brand-cream overflow-hidden flex items-center justify-center"
    >
      {/* Floating Gold Dust Backdrop */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              x: `${p.xStart}vw`,
              y: `${p.yStart}vh`,
              opacity: p.opacity,
              scale: 0.8,
            }}
            animate={{
              y: "-10vh",
              x: [
                `${p.xStart}vw`,
                `${p.xStart + p.drift / 4}vw`,
                `${p.xStart - p.drift / 2}vw`,
                `${p.xStart}vw`,
              ],
              opacity: [p.opacity, p.opacity * 1.2, p.opacity * 0.5, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              width: p.size,
              height: p.size,
            }}
            className="absolute rounded-full bg-brand-gold"
          />
        ))}
      </div>

      {/* Main Content Container */}
      <div className="relative z-20 w-full max-w-7xl px-6 md:px-12 py-28 lg:py-0 flex items-center min-h-screen">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
          
          {/* Text Content Column */}
          <div className="relative space-y-10 text-left lg:pt-16">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
              className="inline-flex items-center gap-2 border-b border-brand-dark/10 pb-2"
            >
            </motion.div>

            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-serif font-normal leading-tight tracking-tight text-brand-dark">
                {heroTitle}
              </h1>

              <p className="max-w-xl text-sm sm:text-base font-body-serif font-light leading-relaxed text-brand-dark/80 pt-2">
                {heroSubtitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                id="hero-shop-now-btn"
                type="button"
                onClick={onShopClick}
                aria-label="Shop flowers now"
                className="group relative overflow-hidden rounded-none border border-brand-dark bg-brand-dark px-8 py-4 text-center text-xs font-bold uppercase tracking-widest text-white transition-all duration-500 hover:text-brand-dark"
              >
                <span className="absolute inset-0 bg-brand-cream transition-transform duration-500 origin-left scale-x-0 group-hover:scale-x-100" />
                <span className="relative z-10">Shop Flowers</span>
              </button>
              <button
                id="hero-about-us-btn"
                type="button"
                onClick={onAboutClick}
                aria-label="Learn about our story"
                className="group relative overflow-hidden rounded-none border border-brand-dark/20 px-8 py-4 text-center text-xs font-bold uppercase tracking-widest text-brand-dark transition-all duration-500 hover:border-brand-dark"
              >
                <span className="absolute inset-0 bg-brand-blush transition-transform duration-500 origin-left scale-x-0 group-hover:scale-x-100" />
                <span className="relative z-10">Our Story</span>
              </button>
            </div>

            {/* Micro stats banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-brand-dark/5 max-w-xl">
              <div className="rounded-none border border-brand-dark/10 bg-white p-4 text-sm text-brand-dark">
                <strong className="block text-brand-dark font-semibold">Sustainably sourced</strong>
                Thoughtfully chosen blooms from trusted growers.
              </div>
              <div className="rounded-none border border-brand-dark/10 bg-white p-4 text-sm text-brand-dark">
                <strong className="block text-brand-dark font-semibold">Carefully designed</strong>
                Every bouquet is arranged to feel effortless and elegant.
              </div>
              <div className="rounded-none border border-brand-dark/10 bg-white p-4 text-sm text-brand-dark">
                <strong className="block text-brand-dark font-semibold">Fresh delivery</strong>
                Fast shipping for the happiest arrivals.
              </div>
            </div>
          </div>

          {/* Asymmetric Overlapping Image Collage Column */}
          <div className="relative flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
              className="relative w-full max-w-[760px] lg:max-w-[860px]"
            >
              {/* Primary Image Frame */}
              <div className="editorial-frame aspect-[5/6] overflow-hidden shadow-2xl relative min-h-[520px] md:min-h-[640px]">
                <motion.img
                  src={heroImage}
                  alt="A bright bouquet of fresh flowers"
                  loading="eager"
                  className="h-full w-full object-cover"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/20 to-transparent" />
              </div>

              {/* Overlapping Secondary Image Frame */}
              <motion.div
                initial={{ opacity: 0, x: -30, y: 30 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
                className="absolute -left-16 -bottom-14 w-56 sm:w-64 aspect-[3/4] overflow-hidden bg-white p-2 border border-brand-dark/5 shadow-xl hidden sm:block"
              >
                <img
                  src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=600"
                  alt="Detail of floral cut"
                  className="h-full w-full object-cover"
                />
              </motion.div>

              {/* Decorative Frame Line */}
              <div className="absolute -right-6 -top-6 w-full h-full border border-brand-gold/30 pointer-events-none -z-10 translate-x-3 translate-y-3 hidden sm:block" />
            </motion.div>
          </div>

        </div>
      </div>

      {/* Down arrow indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <motion.button
          onClick={onShopClick}
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="rounded-full border border-brand-dark/10 bg-white p-3 text-brand-dark shadow-sm hover:border-brand-dark hover:text-brand-burgundy transition-all duration-300"
          aria-label="Scroll down to our collections"
        >
          <ArrowDown className="h-4 w-4" />
        </motion.button>
      </div>
    </section>
  );
}
