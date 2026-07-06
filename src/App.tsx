import React, { useRef, useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Collections from "./components/Collections";
import Occasions from "./components/Occasions";
import About from "./components/About";
import Testimonials from "./components/Testimonials";
import Gallery from "./components/Instagram";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import { useAuth } from "./context/AuthContext";

// Dynamic Views
import JournalView from "./components/JournalView";
import AccountView from "./components/AccountView";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [currentView, setCurrentView] = useState<string>(() => window.location.hash || "#home");
  const [isLoading, setIsLoading] = useState(true);
  const [cms, setCms] = useState({
    heroTitle: "",
    heroSubtitle: "",
    heroImage: "",
    seasonalAlert: "",
    aboutText: ""
  });

  // Watch hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || "#home";
      setCurrentView(hash);
      window.scrollTo(0, 0); // Scroll to top on view changes
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Fetch CMS settings
  useEffect(() => {
    const fetchCms = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/cms/homepage");
        if (res.ok) {
          const data = await res.json();
          setCms(data);
        }
      } catch (err) {
        console.error("CMS failed to load, using default settings", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCms();
  }, []);

  // Set up React Refs for primary landing sections
  const sectionRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    hero: useRef<HTMLDivElement>(null),
    collections: useRef<HTMLDivElement>(null),
    occasions: useRef<HTMLDivElement>(null),
    about: useRef<HTMLDivElement>(null),
    testimonials: useRef<HTMLDivElement>(null),
    gallery: useRef<HTMLDivElement>(null),
    footer: useRef<HTMLDivElement>(null),
  };

  // Safe ref-based scroll function with header offset compensation
  const handleNavClick = (sectionId: string) => {
    const ref = sectionRefs[sectionId];
    if (ref && ref.current) {
      const offset = 80; // height of sticky navbar
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // State for the custom cursor and its hover interaction
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [cursorHovered, setCursorHovered] = useState(false);
  const cursorPosRef = useRef({ x: -100, y: -100 });
  const cursorHoveredRef = useRef(false);

  useEffect(() => {
    let frameId = 0;

    const syncCursorState = () => {
      setMousePos(cursorPosRef.current);
      setCursorHovered(cursorHoveredRef.current);
    };

    const handleMouseMove = (e: MouseEvent) => {
      cursorPosRef.current = { x: e.clientX, y: e.clientY };

      if (!frameId) {
        frameId = window.requestAnimationFrame(() => {
          syncCursorState();
          frameId = 0;
        });
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.tagName === "INPUT" ||
        target.tagName === "SELECT" ||
        target.tagName === "TEXTAREA" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest("input, select, textarea") ||
        target.classList.contains("cursor-pointer");

      cursorHoveredRef.current = isInteractive;

      if (!frameId) {
        frameId = window.requestAnimationFrame(() => {
          syncCursorState();
          frameId = 0;
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-brand-cream text-brand-dark overflow-x-hidden selection:bg-brand-blush selection:text-brand-burgundy font-sans">
      
      {/* Custom cursor elements (hidden on mobile touch viewports and print layout) */}
      <div
        className="custom-cursor hidden md:block print:hidden"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          transform: `translate(-50%, -50%) scale(${cursorHovered ? 1.6 : 1})`,
          backgroundColor: cursorHovered ? "var(--color-brand-burgundy)" : "var(--color-brand-gold)",
        }}
      />
      <div
        className="custom-cursor-ring hidden md:block print:hidden"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          transform: `translate(-50%, -50%) scale(${cursorHovered ? 1.4 : 1})`,
          borderColor: cursorHovered ? "var(--color-brand-burgundy)" : "rgba(194, 164, 120, 0.4)",
        }}
      />

      {/* Seasonal Alert Ticker Banner */}
      {cms.seasonalAlert && currentView === "#home" && (
        <div className="bg-brand-burgundy text-white text-[9px] font-bold uppercase tracking-[0.2em] py-2 text-center relative z-50 overflow-hidden select-none print:hidden">
          <div className="inline-block animate-pulse">
            {cms.seasonalAlert}
          </div>
        </div>
      )}

      {/* Sticky Header */}
      <div className="print:hidden">
        <Navbar onNavClick={handleNavClick} />
      </div>

      {/* Dynamic Main Views Content */}
      <main>
        {isLoading && currentView === "#home" ? (
          <div className="fixed inset-0 flex items-center justify-center bg-brand-cream z-50">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 border-2 border-brand-dark/10 border-t-brand-sage rounded-full animate-spin" />
              <span className="font-serif text-brand-dark/60">Loading Studio...</span>
            </div>
          </div>
        ) : currentView === "#admin" ? (
          <AdminPanel />
        ) : currentView === "#journal" ? (
          <JournalView />
        ) : currentView === "#account" ? (
          <AccountView />
        ) : (
          /* Default Storefront (Home View) */
          <>
            <div ref={sectionRefs.hero}>
              <Hero
                cms={cms}
                onShopClick={() => handleNavClick("collections")}
                onAboutClick={() => handleNavClick("about")}
              />
            </div>
            <div ref={sectionRefs.collections}>
              <Collections />
            </div>
            <div ref={sectionRefs.occasions}>
              <Occasions
                onExploreClick={() => handleNavClick("collections")}
                onInquireClick={() => handleNavClick("footer")}
              />
            </div>
            <div ref={sectionRefs.about}>
              <About cms={cms} />
            </div>
            <div ref={sectionRefs.testimonials}>
              <Testimonials />
            </div>
            <div ref={sectionRefs.gallery}>
              <Gallery />
            </div>
            <Newsletter />
          </>
        )}
      </main>

      {/* Global Multi-Column Footer */}
      <div ref={sectionRefs.footer} className="print:hidden">
        <Footer />
      </div>

      {/* Side Shopping Drawer (hidden for admin accounts) */}
      <div className="print:hidden">
        {/* show cart only for non-admin users */}
        <CartDrawerWrapper />
      </div>

    </div>
  );
}

function CartDrawerWrapper() {
  const { user } = useAuth();
  if (user && user.role === "admin") return null;
  return <CartDrawer />;
}
