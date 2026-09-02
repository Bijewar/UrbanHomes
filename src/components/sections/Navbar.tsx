"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

type NavLink = { label: string; href: string };

const NAV_LINKS: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#portfolio" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "nav-solid" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 md:h-20">
        {/* Logo */}
        <a
          href="#top"
          onClick={(e) => handleNav(e, "#top")}
          className="flex items-center gap-3"
          aria-label="Urban Homes home"
        >
          <span
            aria-hidden
            className="block h-6 w-6 border border-[#B8894F]"
          />
          <span className="font-serif text-lg font-semibold tracking-[0.18em] text-[#2B2B2B] sm:text-xl">
            URBAN HOMES
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => handleNav(e, link.href)}
                className="link-underline text-sm font-medium tracking-wide text-[#2B2B2B]/85 transition-colors hover:text-[#B8894F]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href="#quote"
          onClick={(e) => handleNav(e, "#quote")}
          className="btn-bronze hidden text-sm md:inline-block"
        >
          Get a Quote
        </a>

        {/* Mobile trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#2B2B2B] transition-colors hover:bg-[#E8E4DE] md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open navigation menu</span>
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[82%] max-w-sm border-l border-[#E8E4DE] bg-[#FAF8F5] p-0"
          >
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <div className="flex h-full flex-col px-6 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="block h-6 w-6 border border-[#B8894F]"
                  />
                  <span className="font-serif text-base font-semibold tracking-[0.18em] text-[#2B2B2B]">
                    URBAN HOMES
                  </span>
                </div>
              </div>

              <div className="hairline my-6" aria-hidden />

              <ul className="flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNav(e, link.href)}
                      className="block rounded-lg px-2 py-3 font-serif text-xl text-[#2B2B2B] transition-colors hover:bg-[#F2EFE9] hover:text-[#B8894F]"
                    >
                      <span className="mr-3 text-xs font-sans font-semibold text-[#B8894F]">
                        0{i + 1}
                      </span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>


            </div>
          </SheetContent>
        </Sheet>
      </nav>

      {/* Subtle entrance accent line under nav when scrolled */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="hairline mx-auto max-w-7xl"
            aria-hidden
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
}
