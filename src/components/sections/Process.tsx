"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PROCESS } from "@/lib/site-data";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

export default function Process() {
  const reduce = useReducedMotion();

  return (
    <section
      id="process"
      className="scroll-mt-24 divider-stone px-6 py-24 md:px-12 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <Reveal className="mx-auto mb-16 max-w-3xl text-center">
          <span className="smallcaps-label">How We Work</span>
          <h2 className="mt-4 text-3xl font-serif text-[#2B2B2B] md:text-5xl">
            From first conversation to final handover.
          </h2>
          <div className="hairline mx-auto my-6 w-24" />
          <p className="text-base leading-relaxed text-[#6B6258] md:text-lg">
            One team, one contract, one line of accountability. Our four-step
            process keeps every stakeholder aligned and every detail
            intentional — from the first sketch to the keys in your hand.
          </p>
        </Reveal>

        {/* Desktop timeline */}
        <div className="hidden md:block">
          <Stagger className="relative grid grid-cols-4 gap-6">
            {/* Animated connecting line — drawn across all columns */}
            <motion.div
              aria-hidden
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="absolute left-0 right-0 top-[34px] h-px bg-gradient-to-r from-transparent via-[#B8894F]/60 to-transparent"
            />
            {PROCESS.map((step) => {
              const Icon = step.icon;
              return (
                <StaggerItem key={step.id} className="relative flex flex-col items-center text-center">
                  {/* Numbered circle */}
                  <div className="relative flex h-[68px] w-[68px] items-center justify-center rounded-full border border-[#B8894F]/50 bg-white">
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#B8894F] text-[11px] font-semibold text-white">
                      {step.id}
                    </span>
                    <Icon className="h-7 w-7 text-[#B8894F]" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-6 font-serif text-xl text-[#2B2B2B]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#6B6258]">
                    {step.description}
                  </p>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>

        {/* Mobile vertical timeline */}
        <div className="md:hidden">
          <Stagger className="relative flex flex-col gap-8 pl-4">
            {/* Vertical connecting line */}
            <motion.div
              aria-hidden
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="absolute left-[34px] top-0 w-px bg-gradient-to-b from-transparent via-[#B8894F]/60 to-transparent"
            />
            {PROCESS.map((step) => {
              const Icon = step.icon;
              return (
                <StaggerItem key={step.id} className="relative flex items-start gap-5">
                  <div className="relative flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full border border-[#B8894F]/50 bg-white">
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#B8894F] text-[11px] font-semibold text-white">
                      {step.id}
                    </span>
                    <Icon className="h-7 w-7 text-[#B8894F]" strokeWidth={1.5} />
                  </div>
                  <div className="pt-2">
                    <h3 className="font-serif text-xl text-[#2B2B2B]">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#6B6258]">
                      {step.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>

        {/* Subtle reassurance line */}
        <Reveal delay={reduce ? 0 : 0.3} className="mt-16 text-center">
          <p className="text-sm text-[#6B6258]">
            <span className="font-medium text-[#2B2B2B]">Single point of contact</span>
            {" "}throughout — your project lead doesn&rsquo;t change between phases.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
