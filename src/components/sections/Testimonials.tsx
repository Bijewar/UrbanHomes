"use client";

import { Quote, Star } from "lucide-react";
import { TESTIMONIALS, type Testimonial } from "@/lib/site-data";
import { Reveal } from "@/components/motion/Reveal";

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <article className="mx-3 flex min-w-[340px] max-w-[380px] flex-col rounded-2xl border border-[#E8E4DE] bg-white p-6 shadow-[0_18px_40px_-26px_rgba(43,43,43,0.18)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-0.5" aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="h-4 w-4 fill-[#B8894F] text-[#B8894F]"
            />
          ))}
        </div>
        <Quote className="h-6 w-6 text-[#B8894F]/40" />
      </div>
      <p className="font-serif text-[17px] italic leading-relaxed text-[#2B2B2B]">
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="mt-6 flex items-center gap-3 border-t border-[#E8E4DE] pt-5">
        <img
          src={t.avatar}
          alt={`Portrait of ${t.name}`}
          loading="lazy"
          className="h-12 w-12 rounded-full object-cover ring-2 ring-[#E8E4DE]"
        />
        <div>
          <p className="font-medium text-[#2B2B2B]">{t.name}</p>
          <p className="text-xs text-[#6B6258]">{t.role}</p>
        </div>
      </div>
    </article>
  );
}

export default function Testimonials() {
  // Render testimonials twice end-to-end for a seamless marquee loop
  const loop = [...TESTIMONIALS, ...TESTIMONIALS];

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="testimonials"
      className="scroll-mt-24 divider-stone py-24 md:py-32"
    >
      {/* Header */}
      <Reveal className="mx-auto mb-14 max-w-3xl px-6 text-center">
        <span className="smallcaps-label">Client Voices</span>
        <h2 className="mt-4 text-3xl font-serif text-[#2B2B2B] md:text-5xl">
          Trusted by homeowners, architects &amp; developers.
        </h2>
        <div className="hairline mx-auto my-6 w-24" />
        <p className="text-base leading-relaxed text-[#6B6258] md:text-lg">
          Long relationships, repeat clients and word-of-mouth referrals are the
          metrics we care about most. Here&rsquo;s a sample of what people say
          after working with us.
        </p>
      </Reveal>

      {/* Marquee */}
      <div className="relative">
        {/* Gradient fade edges */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-[#FAF8F5] to-transparent sm:w-32"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-[#FAF8F5] to-transparent sm:w-32"
        />

        <div className="overflow-hidden py-4">
          <div className="marquee-track">
            {loop.map((t, i) => (
              <TestimonialCard key={`${t.id}-${i}`} t={t} />
            ))}
          </div>
        </div>
      </div>

      {/* View more */}
      <Reveal delay={0.1} className="mt-12 px-6 text-center">
        <button
          onClick={scrollToContact}
          className="link-underline text-sm font-medium text-[#B8894F]"
        >
          View more reviews &rarr;
        </button>
      </Reveal>
    </section>
  );
}
