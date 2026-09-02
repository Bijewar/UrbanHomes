"use client";

import { Reveal } from "@/components/motion/Reveal";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";

const MAIN_IMAGE =
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80";
const OVERLAY_IMAGE =
  "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=600&q=80";

export default function About() {
  return (
    <section
      id="about"
      className="scroll-mt-24 px-5 py-20 sm:px-8 md:py-28"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-16">
        {/* Image collage */}
        <Reveal className="order-1 md:order-1">
          <div className="relative">
            <div className="img-zoom relative overflow-hidden rounded-2xl shadow-sm">
              <img
                src={MAIN_IMAGE}
                alt="Urban Homes architects and engineers collaborating on-site"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover sm:aspect-[5/4]"
              />
            </div>

            {/* Overlapping blueprint image */}
            <div className="absolute -bottom-8 -right-4 w-40 overflow-hidden rounded-xl border-4 border-[#FAF8F5] shadow-xl sm:w-56 md:-right-8 md:w-64">
              <img
                src={OVERLAY_IMAGE}
                alt="Architectural blueprints on a desk"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>

            {/* Bronze accent square */}
            <span
              aria-hidden
              className="absolute -left-4 -top-4 -z-10 h-20 w-20 border border-[#B8894F] sm:h-24 sm:w-24"
            />
          </div>
        </Reveal>

        {/* Text content */}
        <Reveal className="order-2 md:order-2" delay={0.15}>
          <div className="max-w-xl">
            <span className="smallcaps-label">About the Studio</span>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-[#2B2B2B] sm:text-4xl md:text-[2.5rem]">
              One team for planning, designing &amp; execution.
            </h2>

            <div className="mt-6 space-y-5 text-base leading-relaxed text-[#6B6258] md:text-[1.05rem]">
              <p>
                Urban Homes was founded on a simple conviction: the best
                spaces are made when the people who plan them, the people who
                design them and the people who execute them are the same team.
                We bring construction, interiors, modular kitchens, custom
                furniture, false ceiling, painting and bespoke art work under
                one roof — so that every line on a drawing has a clear,
                accountable pair of hands behind it.
              </p>
              <p>
                Our in-house craftsmen have spent years refining their trade,
                which means we never sub-contract the parts of a project that
                define its character. From structural calculations to the final
                coat of paint, quality is owned by people you can speak to by
                name. We work on both residential and commercial projects, and
                we read light, climate, material and context so each space
                feels rooted in where it stands.
              </p>
              <p>
                The result is a practice that moves like a studio and ships
                like a contractor: warm at the conversation, precise on the
                drawings, and quiet on the site. We take on a limited number
                of projects each year so each one gets the attention it
                deserves — from the first sketch to the day we hand over the
                keys.
              </p>
            </div>

            {/* Inline stats */}
            <div className="mt-9 flex flex-wrap items-center gap-x-10 gap-y-6">
              <div>
                <div className="font-serif text-4xl font-semibold text-[#2B2B2B]">
                  <AnimatedCounter value={15} suffix="+" />
                </div>
                <div className="mt-1 text-[0.7rem] uppercase tracking-[0.18em] text-[#6B6258]">
                  Years of practice
                </div>
              </div>
              <span
                aria-hidden
                className="hidden h-10 w-px bg-[#B8894F]/40 sm:block"
              />
              <div>
                <div className="font-serif text-4xl font-semibold text-[#2B2B2B]">
                  <AnimatedCounter value={240} suffix="+" />
                </div>
                <div className="mt-1 text-[0.7rem] uppercase tracking-[0.18em] text-[#6B6258]">
                  Projects delivered
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
