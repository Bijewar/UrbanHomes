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
          <span className="smallcaps-label">Our Services</span>
          <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight text-[#2B2B2B] sm:text-4xl md:text-[2.6rem]">
            Three disciplines, one accountable team.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#6B6258] md:text-lg">
            Civil engineering, architecture and finishing — held together by a
            single studio so that nothing falls through the gaps between
            drawing, structure and final surface.
          </p>
          <div className="hairline mx-auto mt-8 max-w-24" aria-hidden />
        </div>

        {/* Cards */}
        <Stagger
          className="mt-14 grid gap-8 md:grid-cols-3 md:gap-7"
          staggerChildren={0.15}
        >
          {SERVICES.map((service) => (
            <StaggerItem key={service.id} className="h-full">
              <ServiceCard service={service} onQuote={handleQuote} />
            </StaggerItem>
          ))}
        </Stagger>
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
    <article className="card-lift flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8E4DE] bg-white">
      {/* Image */}
      <div className="img-zoom">
        <img
          src={service.image}
          alt={`${service.title} — ${service.short}`}
          loading="lazy"
          className="h-56 w-full object-cover"
        />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6 md:p-8">
        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8E4DE]">
          <Icon className="h-5 w-5 text-[#B8894F]" strokeWidth={1.5} />
        </div>

        <h3 className="mt-5 font-serif text-2xl font-semibold text-[#2B2B2B]">
          {service.title}
        </h3>
        <p className="mt-1 text-sm font-medium italic text-[#B8894F]">
          {service.short}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-[#6B6258]">
          {service.description}
        </p>

        {/* Hairline divider */}
        <div className="hairline my-6" aria-hidden />

        {/* Features */}
        <ul className="flex-1 space-y-3">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#B8894F]/10">
                <Check className="h-3 w-3 text-[#B8894F]" strokeWidth={2.5} />
              </span>
              <span className="text-sm leading-snug text-[#2B2B2B]/85">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#quote"
          onClick={onQuote}
          className="link-underline group mt-7 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-[#B8894F]"
        >
          Request a quote
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
    </article>
  );
}
