import React, { useState } from "react";
import { INSTAGRAM_GALLERY } from "../data";
import { Instagram, Heart, MessageCircle, X, ExternalLink, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Gallery() {
  const [lightboxImageId, setLightboxImageId] = useState<string | null>(null);
  const [likes, setLikes] = useState<Record<string, { count: number; liked: boolean }>>({
    "ig-1": { count: 184, liked: false },
    "ig-2": { count: 342, liked: false },
    "ig-3": { count: 215, liked: false },
    "ig-4": { count: 156, liked: false },
    "ig-5": { count: 428, liked: false },
    "ig-6": { count: 297, liked: false },
  });

  const handleLikeToggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening lightbox
    setLikes((prev) => {
      const current = prev[id] || { count: 100, liked: false };
      return {
        ...prev,
        [id]: {
          count: current.liked ? current.count - 1 : current.count + 1,
          liked: !current.liked,
        },
      };
    });
  };

  const selectedImage = INSTAGRAM_GALLERY.find((item) => item.id === lightboxImageId);

  return (
    <section
      id="gallery"
      className="relative py-24 bg-brand-cream border-t border-brand-blush/20 scroll-mt-20"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <div className="flex items-center justify-center gap-2">
            <Instagram className="h-4 w-4 text-brand-sage" />
            <p className="text-[10px] font-bold tracking-widest text-brand-sage uppercase">From The Studio</p>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light tracking-tight text-brand-dark">
            Follow Along on <span className="italic text-brand-burgundy font-normal">Instagram</span>
          </h2>
          <p className="text-brand-dark/60 text-sm font-sans max-w-lg mx-auto">
            A behind-the-scenes look at new arrivals, ongoing projects, and life at the studio. Follow us at <span className="font-semibold text-brand-burgundy">@bloomandpetal</span>.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {INSTAGRAM_GALLERY.map((item, index) => {
            const itemLikes = likes[item.id] || { count: 120, liked: false };
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                onClick={() => setLightboxImageId(item.id)}
                className="group relative aspect-square rounded-2xl overflow-hidden border border-brand-blush/20 bg-brand-cream cursor-pointer shadow-xs hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={item.url}
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Rich Glass Hover Overlay */}
                <div className="absolute inset-0 bg-brand-burgundy/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 md:p-6 text-white select-none">
                  {/* Top: Insta Icon / Zoom indicator */}
                  <div className="flex justify-between items-center w-full">
                    <Instagram className="h-4 w-4 text-brand-blush" />
                    <ZoomIn className="h-4 w-4 text-brand-blush opacity-60" />
                  </div>

                  {/* Mid: Caption snippet */}
                  <p className="text-xs md:text-sm font-light leading-relaxed line-clamp-3 text-brand-cream/95 my-auto">
                    {item.caption}
                  </p>

                  {/* Bottom: Hearts count and comments */}
                  <div className="flex items-center gap-4 text-xs font-semibold pt-2 border-t border-brand-blush/20">
                    <button
                      onClick={(e) => handleLikeToggle(item.id, e)}
                      className={`flex items-center gap-1 hover:text-red-400 transition-colors focus:outline-hidden ${
                        itemLikes.liked ? "text-red-400" : "text-brand-blush"
                      }`}
                      aria-label="Like photo"
                    >
                      <Heart className={`h-4 w-4 ${itemLikes.liked ? "fill-red-400 text-red-400" : ""}`} />
                      <span>{itemLikes.count}</span>
                    </button>
                    <div className="flex items-center gap-1 text-brand-blush">
                      <MessageCircle className="h-4 w-4" />
                      <span>{Math.floor(itemLikes.count / 8)}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Center alignment Instagram CTA */}
        <div className="mt-12 text-center">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-brand-burgundy/20 bg-white hover:bg-brand-burgundy/5 px-6 py-3 text-xs font-bold uppercase tracking-widest text-brand-burgundy transition-all duration-300 focus:outline-hidden"
          >
            <Instagram className="h-4 w-4" />
            Connect at @bloomandpetal
            <ExternalLink className="h-3 w-3 opacity-60" />
          </a>
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div
            id="lightbox-container"
            className="fixed inset-0 z-50 overflow-y-auto bg-brand-dark/90 p-3 sm:p-4 backdrop-blur-md"
            onClick={() => setLightboxImageId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()} // don't close modal on content click
              className="relative mx-auto flex w-full max-w-4xl max-h-[100dvh] overflow-hidden rounded-[2rem] border border-brand-blush/40 bg-brand-cream shadow-2xl md:max-h-[90dvh]"
            >
              {/* Close Button absolute */}
              <button
                onClick={() => setLightboxImageId(null)}
                className="absolute top-3 right-3 z-30 rounded-full bg-brand-dark/80 text-white p-2.5 shadow-sm hover:bg-brand-burgundy hover:scale-105 transition-all focus:outline-none"
                aria-label="Close Lightbox"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Photo Area */}
              <div className="flex min-h-0 items-center justify-center overflow-hidden bg-black md:w-7/12">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.caption}
                  className="h-full max-h-[calc(100dvh-2rem)] w-full object-contain md:object-cover"
                />
              </div>

              {/* Text Interaction Panel */}
              <div className="flex min-h-0 flex-col overflow-y-auto bg-white p-6 md:w-5/12 md:p-8">
                
                {/* Header */}
                <div className="space-y-4 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-brand-blush p-2 text-brand-burgundy shrink-0">
                      <Instagram className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-serif text-base font-bold text-brand-dark">bloomandpetal</h4>
                      <p className="text-[10px] font-semibold text-brand-sage uppercase tracking-widest">Floral Studio</p>
                    </div>
                  </div>

                  <p className="font-sans font-light text-brand-dark/80 text-sm md:text-base leading-relaxed">
                    {selectedImage.caption}
                  </p>

                  <p className="text-[11px] font-bold text-brand-burgundy tracking-wide">
                    #bloomandpetal #flowerinstallations #slowbloom #studiojournal #seasonalflowers
                  </p>
                </div>

                {/* Interaction Footer */}
                <div className="mt-auto border-t border-brand-blush/30 pt-4 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={(e) => handleLikeToggle(selectedImage.id, e)}
                      className={`flex items-center gap-1.5 text-sm font-bold tracking-wide focus:outline-hidden ${
                        likes[selectedImage.id]?.liked ? "text-red-500" : "text-brand-dark/60 hover:text-red-500"
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${likes[selectedImage.id]?.liked ? "fill-red-500 text-red-500" : ""}`} />
                      <span>{likes[selectedImage.id]?.count} Likes</span>
                    </button>
                    
                    <span className="text-xs text-brand-dark/40 font-semibold uppercase tracking-wider font-sans">
                      Posted July 2026
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
