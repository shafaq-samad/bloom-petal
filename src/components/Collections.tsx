import React, { useState, useEffect, useRef } from "react";
import { PRODUCTS } from "../data";
import { Product } from "../types";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { Star, ShoppingBag, Heart, Sparkles, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Collections() {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Signature Bouquets", "Moody Elegance", "Classic White", "Bohemian Earth", "Seasonal Bloom"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setProducts(data);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to load products from API, falling back to local data:", err);
      }
      // Fallback
      setProducts(PRODUCTS.map(p => ({ ...p, stock: 15, lowStockThreshold: 5 })));
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  const getProductPrice = (product: any) => {
    const productId = product._id || product.id;
    const size = selectedSizes[productId] || "Classic";
    let modifier = 0;
    if (size === "Deluxe") modifier = 30;
    if (size === "Grandeur") modifier = 65;
    return product.price + modifier;
  };

  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  // Custom staggered sizing layout class names for a high-fashion portfolio grid
  const getCardLayoutClass = (index: number) => {
    switch (index % 6) {
      case 0:
        return "md:col-span-1 md:translate-y-0";
      case 1:
        return "md:col-span-1 md:translate-y-16";
      case 2:
        return "md:col-span-1 md:translate-y-8";
      case 3:
        return "md:col-span-2 lg:col-span-2 md:translate-y-4";
      case 4:
        return "md:col-span-1 md:translate-y-20";
      case 5:
        return "md:col-span-1 md:translate-y-0";
      default:
        return "";
    }
  };

  return (
    <section
      id="collections"
      ref={sectionRef}
      className="relative py-32 bg-brand-cream border-t border-brand-dark/5 scroll-mt-20 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-left max-w-3xl space-y-4 mb-20">
          <motion.div
            animate={isSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2"
          >
            <span className="h-px w-8 bg-brand-gold" />
            <span className="text-[10px] font-bold tracking-[0.25em] text-brand-sage uppercase font-sans">
              Our Designs
            </span>
          </motion.div>

          <motion.h2
            animate={isSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-5xl md:text-6xl font-semibold tracking-tight text-brand-dark"
            >
            Fresh flowers made <span className="text-brand-burgundy">easy to love</span>
          </motion.h2>

          <motion.p
            animate={isSectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-brand-dark/70 text-base max-w-xl leading-relaxed"
            >
            Choose from simple bouquets, thoughtful gifts, and event flowers designed to feel beautiful, personal, and easy to order.
          </motion.p>
        </div>

        {/* Swipeable Category Filters Row */}
        <div className="w-full overflow-x-auto scrollbar-none mb-24 -mx-6 px-6 md:mx-0 md:px-0">
          <div className="flex whitespace-nowrap gap-3 md:justify-start min-w-max pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-none px-6 py-3 text-[10px] font-bold uppercase tracking-widest transition-all duration-300 focus:outline-none border ${
                  selectedCategory === category
                    ? "bg-brand-dark border-brand-dark text-white shadow-sm"
                    : "bg-white border-brand-dark/5 text-brand-dark/70 hover:border-brand-dark hover:text-brand-dark"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="h-6 w-6 border border-brand-dark/20 border-t-brand-sage rounded-full animate-spin" />
          </div>
        ) : (
          /* Staggered Asymmetric Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-28">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => {
                const productId = product._id || product.id;
                const selectedSize = selectedSizes[productId] || "Classic";
                const displayedPrice = getProductPrice(product);
                const isFavorite = favorites.includes(productId);
                const layoutClass = getCardLayoutClass(index);
                const isWideCard = index % 6 === 3;
                const isSoldOut = product.stock === 0;
                const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 5);

                return (
                  <motion.div
                    key={productId}
                    layout
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                    className={`group bg-transparent overflow-hidden flex flex-col h-full ${layoutClass} ${isSoldOut ? 'opacity-75' : ''}`}
                  >
                    {/* Image & Wishlist */}
                    <div className={`relative overflow-hidden bg-brand-cream border border-brand-dark/5 shadow-xs shrink-0 ${isWideCard ? 'aspect-[16/10]' : 'aspect-[3/4]'}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className={`w-full h-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.03] ${isSoldOut ? 'grayscale' : ''}`}
                      />

                      {/* Gradient Screen */}
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-750" />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                        {isSoldOut ? (
                          <span className="flex items-center gap-1 bg-brand-dark text-[8px] font-bold uppercase tracking-widest text-white px-3 py-1 shadow-xs border border-white/10">
                            Sold Out
                          </span>
                        ) : isLowStock ? (
                          <span className="flex items-center gap-1 bg-brand-gold text-[8px] font-bold uppercase tracking-widest text-white px-3 py-1 shadow-xs">
                            <AlertTriangle className="h-2.5 w-2.5" />
                            Only {product.stock} left
                          </span>
                        ) : product.isBestseller ? (
                          <span className="flex items-center gap-1 bg-brand-burgundy text-[8px] font-bold uppercase tracking-widest text-white px-3 py-1 shadow-xs">
                            <Sparkles className="h-2.5 w-2.5" />
                            Reserve Work
                          </span>
                        ) : null}
                        <span className="bg-white/90 backdrop-blur-xs text-brand-dark text-[8px] font-bold uppercase tracking-widest px-3 py-1 border border-brand-dark/5 shadow-xs">
                          {product.category}
                        </span>
                      </div>

                      {/* Quick wishlist */}
                      <button
                        onClick={() => toggleFavorite(productId)}
                        className={`absolute top-4 right-4 rounded-full p-2.5 bg-white/80 backdrop-blur-xs shadow-xs transition-all duration-300 focus:outline-none ${
                          isFavorite
                            ? "bg-red-50 text-red-600 border border-red-100"
                            : "border border-brand-dark/5 text-brand-dark/80 hover:bg-white hover:text-red-500"
                        }`}
                        aria-label="Wishlist Bouquet"
                      >
                        <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-600 text-red-600" : ""}`} />
                      </button>
                    </div>

                    {/* Body Information */}
                    <div className="pt-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="font-serif text-2xl font-semibold tracking-tight text-brand-dark group-hover:text-brand-burgundy transition-colors duration-300">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-1 bg-brand-gold/10 px-2.5 py-1 shrink-0">
                            <Star className="h-3 w-3 fill-brand-gold text-brand-gold" />
                            <span className="text-[10px] font-bold text-brand-dark">{product.rating}</span>
                          </div>
                        </div>

                        <p className="text-xs text-brand-dark/70 mt-3 leading-relaxed font-light">
                          {product.description}
                        </p>

                        {/* Size Selector Grid */}
                        <div className="mt-6 pt-4 border-t border-brand-dark/5">
                          <p className="text-[9px] font-bold tracking-widest text-brand-dark/40 uppercase mb-2.5">
                            Size Option:
                          </p>
                          <div className="grid grid-cols-3 gap-2 bg-brand-blush/25 p-1 border border-brand-dark/5">
                            {(product.sizeOptions || ["Classic", "Deluxe", "Grandeur"]).map((sz: string) => (
                              <button
                                key={sz}
                                onClick={() => handleSizeChange(productId, sz)}
                                className={`py-2 text-[9px] font-bold uppercase tracking-widest transition-all duration-300 focus:outline-none ${
                                  selectedSize === sz
                                    ? "bg-white text-brand-burgundy shadow-xs border border-brand-dark/5"
                                    : "text-brand-dark/50 hover:text-brand-burgundy hover:bg-white/40"
                                }`}
                              >
                                {sz}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Bottom Pricing & Checkout trigger */}
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-brand-dark/5">
                        <div>
                          <p className="text-[8px] font-bold uppercase tracking-widest text-brand-dark/40">Price</p>
                          <span className="font-serif text-2xl font-light text-brand-burgundy">
                            ${displayedPrice}
                          </span>
                        </div>

                        {isSoldOut ? (
                          <button
                            disabled
                            className="flex items-center gap-2 rounded-none bg-brand-dark/20 text-brand-dark/40 px-6 py-3.5 text-[9px] font-bold uppercase tracking-widest transition-all cursor-not-allowed border border-brand-dark/5"
                          >
                            Sold Out
                          </button>
                        ) : (
                          user && user.role === "admin" ? (
                            <button
                              disabled
                              className="flex items-center gap-2 rounded-none bg-brand-dark/20 text-brand-dark/40 px-6 py-3.5 text-[9px] font-bold uppercase tracking-widest transition-all cursor-not-allowed border border-brand-dark/5"
                            >
                              <ShoppingBag className="h-3.5 w-3.5" />
                              Not Available
                            </button>
                          ) : (
                            <button
                              onClick={() => addToCart(product, selectedSize)}
                              className="flex items-center gap-2 rounded-none bg-brand-dark hover:bg-brand-sage px-6 py-3.5 text-[9px] font-bold uppercase tracking-widest text-white transition-all duration-300 shadow-sm"
                            >
                              <ShoppingBag className="h-3.5 w-3.5" />
                              Add to Cart
                            </button>
                          )
                        )}
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </div>
    </section>
  );
}
