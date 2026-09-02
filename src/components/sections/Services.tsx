"use client";

import { Check, ArrowRight } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { SERVICES, type ServiceItem } from "@/lib/site-data";

export default function Services() {
  const handleQuote = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document
      .querySelector("#quote")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="services"
      className="scroll-mt-24 px-5 py-20 sm:px-8 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="smallcaps-label">What We Do</span>
          <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-[#2B2B2B] sm:text-4xl md:text-[2.6rem]">
            Eight disciplines, one accountable team.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#6B6258] md:text-lg">
            Planning, designing and execution for residential and commercial
            projects — held together by a single studio so that nothing falls
            through the gaps between drawing, structure and final surface.
          </p>
          <div className="hairline mx-auto mt-8 max-w-24" aria-hidden />
        </div>

        {/* Cards — 4-column on desktop so the 8 services form a tidy 4×2 grid */}
        <Stagger
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          staggerChildren={0.08}
        >
          {SERVICES.map((service) => (
            <StaggerItem key={service.id} className="h-full">
              <ServiceCard service={service} onQuote={handleQuote} />
            </StaggerItem>
          ))}
        </Stagger>

        {/* Bottom CTA strip */}
        <div className="mt-14 text-center">
          <a
            href="#quote"
            onClick={handleQuote}
            className="btn-bronze"
          >
            Get a free quote
          </a>
          <p className="mt-4 text-sm text-[#6B6258]">
            Not sure which service fits? Tell us about the project and
            we&rsquo;ll route it to the right team.
          </p>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  onQuote,
}: {
  service: ServiceItem;
  onQuote: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const Icon = service.icon;
  return (
    <article className="card-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8E4DE] bg-white">
      {/* Image */}
      <div className="img-zoom">
        <img
          src={service.image}
          alt={`${service.title} — ${service.short}`}
          loading="lazy"
          className="h-44 w-full object-cover"
        />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        {/* Icon */}
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E8E4DE]">
          <Icon className="h-5 w-5 text-[#B8894F]" strokeWidth={1.5} />
        </div>

        <h3 className="mt-4 font-serif text-xl font-semibold text-[#2B2B2B]">
          {service.title}
        </h3>
        <p className="mt-1 text-xs font-medium italic text-[#B8894F]">
          {service.short}
        </p>

        {/* Hairline divider */}
        <div className="hairline my-4" aria-hidden />

        {/* Features */}
        <ul className="flex-1 space-y-2">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#B8894F]/10">
                <Check className="h-2.5 w-2.5 text-[#B8894F]" strokeWidth={2.5} />
              </span>
              <span className="text-[13px] leading-snug text-[#2B2B2B]/85">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#quote"
          onClick={onQuote}
          className="link-underline group/cta mt-5 inline-flex w-fit items-center gap-1.5 text-xs font-medium text-[#B8894F]"
        >
          Request a quote
          <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover/cta:translate-x-1" />
        </a>
      </div>
    </article>
  );
}
