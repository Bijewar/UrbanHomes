"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { PORTFOLIO, type PortfolioItem } from "@/lib/site-data";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

type Filter = "All" | PortfolioItem["category"];

const FILTERS: Filter[] = ["All", "Residential", "Commercial", "Interior", "Painting"];

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visibleItems =
    activeFilter === "All"
      ? PORTFOLIO
      : PORTFOLIO.filter((item) => item.category === activeFilter);

  const handleFilterChange = (next: Filter) => {
    // Reset the lightbox whenever the filter changes (indices would be stale)
    setLightboxIndex(null);
    setActiveFilter(next);
  };

  // Lock body scroll while the lightbox is open
  useEffect(() => {
    if (lightboxIndex === null) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [lightboxIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight")
        setLightboxIndex((i) => (i === null ? null : (i + 1) % visibleItems.length));
      if (e.key === "ArrowLeft")
        setLightboxIndex((i) =>
          i === null ? null : (i - 1 + visibleItems.length) % visibleItems.length,
        );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, visibleItems.length]);

  const activeItem =
    lightboxIndex !== null ? visibleItems[lightboxIndex] : null;

  return (
    <section
      id="portfolio"
      className="scroll-mt-24 bg-[#FAF8F5] px-6 py-24 md:px-12 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <Reveal className="mx-auto mb-12 max-w-3xl text-center">
          <span className="smallcaps-label">Selected Work</span>
          <h2 className="mt-4 text-3xl font-serif text-[#2B2B2B] md:text-5xl">
            Projects we&rsquo;re proud of.
          </h2>
          <div className="hairline mx-auto my-6 w-24" />
          <p className="text-base leading-relaxed text-[#6B6258] md:text-lg">
            A curated look at residences, workspaces and finishes we&rsquo;ve
            delivered across India. Each project begins with a conversation and
            ends with a space that feels considered to the last detail.
          </p>
        </Reveal>

        {/* Filter pills */}
        <Reveal delay={0.1} className="mb-12 flex flex-wrap items-center justify-center gap-3">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={`relative rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300 ${
                  isActive
                    ? "text-white"
                    : "text-[#2B2B2B] hover:text-[#B8894F]"
                }`}
                style={{
                  border: `1px solid ${
                    isActive ? "transparent" : "rgba(184,137,79,0.45)"
                  }`,
                }}
              >
                {isActive && (
                  <motion.span
                    layoutId="portfolio-filter-pill"
                    className="absolute inset-0 rounded-full bg-[#B8894F]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{filter}</span>
              </button>
            );
          })}
        </Reveal>

        {/* Masonry grid */}
        <Stagger
          key={activeFilter}
          className="columns-1 gap-6 sm:columns-2 lg:columns-3"
          staggerChildren={0.08}
        >
          {visibleItems.map((item) => (
            <StaggerItem
              key={item.id}
              className="mb-6 break-inside-avoid"
            >
              <button
                onClick={() =>
                  setLightboxIndex(visibleItems.findIndex((i) => i.id === item.id))
                }
                className="img-zoom card-lift group relative block w-full overflow-hidden rounded-xl bg-[#E8E4DE] text-left"
                aria-label={`Open ${item.title}`}
              >
                <img
                  src={item.image}
                  alt={`${item.title} — ${item.category} in ${item.location}`}
                  loading="lazy"
                  className={`w-full h-auto object-cover ${
                    item.tall ? "aspect-[3/4]" : "aspect-[4/3]"
                  }`}
                />
                {/* Hover overlay */}
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#2B2B2B]/80 via-[#2B2B2B]/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="p-5">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#D4B486]">
                      {item.category}
                    </span>
                    <h3 className="mt-1 font-serif text-lg text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-white/70">{item.location}</p>
                  </div>
                </div>
              </button>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeItem && lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#FAF8F5]/95 p-4 backdrop-blur-md sm:p-8"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[#B8894F]/40 bg-white/80 text-[#2B2B2B] transition-colors hover:bg-[#B8894F] hover:text-white"
              aria-label="Close gallery"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Prev */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(
                  (i) =>
                    i === null
                      ? null
                      : (i - 1 + visibleItems.length) % visibleItems.length,
                );
              }}
              className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#B8894F]/40 bg-white/80 text-[#2B2B2B] transition-colors hover:bg-[#B8894F] hover:text-white sm:left-6"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Next */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((i) =>
                  i === null ? null : (i + 1) % visibleItems.length,
                );
              }}
              className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#B8894F]/40 bg-white/80 text-[#2B2B2B] transition-colors hover:bg-[#B8894F] hover:text-white sm:right-6"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Image card */}
            <motion.div
              key={activeItem.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[85vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="overflow-hidden rounded-2xl bg-[#E8E4DE] shadow-2xl">
                <img
                  src={activeItem.image}
                  alt={`${activeItem.title} — ${activeItem.category} in ${activeItem.location}`}
                  className="max-h-[72vh] w-full object-cover"
                />
              </div>
              <div className="mt-4 flex flex-col items-center text-center">
                <span className="smallcaps-label">{activeItem.category}</span>
                <h3 className="mt-1 font-serif text-2xl text-[#2B2B2B]">
                  {activeItem.title}
                </h3>
                <p className="text-sm text-[#6B6258]">{activeItem.location}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
