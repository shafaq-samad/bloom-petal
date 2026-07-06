import React, { useState, useEffect } from "react";
import { api } from "../lib/api";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, BookOpen, Clock, User, Calendar } from "lucide-react";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  image: string;
  publishedAt: string;
}

export default function JournalView() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(api("/api/blog"));
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (err) {
        console.error("Error fetching journal entries:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-brand-cream pt-32 pb-24 text-brand-dark px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {!selectedPost ? (
            <motion.div
              key="list-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header */}
              <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
                <span className="text-[10px] font-bold tracking-[0.25em] text-brand-sage uppercase font-sans">
                  The Botanical Journal
                </span>
                <h1 className="font-serif text-5xl md:text-6xl font-light tracking-tight text-brand-dark">
                  Stories & Flora Care
                </h1>
                <p className="font-body-serif text-lg italic text-brand-dark/60">
                  Documenting seasonal studies, spatial design aesthetics, and the silent poetry of flowers.
                </p>
                <div className="h-px w-20 bg-brand-gold/45 mx-auto mt-6" />
              </div>

              {/* Loader */}
              {loading ? (
                <div className="flex justify-center items-center py-24">
                  <div className="h-6 w-6 border border-brand-dark/20 border-t-brand-sage rounded-full animate-spin" />
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-16 font-body-serif text-brand-dark/50 italic">
                  No journals have been published to the botanical log yet. Check back soon.
                </div>
              ) : (
                /* Grid list of posts */
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-12 lg:gap-16">
                  {posts.map((post) => (
                    <article
                      key={post._id}
                      onClick={() => setSelectedPost(post)}
                      className="group cursor-pointer space-y-6"
                    >
                      <div className="overflow-hidden border border-brand-dark/5 bg-white p-2 transition-all duration-700 group-hover:border-brand-gold group-hover:shadow-md">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-80 object-cover grayscale-[20%] group-hover:scale-[1.03] transition-transform duration-[1.2s] ease-out"
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 text-[9px] font-semibold uppercase tracking-wider text-brand-dark/50">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" /> {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {formatDate(post.publishedAt)}
                          </span>
                        </div>
                        <h2 className="font-serif text-2xl font-light tracking-tight text-brand-dark group-hover:text-brand-burgundy transition-colors duration-300">
                          {post.title}
                        </h2>
                        <p className="font-body-serif text-base text-brand-dark/70 leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="inline-flex items-center gap-2 pt-2 text-[10px] font-bold uppercase tracking-widest text-brand-sage group-hover:text-brand-burgundy transition-colors duration-300">
                          <span>Read Composition</span>
                          <BookOpen className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="detail-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto"
            >
              {/* Back Button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-dark/70 hover:text-brand-burgundy transition-colors mb-12 focus:outline-none"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Return to Journal list
              </button>

              {/* Cover Image */}
              <div className="border border-brand-dark/5 p-2 bg-white mb-12 shadow-sm">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-[450px] object-cover"
                />
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-brand-sage border-b border-brand-dark/5 pb-6 mb-8">
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" /> {selectedPost.author}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> {formatDate(selectedPost.publishedAt)}
                </span>
                <span className="flex items-center gap-1 text-brand-dark/40 ml-auto">
                  <Clock className="h-3.5 w-3.5" /> 4 Min Read
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-4xl md:text-5xl font-light tracking-tight text-brand-dark mb-8 leading-tight">
                {selectedPost.title}
              </h1>

              {/* Content body */}
              <div 
                className="font-body-serif text-lg text-brand-dark/85 leading-relaxed space-y-6 whitespace-pre-line"
              >
                {selectedPost.content}
              </div>
              
              <div className="border-t border-brand-dark/5 mt-16 pt-10 text-center">
                <p className="text-[10px] font-bold tracking-widest uppercase text-brand-dark/40">
                  Published by Bloom & Petal Editorial
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
