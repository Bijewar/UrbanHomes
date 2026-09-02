"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import QuoteForm from "@/components/sections/QuoteForm";

/* Inline WhatsApp SVG (lucide doesn't ship a WhatsApp glyph). */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      focusable="false"
    >
      <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.02zM12.04 20.13a8.18 8.18 0 0 1-4.17-1.14l-.3-.18-3.11.82.83-3.03-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.42 5.82c0 4.54-3.7 8.23-8.28 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43-.14-.01-.31-.01-.48-.01-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.39 1.01 2.55.12.17 1.75 2.66 4.23 3.73.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
    </svg>
  );
}

/**
 * Floating WhatsApp button (bottom-right) that opens a right-hand Sheet
 * containing the compact multi-step QuoteForm.
 *
 * Hidden while the user is already at the `#quote` section so the form
 * is not duplicated on screen. Tracked with an IntersectionObserver.
 */
export default function FloatingQuoteButton() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;
    const quoteEl = document.getElementById("quote");
    if (!quoteEl) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setHidden(entry.isIntersecting));
      },
      // Active when the section is reasonably centered in the viewport.
      { rootMargin: "-25% 0px -45% 0px", threshold: 0 },
    );
    obs.observe(quoteEl);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <AnimatePresence>
        {!hidden && (
          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            initial={{ scale: 0.6, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.6, opacity: 0, y: 12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            title="Request a free quote on WhatsApp"
            aria-label="Request a free quote on WhatsApp"
            className="quote-pulse fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#1FA654] text-white shadow-[0_14px_30px_-10px_rgba(31,166,84,0.7)] transition-colors hover:bg-[#178a46]"
          >
            <WhatsAppIcon className="h-7 w-7" />
            <span className="sr-only">Request a free quote on WhatsApp</span>
          </motion.button>
        )}
      </AnimatePresence>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full gap-0 overflow-y-auto border-l border-[#E8E4DE] bg-[#FAF8F5] p-0 sm:max-w-lg"
        >
          <SheetTitle className="sr-only">Request a quote on WhatsApp</SheetTitle>
          <SheetDescription className="sr-only">
            Fill in a few details about your project and upload photos of the
            space. We&rsquo;ll prepare a WhatsApp message with everything
            pre-filled — just hit Send and our team will reply.
          </SheetDescription>
          <div className="px-5 py-7 sm:px-7">
            <QuoteForm compact onSubmitted={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
