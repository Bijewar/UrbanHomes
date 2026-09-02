"use client";

import {
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  MapPin,
  MessageCircle,
  Phone,
  Twitter,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

const WHATSAPP_NUMBER = process.env
  .NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919343815319";
const WHATSAPP_NUMBER_ALT = process.env
  .NEXT_PUBLIC_WHATSAPP_NUMBER_ALT ?? "919303199175";

const SOCIALS = [
  { Icon: Instagram, label: "Instagram", href: "#" },
  { Icon: Facebook, label: "Facebook", href: "#" },
  { Icon: Linkedin, label: "LinkedIn", href: "#" },
  { Icon: Twitter, label: "Twitter", href: "#" },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="scroll-mt-24 bg-[#FAF8F5] px-6 py-24 md:px-12 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <Reveal className="mx-auto mb-14 max-w-3xl text-center">
          <span className="smallcaps-label">Get In Touch</span>
          <h2 className="mt-4 text-3xl font-serif text-[#2B2B2B] md:text-5xl">
            Tell us about your space.
          </h2>
          <div className="hairline mx-auto my-6 w-24" />
          <p className="text-base leading-relaxed text-[#6B6258] md:text-lg">
            Reach out via WhatsApp for an instant conversation with our team,
            or use the quote form above to tell us about your project.
          </p>
        </Reveal>

        {/* Details + map */}
        <Reveal className="mx-auto max-w-4xl flex flex-col gap-8">
          {/* Contact details */}
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            <DetailItem
              Icon={MapPin}
              title="Studio"
              lines={["Urban Homes", "By appointment · Pan-India"]}
            />
            <DetailItem
              Icon={Phone}
              title="Phone"
              lines={[
                formatPhone(WHATSAPP_NUMBER),
                formatPhone(WHATSAPP_NUMBER_ALT),
              ]}
            />
            <DetailItem
              Icon={MessageCircle}
              title="WhatsApp"
              lines={[
                formatPhone(WHATSAPP_NUMBER),
                "Mon–Sat, 10am–7pm",
              ]}
            />
            <DetailItem
              Icon={Clock}
              title="Working Hours"
              lines={["Mon–Fri: 9:30–18:30", "Sat: 10:00–14:00"]}
            />
          </div>

          {/* Map embed */}
          <div className="overflow-hidden rounded-2xl border border-[#E8E4DE]">
            <iframe
              title="Urban Homes service area map"
              src="https://maps.google.com/maps?q=Connaught%20Place%20New%20Delhi&t=&z=14&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-64 w-full grayscale-[0.2]"
              style={{ border: 0 }}
            />
          </div>

          {/* WhatsApp quick button */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              "Hi Urban Homes! I'd like to discuss a project.",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp w-full"
          >
            <MessageCircle className="h-5 w-5" />
            Chat with us on WhatsApp
          </a>

          {/* Socials */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-sm text-[#6B6258]">Follow us</span>
            <div className="hairline h-px w-8" />
            {SOCIALS.map(({ Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#B8894F]/40 text-[#B8894F] transition-all duration-300 hover:bg-[#B8894F] hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function DetailItem({
  Icon,
  title,
  lines,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  lines: string[];
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#B8894F]/30 bg-white text-[#B8894F]">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-[#6B6258]">
          {title}
        </p>
        <div className="mt-1 space-y-0.5">
          {lines.map((line) => (
            <p key={line} className="text-sm text-[#2B2B2B]">
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Format a 12-digit international number like 919343815319 -> +91 93438 15319 */
function formatPhone(num: string): string {
  if (num.length === 12 && num.startsWith("91")) {
    return `+91 ${num.slice(2, 7)} ${num.slice(7)}`;
  }
  return num;
}
