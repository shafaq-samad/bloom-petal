import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Menu, X, ShoppingBag, Flower, User, Settings } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NavbarProps {
  onNavClick: (id: string) => void;
}

export default function Navbar({ onNavClick }: NavbarProps) {
  const { toggleCart, cartCount } = useCart();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (id: string) => {
    window.location.hash = "#home";
    setTimeout(() => {
      onNavClick(id);
    }, 100);
  };

  const navLinks = [
    { name: "Home", id: "hero", action: () => handleLinkClick("hero") },
    { name: "Shop", id: "collections", action: () => handleLinkClick("collections") },
    { name: "Occasions", id: "occasions", action: () => handleLinkClick("occasions") },
    { name: "About", id: "about", action: () => handleLinkClick("about") },
    { name: "Journal", id: "journal", action: () => { window.location.hash = "#journal"; } },
    { name: "Account", id: "account", action: () => { window.location.hash = "#account"; } },
  ];

  return (
    <>
      <header
        id="app-header"
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-700 ${
          isScrolled
            ? "bg-brand-cream/90 backdrop-blur-md border-b border-brand-dark/5 py-4 shadow-xs"
            : "bg-transparent py-6"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => { window.location.hash = "#home"; handleLinkClick("hero"); }}
              className="group flex items-center gap-2 text-left focus:outline-none"
              aria-label="Bloom & Petal Home"
            >
              <Flower className="h-5 w-5 text-brand-burgundy transition-transform duration-[1.2s] group-hover:rotate-180" />
              <span className="font-serif text-2xl font-light tracking-wide text-brand-burgundy">
                Bloom & Petal
              </span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Desktop menu">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={link.action}
                  className="relative text-[10px] font-bold uppercase tracking-widest text-brand-dark/70 hover:text-brand-burgundy transition-colors duration-300 py-1 group focus:outline-none"
                >
                  {link.name}
                  <span className="absolute left-0 bottom-0 w-0 h-px bg-brand-gold transition-all duration-300 group-hover:w-full" />
                </button>
              ))}

              {/* Admin Dashboard shortcut */}
              {user && user.role === "admin" && (
                <button
                  onClick={() => { window.location.hash = "#admin"; }}
                  className="relative text-[10px] font-bold uppercase tracking-widest text-brand-sage hover:text-brand-burgundy transition-colors duration-300 py-1 group focus:outline-none flex items-center gap-1"
                >
                  <Settings className="h-3 w-3" />
                  Admin Panel
                  <span className="absolute left-0 bottom-0 w-0 h-px bg-brand-gold transition-all duration-300 group-hover:w-full" />
                </button>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Account icon quick redirect */}
              <button
                onClick={() => { window.location.hash = "#account"; }}
                className="hidden md:flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-brand-dark/70 hover:text-brand-burgundy transition-colors focus:outline-none bg-white/50 border border-brand-dark/5 p-2"
                aria-label="Open Account"
              >
                <User className="h-3.5 w-3.5" />
                {user ? user.name.split(" ")[0] : "Sign In"}
              </button>

              {/* Shopping Bag Button */}
              <button
                id="navbar-cart-btn"
                onClick={toggleCart}
                className="relative rounded-none p-2.5 bg-white border border-brand-dark/5 text-brand-dark hover:border-brand-dark transition-all duration-300 shadow-xs focus:outline-none"
                aria-label="Open Cart Bag"
              >
                <ShoppingBag className="h-4.5 w-4.5 text-brand-dark/90" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-brand-burgundy text-[8px] font-bold text-white shadow-sm"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Mobile Menu Toggle */}
              <button
                id="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="rounded-none bg-white p-2.5 border border-brand-dark/5 text-brand-dark shadow-xs hover:border-brand-dark md:hidden focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              id="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-brand-dark/20 backdrop-blur-xs md:hidden"
            />

            {/* Panel */}
            <motion.div
              id="mobile-menu-panel"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 220 }}
              className="fixed left-0 top-0 bottom-0 z-50 flex h-full w-4/5 max-w-sm flex-col bg-brand-cream p-8 shadow-2xl md:hidden border-r border-brand-dark/5"
            >
              <div className="flex items-center justify-between border-b border-brand-dark/5 pb-6 mb-8">
                <div className="flex items-center gap-2">
                  <Flower className="h-5 w-5 text-brand-burgundy" />
                  <span className="font-serif text-xl font-light text-brand-burgundy">
                    Bloom & Petal
                  </span>
                </div>
                <button
                  id="close-mobile-menu"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-none p-1.5 text-brand-dark/50 hover:text-brand-dark focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-5 overflow-y-auto" aria-label="Mobile menu">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      link.action();
                    }}
                    className="text-left font-serif text-2xl font-light tracking-tight text-brand-dark hover:text-brand-burgundy transition-colors py-1 border-b border-brand-dark/5"
                  >
                    {link.name}
                  </button>
                ))}

                {/* Mobile Admin panel */}
                {user && user.role === "admin" && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      window.location.hash = "#admin";
                    }}
                    className="text-left font-serif text-2xl font-light tracking-tight text-brand-sage hover:text-brand-burgundy transition-colors py-1 border-b border-brand-dark/5"
                  >
                    Admin Panel
                  </button>
                )}
              </nav>

              <div className="mt-auto pt-8 border-t border-brand-dark/5">
                <p className="text-[10px] text-brand-dark/50 leading-relaxed font-sans uppercase tracking-widest">
                  © 2026 Bloom & Petal.<br />
                  Spatial Botany Studio.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
