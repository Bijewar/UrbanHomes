"use client";

import { Reveal } from "@/components/motion/Reveal";
import { AnimatedCounter } from "@/components/motion/AnimatedCounter";

type StatItem = {
  id: string;
  value: number;
  suffix: string;
  label: string;
};

const STATS: StatItem[] = [
  { id: "projects", value: 240, suffix: "+", label: "Projects Completed" },
  { id: "years", value: 15, suffix: "+", label: "Years Active" },
  { id: "clients", value: 180, suffix: "+", label: "Clients Served" },
  { id: "cities", value: 12, suffix: "+", label: "Cities" },
];

export default function Stats() {
  return (
    <section id="stats" className="bg-[#F2EFE9] px-5 py-16 sm:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4 md:gap-y-0">
          {STATS.map((stat, i) => (
            <Reveal
              key={stat.id}
              delay={i * 0.12}
              className="relative px-4 py-2 text-center md:px-8"
            >
              {/* Hairline divider between cards on desktop */}
              {i > 0 && (
                <span
                  aria-hidden
                  className="absolute left-0 top-1/2 hidden h-16 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-[#B8894F]/45 to-transparent md:block"
                />
              )}

              <div className="font-serif text-4xl font-semibold text-[#2B2B2B] sm:text-5xl md:text-6xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-3 text-[0.7rem] uppercase tracking-[0.18em] text-[#6B6258]">
                {stat.label}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
