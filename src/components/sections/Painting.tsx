"use client";

import {
  useCallback,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PAINTING_PALETTE } from "@/lib/site-data";
import { Reveal } from "@/components/motion/Reveal";

const BEFORE_IMAGE =
  "https://images.unsplash.com/photo-1582268611958-ebf16144aaa6?auto=format&fit=crop&w=1200&q=80";
const AFTER_IMAGE =
  "https://images.unsplash.com/photo-1589939805396-29842a929af0?auto=format&fit=crop&w=1200&q=80";

export default function Painting() {
  const [position, setPosition] = useState(50);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, pct)));
  }, []);

  const handlePointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    draggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (!draggingRef.current) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    draggingRef.current = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const scrollToQuote = () => {
    document.getElementById("quote")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="painting"
      className="scroll-mt-24 bg-[#FAF8F5] px-6 py-24 md:px-12 md:py-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-16">
        {/* Left: before/after slider */}
        <Reveal>
          <div
            ref={containerRef}
            className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-2xl bg-[#E8E4DE] shadow-[0_24px_60px_-30px_rgba(43,43,43,0.35)]"
          >
            {/* After (base layer, full) */}
            <img
              src={AFTER_IMAGE}
              alt="After: freshly painted wall with premium finish"
              loading="lazy"
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute right-4 top-4 rounded-full bg-[#B8894F] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-md">
              After
            </span>

            {/* Before (clipped to left of handle) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${position}%` }}
            >
              <img
                src={BEFORE_IMAGE}
                alt="Before: aged wall prior to refinishing"
                loading="lazy"
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  width: `${(10000 / Math.max(position, 0.001))}%`,
                  maxWidth: "none",
                }}
              />
              <span className="absolute left-4 top-4 rounded-full bg-[#2B2B2B]/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-md backdrop-blur-sm">
                Before
              </span>
            </div>

            {/* Drag handle */}
            <button
              type="button"
              aria-label="Drag to compare before and after"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="absolute top-0 bottom-0 z-10 flex w-10 cursor-ew-resize items-center justify-center touch-none"
              style={{ left: `calc(${position}% - 20px)` }}
            >
              <span className="pointer-events-none absolute top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(184,137,79,0.5)]" />
              <span className="relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#B8894F] bg-white shadow-lg">
                <ChevronLeft className="h-4 w-4 text-[#B8894F]" />
                <ChevronRight className="h-4 w-4 -ml-1 text-[#B8894F]" />
              </span>
            </button>
          </div>
        </Reveal>

        {/* Right: copy + palette */}
        <Reveal delay={0.15}>
          <span className="smallcaps-label">Painting &amp; Finishing</span>
          <h2 className="mt-4 text-3xl font-serif leading-tight text-[#2B2B2B] md:text-4xl">
            The last 10% that defines 100% of the impression.
          </h2>
          <div className="hairline my-6 w-24" />
          <div className="space-y-4 text-base leading-relaxed text-[#6B6258]">
            <p>
              Walls are what your eye lands on first. That&rsquo;s why our finishing
              crew spends more time on surface preparation than on the coats
              themselves — filling, sanding, sealing and priming until the
              substrate is honestly ready.
            </p>
            <p>
              We work with premium low-VOC materials, hand-rolled edge work and
              compressor-sprayed finishes for flawless flats. Accent walls,
              textured surfaces and stencilled details are part of the same
              craft — not an afterthought.
            </p>
          </div>

          {/* Palette */}
          <div className="mt-8">
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[#6B6258]">
              Signature palette
            </p>
            <div className="flex flex-wrap items-start gap-4">
              {PAINTING_PALETTE.map((c, i) => {
                const isActive = activeColor === i;
                return (
                  <button
                    key={c.name}
                    onClick={() => setActiveColor(isActive ? null : i)}
                    className="group flex flex-col items-center gap-2"
                    aria-label={`Select ${c.name}`}
                    aria-pressed={isActive}
                  >
                    <span
                      className={`h-16 w-16 rounded-full ring-2 transition-all duration-300 ${
                        isActive
                          ? "scale-110 ring-[#B8894F]"
                          : "ring-[#E8E4DE] group-hover:ring-[#B8894F]/60"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                    <span
                      className={`text-[11px] font-medium transition-colors duration-300 ${
                        isActive
                          ? "text-[#B8894F]"
                          : "text-[#6B6258] group-hover:text-[#2B2B2B]"
                      }`}
                    >
                      {c.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={scrollToQuote}
            className="btn-bronze mt-9 inline-flex items-center"
          >
            Request a painting quote
          </button>
        </Reveal>
      </div>
    </section>
  );
}
