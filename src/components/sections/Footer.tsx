"use client";

import {
  Facebook,
  Instagram,
  Linkedin,
  MessageCircle,
  Twitter,
  Phone,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

const WHATSAPP_NUMBER = process.env
  .NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919343815319";
const WHATSAPP_NUMBER_ALT = process.env
  .NEXT_PUBLIC_WHATSAPP_NUMBER_ALT ?? "919303199175";

const QUICK_LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#portfolio" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

const SERVICE_LINKS = [
  { label: "Construction & Renovation", href: "#services" },
  { label: "Interior Design", href: "#services" },
  { label: "Modular Kitchen", href: "#services" },
  { label: "Custom Furniture", href: "#services" },
  { label: "False Ceiling & Wall Design", href: "#services" },
  { label: "Painting & Finishing", href: "#painting" },
  { label: "Wall & Surface Solutions", href: "#services" },
  { label: "Art & Custom Work", href: "#services" },
];

const SOCIALS = [
  { Icon: Instagram, label: "Instagram", href: "#" },
  { Icon: Facebook, label: "Facebook", href: "#" },
  { Icon: Linkedin, label: "LinkedIn", href: "#" },
  { Icon: Twitter, label: "Twitter", href: "#" },
];

/** Format a 12-digit international number like 919343815319 → +91 93438 15319 */
function formatPhone(num: string): string {
  if (num.length === 12 && num.startsWith("91")) {
    return `+91 ${num.slice(2, 7)} ${num.slice(7)}`;
  }
  return num;
}

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#B8894F]/30 bg-[#F2EFE9]">
      <Reveal className="mx-auto max-w-7xl px-6 py-14 md:px-12">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="md:pr-4">
            <h3 className="font-serif text-xl tracking-wide text-[#2B2B2B]">
              URBAN HOMES
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#6B6258]">
              Planning · Designing · Execution
              <br />
              Residential &amp; Commercial
            </p>
            <p className="mt-3 text-sm text-[#6B6258]">
              By appointment
              <br />
              Pan-India projects
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="smallcaps-label">Quick Links</p>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="link-underline text-sm text-[#2B2B2B] transition-colors hover:text-[#B8894F]"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="smallcaps-label">Services</p>
            <ul className="mt-4 space-y-2.5">
              {SERVICE_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="link-underline text-sm text-[#2B2B2B] transition-colors hover:text-[#B8894F]"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="smallcaps-label">Contact</p>
            <ul className="mt-4 space-y-2.5 text-sm text-[#2B2B2B]">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#B8894F]" />
                <a
                  href={`tel:+${WHATSAPP_NUMBER}`}
                  className="link-underline transition-colors hover:text-[#B8894F]"
                >
                  {formatPhone(WHATSAPP_NUMBER)}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#B8894F]" />
                <a
                  href={`tel:+${WHATSAPP_NUMBER_ALT}`}
                  className="link-underline transition-colors hover:text-[#B8894F]"
                >
                  {formatPhone(WHATSAPP_NUMBER_ALT)}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="mt-0.5 h-4 w-4 text-[#1FA654]" />
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline transition-colors hover:text-[#1FA654]"
                >
                  Chat on WhatsApp
                </a>
              </li>
              <li className="text-[#6B6258]">
                Mon–Fri 9:30–18:30 · Sat 10:00–14:00
              </li>
            </ul>

            {/* Socials */}
            <div className="mt-5 flex items-center gap-2">
              {SOCIALS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#B8894F]/40 text-[#B8894F] transition-all duration-300 hover:bg-[#B8894F] hover:text-white"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-[#B8894F]/15 pt-6 text-xs text-[#6B6258] sm:flex-row">
          <p>© 2026 Urban Homes. Crafted with care.</p>
          <p className="flex items-center gap-3">
            <span className="link-underline cursor-default">Privacy</span>
            <span aria-hidden>·</span>
            <span className="link-underline cursor-default">Terms</span>
            <span aria-hidden>·</span>
            <span className="link-underline cursor-default">Sitemap</span>
          </p>
        </div>
      </Reveal>
    </footer>
  );
}
