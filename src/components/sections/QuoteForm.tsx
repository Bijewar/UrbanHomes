"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useDropzone, type FileRejection } from "react-dropzone";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ImagePlus,
  Loader2,
  MessageCircle,
  UploadCloud,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  compressImage,
  isCloudinaryConfigured,
  uploadToCloudinary,
} from "@/lib/cloudinary";

/* ---------- Constants ---------- */

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919343815319";

const SERVICE_OPTIONS = [
  "Construction & Renovation",
  "Interior Design",
  "Modular Kitchen",
  "Custom Furniture",
  "False Ceiling & Wall Design",
  "Painting & Finishing",
  "Wall & Surface Solutions",
  "Art & Custom Work",
  "Other",
] as const;
type ServiceType = (typeof SERVICE_OPTIONS)[number];

const STEPS = ["Contact", "Project", "Photos"] as const;
const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/* ---------- Validation schema ---------- */

const quoteSchema = z.object({
  fullName: z
    .string()
    .min(2, "Please enter your full name (at least 2 characters)."),
  phone: z.string().optional(),
  serviceType: z.enum(SERVICE_OPTIONS, {
    errorMap: () => ({ message: "Please choose a service type." }),
  }),
  description: z
    .string()
    .min(20, "A sentence or two about the project — at least 20 characters."),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

/* ---------- Image upload state ---------- */

type UploadStatus = "queued" | "uploading" | "done" | "error";

type UploadedImage = {
  id: string;
  file: File;
  previewUrl: string;
  status: UploadStatus;
  progress: number; // 0–100
  remoteUrl?: string;
  error?: string;
};

/* ---------- Main component ---------- */

type Props = {
  compact?: boolean;
  onSubmitted?: () => void;
};

export default function QuoteForm({ compact = false, onSubmitted }: Props) {
  const reduce = useReducedMotion();
  const { toast } = useToast();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const cloudinaryReady = isCloudinaryConfigured();

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      phone: "",
      serviceType: undefined,
      description: "",
    },
  });

  const { register, handleSubmit, trigger, formState, watch } =
    form;
  const values = watch();

  /* ----- Image upload handlers ----- */

  const onDrop = useCallback(
    async (accepted: File[], rejected: FileRejection[]) => {
      if (rejected.length > 0) {
        rejected.forEach((r) => {
          const reason = r.errors[0]?.code === "file-too-large"
            ? `${r.file.name} is larger than 10MB.`
            : r.errors[0]?.code === "file-invalid-type"
              ? `${r.file.name} isn't a supported image type.`
              : `${r.file.name} was rejected.`;
          toast({ title: "Couldn't add image", description: reason });
        });
      }
      if (accepted.length === 0) return;

      const currentCount = images.length;
      const room = Math.max(0, MAX_IMAGES - currentCount);
      if (room === 0) {
        toast({
          title: "Limit reached",
          description: `You can upload up to ${MAX_IMAGES} images.`,
        });
        return;
      }
      const toAdd = accepted.slice(0, room);

      const newEntries: UploadedImage[] = toAdd.map((file) => ({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        status: "queued",
        progress: 0,
      }));

      setImages((prev) => [...prev, ...newEntries]);

      // Upload each one in the background (sequentially to be gentle on rate-limits).
      for (const entry of newEntries) {
        setImages((prev) =>
          prev.map((p) =>
            p.id === entry.id ? { ...p, status: "uploading", progress: 5 } : p,
          ),
        );
        try {
          if (!cloudinaryReady) {
            // Soft-fail: simulate a tiny delay so the UI still animates nicely.
            await new Promise((r) => setTimeout(r, 600));
            setImages((prev) =>
              prev.map((p) =>
                p.id === entry.id
                  ? {
                      ...p,
                      status: "error",
                      progress: 0,
                      error:
                        "Cloudinary not configured — image will be sent as a local preview link instead.",
                    }
                  : p,
              ),
            );
            continue;
          }

          const compressed = await compressImage(entry.file);
          const result = await uploadToCloudinary(compressed, (pct) => {
            setImages((prev) =>
              prev.map((p) =>
                p.id === entry.id ? { ...p, progress: pct } : p,
              ),
            );
          });
          setImages((prev) =>
            prev.map((p) =>
              p.id === entry.id
                ? {
                    ...p,
                    status: "done",
                    progress: 100,
                    remoteUrl: result.secure_url,
                  }
                : p,
            ),
          );
        } catch (err) {
          const msg =
            err instanceof Error ? err.message : "Upload failed. Try again.";
          setImages((prev) =>
            prev.map((p) =>
              p.id === entry.id
                ? { ...p, status: "error", progress: 0, error: msg }
                : p,
            ),
          );
          toast({
            title: "Image upload failed",
            description: msg,
          });
        }
      }
    },
    [images, cloudinaryReady, toast],
  );

  const dropzone = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/heic": [".heic"],
      "image/webp": [".webp"],
    },
    maxSize: MAX_FILE_SIZE,
    maxFiles: MAX_IMAGES,
    disabled: images.length >= MAX_IMAGES,
    noClick: true,
    noKeyboard: true,
  });

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  };

  const retryImage = async (id: string) => {
    const target = images.find((p) => p.id === id);
    if (!target) return;
    setImages((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "uploading", progress: 5, error: undefined } : p,
      ),
    );
    try {
      if (!cloudinaryReady) {
        await new Promise((r) => setTimeout(r, 400));
        setImages((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: "error",
                  error: "Cloudinary not configured.",
                }
              : p,
          ),
        );
        return;
      }
      const compressed = await compressImage(target.file);
      const result = await uploadToCloudinary(compressed, (pct) => {
        setImages((prev) =>
          prev.map((p) => (p.id === id ? { ...p, progress: pct } : p)),
        );
      });
      setImages((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, status: "done", progress: 100, remoteUrl: result.secure_url }
            : p,
        ),
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Retry failed.";
      setImages((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: "error", progress: 0, error: msg } : p,
        ),
      );
    }
  };

  /* ----- Step navigation ----- */

  const goNext = async () => {
    if (step === 0) {
      const ok = await trigger(["fullName", "phone"]);
      if (!ok) return;
    }
    if (step === 1) {
      const ok = await trigger(["serviceType", "description"]);
      if (!ok) return;
    }
    setStep((s) => Math.min(2, s + 1) as 0 | 1 | 2);
  };
  const goBack = () => setStep((s) => Math.max(0, s - 1) as 0 | 1 | 2);

  /* ----- Submit ----- */

  const onSubmit = handleSubmit(async (data) => {
    // Honeypot: if filled, silently pretend success without sending anything.
    if (honeypot.trim()) {
      setSubmitted(true);
      setSubmitting(false);
      return;
    }

    // Require at least one image.
    const readyImages = images.filter((i) => i.status === "done" && i.remoteUrl);
    if (readyImages.length === 0) {
      toast({
        title: "Add at least one image",
        description: "We need a photo or two of the space to give you an accurate quote.",
      });
      setStep(2);
      return;
    }

    setSubmitting(true);
    // Allow any pending uploads to finish (up to ~3s).
    const waitStart = Date.now();
    while (
      images.some((i) => i.status === "uploading" || i.status === "queued") &&
      Date.now() - waitStart < 3000
    ) {
      await new Promise((r) => setTimeout(r, 200));
    }

    const finalImages = images.filter((i) => i.status === "done" && i.remoteUrl);
    if (finalImages.length === 0) {
      setSubmitting(false);
      toast({
        title: "Uploads still in progress",
        description: "Please wait a moment for your images to finish uploading, then try again.",
      });
      return;
    }

    const message = buildWhatsAppMessage({
      name: data.fullName,
      serviceType: data.serviceType,
      phone: data.phone,
      description: data.description,
      imageUrls: finalImages.map((i) => i.remoteUrl!),
    });
    const url = buildWhatsAppUrl(WHATSAPP_NUMBER, message);

    // Open WhatsApp in a new tab — the user taps "Send" inside WhatsApp.
    window.open(url, "_blank", "noopener,noreferrer");

    setSubmitting(false);
    setSubmitted(true);
    onSubmitted?.();
  });

  const resetForm = () => {
    setSubmitted(false);
    setStep(0);
    images.forEach((i) => URL.revokeObjectURL(i.previewUrl));
    setImages([]);
    form.reset();
  };

  /* ---------- Success state ---------- */

  if (submitted) {
    return (
      <SuccessState compact={compact} onReset={resetForm} />
    );
  }

  /* ---------- Form UI ---------- */

  const uploadingCount = images.filter(
    (i) => i.status === "uploading" || i.status === "queued",
  ).length;

  return (
    <div
      className={cn(
        "relative mx-auto w-full",
        compact ? "max-w-full" : "max-w-3xl",
      )}
    >
      <Reveal>
        <div
          className={cn(
            "rounded-3xl border border-[#E8E4DE] bg-white",
            "shadow-[0_24px_60px_-30px_rgba(43,43,43,0.18)]",
            compact ? "p-4 sm:p-6 md:p-7" : "p-4 sm:p-7 md:p-10 lg:p-12",
          )}
        >
          {/* Header */}
          <div className="text-center">
            <span className="smallcaps-label">Get a Free Quote</span>
            <h2 className="mt-3 font-serif text-2xl font-semibold text-[#2B2B2B] sm:text-3xl md:text-[2.2rem]">
              Real photos. Real review. Real pricing.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#6B6258] sm:text-base">
              Show us the space — a few clear photos help our team quote
              accurately. We&rsquo;ll review and reply on WhatsApp, usually
              within a few hours.
            </p>
          </div>

          {/* Step indicator */}
          <StepIndicator currentStep={step} />

          {/* Honeypot — visually hidden, but real (not `display:none`) */}
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="company_url">Company URL (leave empty)</label>
            <input
              id="company_url"
              name="company_url"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {/* Steps */}
          <form onSubmit={onSubmit} noValidate className="mt-6">
            <AnimatePresence mode="wait" initial={false}>
              {step === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: reduce ? 0 : 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: reduce ? 0 : -24 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-5"
                >
                  <Field label="Full Name" required error={formState.errors.fullName?.message}>
                    <Input
                      id="q-name"
                      placeholder="e.g. Arjun Patel"
                      autoComplete="name"
                      {...register("fullName")}
                      aria-invalid={!!formState.errors.fullName}
                      className="bg-white border-[#E8E4DE] focus-visible:border-[#B8894F] focus-visible:ring-[#B8894F]/30"
                    />
                  </Field>

                  <Field
                    label="Phone Number"
                    hint="Optional — for a callback if needed."
                    error={formState.errors.phone?.message}
                  >
                    <Input
                      id="q-phone"
                      type="tel"
                      placeholder="e.g. +91 9XXXXX XXXXX"
                      autoComplete="tel"
                      {...register("phone")}
                      className="bg-white border-[#E8E4DE] focus-visible:border-[#B8894F] focus-visible:ring-[#B8894F]/30"
                    />
                  </Field>

                  <StepNav
                    onNext={goNext}
                    nextLabel="Continue"
                    icon={ArrowRight}
                  />
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: reduce ? 0 : 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: reduce ? 0 : -24 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-5"
                >
                  <Field
                    label="Service Type"
                    required
                    error={formState.errors.serviceType?.message}
                  >
                    <ControllerSelect form={form} />
                  </Field>

                  <Field
                    label="Project Description"
                    required
                    error={formState.errors.description?.message}
                  >
                    <Textarea
                      id="q-description"
                      rows={5}
                      placeholder="Describe what needs to be done — rooms, area size, materials, timeline, etc."
                      {...register("description")}
                      aria-invalid={!!formState.errors.description}
                      className="bg-white border-[#E8E4DE] focus-visible:border-[#B8894F] focus-visible:ring-[#B8894F]/30"
                    />
                  </Field>

                  <StepNav
                    onBack={goBack}
                    onNext={goNext}
                    nextLabel="Continue"
                    icon={ArrowRight}
                  />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: reduce ? 0 : 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: reduce ? 0 : -24 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-5"
                >
                  {/* Dropzone */}
                  <div
                    {...dropzone.getRootProps()}
                    className={cn(
                      "relative cursor-pointer rounded-2xl border-2 border-dashed transition-colors",
                      dropzone.isDragActive
                        ? "border-[#1FA654] bg-[#1FA654]/5"
                        : "border-[#D8CFC2] bg-[#FAF8F5] hover:border-[#B8894F]/60",
                      images.length >= MAX_IMAGES && "pointer-events-none opacity-60",
                    )}
                  >
                    <input {...dropzone.getInputProps()} />
                    <div className="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                        <UploadCloud className="h-6 w-6 text-[#B8894F]" strokeWidth={1.5} />
                      </span>
                      <p className="text-sm font-medium text-[#2B2B2B]">
                        {dropzone.isDragActive
                          ? "Drop your photos here…"
                          : "Drag & drop photos, or browse"}
                      </p>
                      <p className="text-xs text-[#6B6258]">
                        JPG, PNG, HEIC or WEBP — up to {MAX_IMAGES} images,
                        10MB each.
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          dropzone.open();
                        }}
                        className="btn-outline-bronze mt-2 text-xs"
                      >
                        <ImagePlus className="h-3.5 w-3.5" />
                        Browse files
                      </button>
                    </div>
                  </div>

                  {/* Thumbnails */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                      {images.map((img) => (
                        <Thumbnail
                          key={img.id}
                          image={img}
                          onRemove={() => removeImage(img.id)}
                          onRetry={() => retryImage(img.id)}
                        />
                      ))}
                    </div>
                  )}

                  {/* Micro-copy + progress hint */}
                  <p className="text-center text-xs text-[#6B6258]">
                    Show us the space — a few clear photos help our team quote
                    accurately.
                  </p>
                  {uploadingCount > 0 && (
                    <p className="flex items-center justify-center gap-1.5 text-xs text-[#B8894F]">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      {uploadingCount} image{uploadingCount > 1 ? "s" : ""} still
                      uploading…
                    </p>
                  )}

                  {/* Review summary block */}
                  <div className="rounded-2xl border border-[#E8E4DE] bg-[#FAF8F5] p-4 sm:p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#B8894F]">
                      Review
                    </p>
                    <dl className="mt-3 space-y-1.5 text-sm">
                      <SummaryRow label="Name" value={values.fullName} />
                      <SummaryRow
                        label="Service"
                        value={values.serviceType}
                      />
                      <SummaryRow
                        label="Images"
                        value={`${images.filter((i) => i.status === "done").length}/${MAX_IMAGES} uploaded`}
                      />
                    </dl>
                  </div>

                  <StepNav
                    onBack={goBack}
                    nextType="submit"
                    nextLabel={
                      submitting
                        ? "Preparing WhatsApp…"
                        : "Send Quote via WhatsApp"
                    }
                    icon={submitting ? Loader2 : MessageCircle}
                    iconSpin={submitting}
                    nextDisabled={
                      submitting || images.filter((i) => i.status === "done").length === 0
                    }
                    nextClass="btn-whatsapp"
                    microcopy="One tap and you're chatting with our team on WhatsApp."
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </Reveal>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="mt-6 flex items-center justify-center">
      <div className="flex items-center gap-1 sm:gap-2">
        {STEPS.map((label, i) => {
          const isActive = i === currentStep;
          const isDone = i < currentStep;
          return (
            <div key={label} className="flex items-center">
              {i > 0 && (
                <span
                  aria-hidden
                  className={cn(
                    "h-px w-5 sm:w-10 md:w-12",
                    isDone || isActive ? "bg-[#B8894F]" : "bg-[#E8E4DE]",
                  )}
                />
              )}
              <div className="flex items-center gap-1 sm:gap-2">
                <span
                  className={cn(
                    "flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full text-[10px] sm:text-xs font-semibold transition-colors",
                    isDone
                      ? "bg-[#B8894F] text-white"
                      : isActive
                        ? "bg-[#B8894F] text-white"
                        : "bg-[#E8E4DE] text-[#6B6258]",
                  )}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  ) : (
                    i + 1
                  )}
                </span>
                <span
                  className={cn(
                    "text-[10px] sm:text-xs font-medium uppercase tracking-[0.08em] sm:tracking-[0.16em] transition-colors whitespace-nowrap",
                    isActive ? "text-[#2B2B2B]" : "text-[#6B6258]",
                  )}
                >
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-2 block text-sm font-medium text-[#2B2B2B]">
        {label}
        {required && <span className="ml-0.5 text-[#C1704D]">*</span>}
      </Label>
      {children}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-[#6B6258]">{hint}</p>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-[#C1704D]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function StepNav({
  onBack,
  onNext,
  nextLabel,
  nextType = "button",
  icon: Icon,
  iconSpin,
  nextDisabled,
  nextClass = "btn-bronze",
  microcopy,
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel: string;
  nextType?: "button" | "submit";
  icon?: React.ComponentType<{ className?: string }>;
  iconSpin?: boolean;
  nextDisabled?: boolean;
  nextClass?: string;
  microcopy?: string;
}) {
  return (
    <div className="flex flex-col gap-3 pt-1">
      <div className="flex flex-col-reverse items-center gap-3 sm:flex-row sm:justify-between">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6B6258] transition-colors hover:text-[#2B2B2B]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        ) : (
          <span aria-hidden />
        )}
        {nextType === "submit" ? (
          <button
            type="submit"
            disabled={nextDisabled}
            className={cn(nextClass, "w-full sm:w-auto")}
          >
            {Icon && <Icon className={cn("h-5 w-5", iconSpin && "animate-spin")} />}
            {nextLabel}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled}
            className={cn(nextClass, "w-full sm:w-auto")}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {nextLabel}
          </button>
        )}
      </div>
      {microcopy && (
        <p className="text-center text-xs text-[#6B6258] sm:text-right">
          {microcopy}
        </p>
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-[#6B6258]">{label}</dt>
      <dd className="text-right text-[#2B2B2B]">
        {value?.trim() ? value : "—"}
      </dd>
    </div>
  );
}

function Thumbnail({
  image,
  onRemove,
  onRetry,
}: {
  image: UploadedImage;
  onRemove: () => void;
  onRetry: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group relative aspect-square overflow-hidden rounded-xl border border-[#E8E4DE] bg-[#FAF8F5]"
    >
      <img
        src={image.previewUrl}
        alt="Reference photo preview"
        loading="lazy"
        className="h-full w-full object-cover"
      />

      {/* Status overlay */}
      {(image.status === "uploading" || image.status === "queued") && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/70 backdrop-blur-sm">
          <Loader2 className="h-4 w-4 animate-spin text-[#B8894F]" />
          <div className="h-1 w-3/4 overflow-hidden rounded-full bg-[#E8E4DE]">
            <div
              className="h-full bg-[#B8894F] transition-[width] duration-200"
              style={{ width: `${image.progress}%` }}
            />
          </div>
          <span className="text-[10px] font-medium text-[#2B2B2B]">
            {image.progress}%
          </span>
        </div>
      )}

      {image.status === "done" && (
        <div className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#1FA654] text-white shadow">
          <CheckCircle2 className="h-3.5 w-3.5" />
        </div>
      )}

      {image.status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-white/85 p-1 text-center backdrop-blur-sm">
          <span className="text-[10px] font-medium text-[#C1704D]">Failed</span>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full bg-[#B8894F] px-2 py-0.5 text-[10px] font-medium text-white hover:bg-[#a4763e]"
          >
            Retry
          </button>
        </div>
      )}

      {/* Remove button */}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove image"
        className="absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/85 text-[#2B2B2B] shadow backdrop-blur-sm transition-colors hover:bg-[#C1704D] hover:text-white"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}

function SuccessState({
  compact,
  onReset,
}: {
  compact?: boolean;
  onReset: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <div
      className={cn(
        "relative mx-auto w-full",
        compact ? "max-w-full" : "max-w-3xl",
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: reduce ? 0 : 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "rounded-3xl border border-[#E8E4DE] bg-white",
          "shadow-[0_24px_60px_-30px_rgba(43,43,43,0.18)]",
          compact ? "p-8" : "p-10 sm:p-14 md:p-16",
        )}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <motion.span
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.55,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1FA654]/12 text-[#1FA654]"
          >
            <CheckCircle2 className="h-8 w-8" />
          </motion.span>

          <h3 className="mt-5 font-serif text-2xl font-semibold text-[#2B2B2B] sm:text-3xl">
            Your quote request is ready
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#6B6258] sm:text-base">
            We&rsquo;ve prepared your message — just hit{" "}
            <strong className="font-semibold text-[#1FA654]">Send</strong>{" "}
            inside WhatsApp to reach our team instantly.
          </p>

          <p className="mt-4 max-w-md text-xs text-[#6B6258]">
            WhatsApp should have opened in a new tab. If it didn&rsquo;t, make
            sure pop-ups are allowed, then tap the button below.
          </p>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              "Hi Urban Homes! I'd like a quote for a project.",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp mt-7"
          >
            <MessageCircle className="h-5 w-5" />
            Open WhatsApp
          </a>

          <button
            type="button"
            onClick={onReset}
            className="link-underline mt-5 text-sm font-medium text-[#B8894F]"
          >
            Send another request
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- ControllerSelect wrapper (shadcn Select needs Controller) ---------- */

import { Controller } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";

function ControllerSelect({
  form,
}: {
  form: UseFormReturn<QuoteFormValues>;
}) {
  return (
    <Controller
      control={form.control}
      name="serviceType"
      render={({ field }) => (
        <Select
          value={field.value}
          onValueChange={field.onChange}
          name={field.name}
        >
          <SelectTrigger
            id="q-service"
            className="bg-white border-[#E8E4DE] focus-visible:border-[#B8894F] focus-visible:ring-[#B8894F]/30"
            aria-label="Service type"
          >
            <SelectValue placeholder="Choose a service" />
          </SelectTrigger>
          <SelectContent className="bg-white border-[#E8E4DE]">
            {SERVICE_OPTIONS.map((s) => (
              <SelectItem key={s} value={s} className="text-[#2B2B2B]">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}
