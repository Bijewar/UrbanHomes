"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ClipboardList } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import QuoteForm from "@/components/sections/QuoteForm";

/**
 * Floating bronze button (bottom-right) that opens a right-hand Sheet
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
            title="Request a free quote"
            aria-label="Request a free quote"
            className="quote-pulse fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#B8894F] text-white shadow-[0_14px_30px_-10px_rgba(184,137,79,0.7)] transition-colors hover:bg-[#a4763e]"
          >
            <ClipboardList className="h-6 w-6" />
            <span className="sr-only">Request a free quote</span>
          </motion.button>
        )}
      </AnimatePresence>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full gap-0 overflow-y-auto border-l border-[#E8E4DE] bg-[#FAF8F5] p-0 sm:max-w-lg"
        >
          <SheetTitle className="sr-only">Request a quote</SheetTitle>
          <SheetDescription className="sr-only">
            Fill in a few details about your project and upload photos of the
            space. We&rsquo;ll send a thoughtful, human-reviewed quote within
            24–48 hours.
          </SheetDescription>
          <div className="px-5 py-7 sm:px-7">
            <QuoteForm compact onSubmitted={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
