"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1486718448742-163732cd1544?auto=format&fit=crop&w=2000&q=80";

const TRUST = [
  { value: "15+ yrs", label: "of practice" },
  { value: "240+", label: "projects delivered" },
  { value: "4.9★", label: "client rating" },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Subtle parallax: move background image by ~15% of scroll
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const bgYFinal = reduce ? "0%" : bgY;

  const handleNav = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      ref={ref}
      id="top"
      className="relative w-full overflow-hidden"
      style={{ minHeight: "92vh" }}
    >
      {/* Parallax background */}
      <motion.div
        aria-hidden
        style={{ y: bgYFinal }}
        className="absolute inset-0 -z-10"
      >
        <img
          src={HERO_IMAGE}
          alt="Modern minimalist building exterior in daylight"
          loading="eager"
          className="h-full w-full object-cover object-center"
        />
        {/* Ivory gradient overlay for legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(250,248,245,0) 30%, rgba(250,248,245,0.85) 100%)",
          }}
        />
        {/* Soft top scrim for nav legibility */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/10 to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="mx-auto flex min-h-[92vh] max-w-4xl flex-col items-center justify-center px-5 pb-24 pt-32 text-center sm:px-8">
        <Stagger
          className="flex w-full flex-col items-center"
          delayChildren={0.15}
          staggerChildren={0.14}
        >
          <StaggerItem>
            <span className="smallcaps-label">Construction · Interior · Painting</span>
          </StaggerItem>

          <StaggerItem className="mt-6 w-full">
            <h1 className="text-balance font-serif text-4xl font-semibold leading-[1.05] text-[#2B2B2B] sm:text-5xl md:text-6xl lg:text-7xl">
              Planning, Designing &amp; Execution — for spaces that feel considered.
            </h1>
          </StaggerItem>

          <StaggerItem className="mt-6 w-full">
            <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-[#6B6258] sm:text-lg md:text-xl">
              Residential and commercial work, end-to-end. Construction,
              interiors, modular kitchens, custom furniture, false ceiling,
              painting &amp; finishing — by one accountable team.
            </p>
          </StaggerItem>

          <StaggerItem className="mt-9 w-full">
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#quote"
                onClick={handleNav("#quote")}
                className="btn-bronze w-full text-center sm:w-auto"
              >
                Get a Free Quote
              </a>
              <a
                href="#portfolio"
                onClick={handleNav("#portfolio")}
                className="btn-outline-bronze w-full text-center sm:w-auto"
              >
                View Our Work
              </a>
            </div>
          </StaggerItem>

          {/* Trust indicators */}
          <StaggerItem className="mt-12 w-full">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[#6B6258] sm:gap-x-8">
              {TRUST.map((t, i) => (
                <li
                  key={t.label}
                  className="flex items-center gap-6 sm:gap-8"
                >
                  {i > 0 && (
                    <span
                      aria-hidden
                      className="hidden h-8 w-px bg-[#B8894F]/40 sm:block"
                    />
                  )}
                  <span className="flex flex-col items-center sm:items-start">
                    <span className="font-serif text-lg font-semibold text-[#2B2B2B]">
                      {t.value}
                    </span>
                    <span className="text-[0.65rem] uppercase tracking-[0.18em] text-[#6B6258]">
                      {t.label}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </StaggerItem>
        </Stagger>
      </div>

      {/* Scroll-down indicator */}
      <motion.a
        href="#about"
        onClick={handleNav("#about")}
        aria-label="Scroll to about section"
        className="absolute inset-x-0 bottom-7 mx-auto flex w-fit flex-col items-center gap-2 text-[#B8894F]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <span aria-hidden className="h-10 w-px bg-[#B8894F]/50" />
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </motion.a>
    </section>
  );
}
