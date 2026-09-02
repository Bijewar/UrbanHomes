"use client";

import { useState, type FormEvent } from "react";
import {
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/motion/Reveal";
import { useToast } from "@/hooks/use-toast";

type FormState = {
  name: string;
  email: string;
  message: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SOCIALS = [
  { Icon: Instagram, label: "Instagram", href: "#" },
  { Icon: Facebook, label: "Facebook", href: "#" },
  { Icon: Linkedin, label: "LinkedIn", href: "#" },
  { Icon: Twitter, label: "Twitter", href: "#" },
];

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Please tell us your name.";
    if (!form.email.trim()) {
      e.email = "We need an email to reply.";
    } else if (!EMAIL_RE.test(form.email.trim())) {
      e.email = "That email doesn’t look right.";
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      e.message = "A sentence or two about your project, please.";
    }
    return e;
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    // Simulated async submit — no backend wiring needed
    setTimeout(() => {
      setSubmitting(false);
      setForm({ name: "", email: "", message: "" });
      toast({
        title: "Message sent",
        description:
          "Thank you — a member of our studio will be in touch within one working day.",
      });
    }, 700);
  };

  const fieldClass = (name: keyof FormState) =>
    `bg-white ${errors[name] ? "border-[#C1704D]" : "border-[#E8E4DE]"}`;

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
            Send us a few lines about your site, timeline and what you&rsquo;re
            hoping to achieve. We reply to every message personally — usually
            within one working day.
          </p>
        </Reveal>

        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          {/* Left: form */}
          <Reveal>
            <form
              onSubmit={onSubmit}
              noValidate
              className="rounded-2xl border border-[#E8E4DE] bg-white p-6 shadow-[0_18px_50px_-30px_rgba(43,43,43,0.18)] md:p-8"
            >
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="c-name"
                    className="mb-2 block text-sm font-medium text-[#2B2B2B]"
                  >
                    Name
                  </label>
                  <Input
                    id="c-name"
                    name="name"
                    autoComplete="name"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, name: e.target.value }))
                    }
                    aria-invalid={!!errors.name}
                    className={fieldClass("name")}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-[#C1704D]">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="c-email"
                    className="mb-2 block text-sm font-medium text-[#2B2B2B]"
                  >
                    Email
                  </label>
                  <Input
                    id="c-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, email: e.target.value }))
                    }
                    aria-invalid={!!errors.email}
                    className={fieldClass("email")}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-[#C1704D]">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="c-message"
                    className="mb-2 block text-sm font-medium text-[#2B2B2B]"
                  >
                    Message
                  </label>
                  <Textarea
                    id="c-message"
                    name="message"
                    rows={5}
                    placeholder="Tell us about the project, location, scope and rough timeline…"
                    value={form.message}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, message: e.target.value }))
                    }
                    aria-invalid={!!errors.message}
                    className={fieldClass("message")}
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs text-[#C1704D]">{errors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="btn-bronze h-11 w-full border-0 bg-[#B8894F] text-white hover:bg-[#a4763e] disabled:opacity-60"
                >
                  {submitting ? "Sending…" : "Send message"}
                </Button>

                <p className="text-center text-xs text-[#6B6258]">
                  We&rsquo;ll never share your details. Replies are personal, not
                  automated.
                </p>
              </div>
            </form>
          </Reveal>

          {/* Right: details + map */}
          <Reveal delay={0.15} className="flex flex-col gap-8">
            {/* Contact details */}
            <div className="grid gap-6 sm:grid-cols-2">
              <DetailItem
                Icon={MapPin}
                title="Studio"
                lines={["14 Atelier Lane", "Connaught Place, New Delhi"]}
              />
              <DetailItem
                Icon={Phone}
                title="Phone"
                lines={["+91 98100 12345", "Mon–Sat, 10am–7pm"]}
              />
              <DetailItem
                Icon={Mail}
                title="Email"
                lines={["hello@maisonstudio.in", "projects@maisonstudio.in"]}
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
                title="Maison Studio location map"
                src="https://maps.google.com/maps?q=Connaught%20Place%20New%20Delhi&t=&z=14&ie=UTF8&iwloc=&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-64 w-full grayscale-[0.2]"
                style={{ border: 0 }}
              />
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3">
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
