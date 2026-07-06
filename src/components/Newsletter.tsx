import React, { useState } from "react";
import { Mail, Sparkles, Check, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }
    setIsSubscribed(true);
  };

  return (
    <section id="newsletter" className="relative py-20 bg-brand-cream overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
        
        {/* Soft, blushing backdrop container */}
        <div className="relative rounded-3xl bg-gradient-to-br from-brand-blush/40 via-brand-cream to-brand-blush/35 p-8 md:p-16 border border-brand-blush/40 shadow-xl overflow-hidden">
          
          {/* Subtle floral shapes behind */}
          <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-brand-sage/5 filter blur-xl pointer-events-none" />
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-brand-gold/10 filter blur-xl pointer-events-none" />

          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            <AnimatePresence mode="wait">
              {!isSubscribed ? (
                <motion.div
                  key="signup-form-panel"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-center items-center gap-2">
                    <Sparkles className="h-4 w-4 text-brand-gold animate-spin-slow" />
                    <span className="text-[10px] font-bold tracking-widest text-brand-burgundy uppercase">
                      The Bloom Club
                    </span>
                    <Sparkles className="h-4 w-4 text-brand-gold animate-spin-slow" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-serif text-3xl md:text-4xl font-light tracking-tight text-brand-dark">
                      Join Our Botanical <span className="italic text-brand-burgundy">Inner Circle</span>
                    </h3>
                    <p className="text-sm md:text-base text-brand-dark/70 font-sans font-light max-w-xl mx-auto leading-relaxed">
                      Receive early invitations to our seasonal floral design masterclasses, private studio vault launches, and bespoke care guides. No spam, only beauty.
                    </p>
                  </div>

                  {/* Form */}
                  <form
                    id="newsletter-form"
                    onSubmit={handleSubmit}
                    className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto bg-white p-2 rounded-2xl sm:rounded-full border border-brand-blush shadow-xs"
                  >
                    <div className="flex items-center gap-2 w-full px-3 py-1 bg-transparent">
                      <Mail className="h-4 w-4 text-brand-sage shrink-0" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email to bloom..."
                        className="w-full bg-transparent text-sm text-brand-dark focus:outline-hidden placeholder-brand-dark/40 font-sans"
                        aria-label="Your email"
                      />
                    </div>
                    <button
                      id="newsletter-submit-btn"
                      type="submit"
                      className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl sm:rounded-full bg-brand-burgundy hover:bg-brand-sage px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 shrink-0 focus:outline-hidden shadow-xs"
                    >
                      <span>Join</span>
                      <Send className="h-3 w-3" />
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success-signup-panel"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-brand-sage/20 text-brand-sage mb-2">
                    <Check className="h-8 w-8" />
                  </div>
                  <h3 className="font-serif text-3xl font-light tracking-tight text-brand-dark">
                    Welcome to the Studio
                  </h3>
                  <p className="text-sm text-brand-dark/70 font-sans max-w-md mx-auto leading-relaxed">
                    Thank you. We have saved <strong>{email}</strong> onto our guest list. Expect your first digital journal issue along with a <strong>10% welcome reserve code</strong> in your inbox shortly.
                  </p>
                  <button
                    id="reset-newsletter-btn"
                    onClick={() => {
                      setEmail("");
                      setIsSubscribed(false);
                    }}
                    className="text-[10px] font-bold uppercase tracking-widest text-brand-burgundy hover:text-brand-sage transition-colors focus:outline-hidden"
                  >
                    Subscribe another guest
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

      </div>
    </section>
  );
}
