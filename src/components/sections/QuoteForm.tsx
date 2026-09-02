"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useDropzone, type FileRejection } from "react-dropzone";
import {
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Pencil,
  UploadCloud,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

/* ---------- Constants ---------- */

const SERVICE_OPTIONS = [
  "Civil Engineering",
  "Architecture & Design",
  "Painting & Finishing",
  "Other",
] as const;
type ServiceType = (typeof SERVICE_OPTIONS)[number];

const CONTACT_TIMES = ["Morning", "Afternoon", "Evening"] as const;
type ContactTime = (typeof CONTACT_TIMES)[number];

const STEPS = ["Contact", "Project", "Photos", "Review"] as const;
const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/* ---------- Validation schema ---------- */

const quoteSchema = z.object({
  fullName: z
    .string()
    .min(2, "Please enter your full name (at least 2 characters)."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  contactTime: z.enum(CONTACT_TIMES).optional(),
  serviceType: z.enum(SERVICE_OPTIONS, {
    errorMap: () => ({ message: "Please select a service." }),
  }),
  location: z.string().optional(),
  description: z
    .string()
    .min(20, "Please add a bit more detail (at least 20 characters)."),
  images: z
    .array(z.instanceof(File))
    .min(1, "Please upload at least one photo of the space."),
  company_url: z.string().optional(), // honeypot — must stay blank
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

/* ---------- Local uploaded image type ---------- */

type UploadedImage = {
  id: string;
  file: File;
  preview: string;
  progress: number; // 0..100 (simulated)
};

/* ---------- Props ---------- */

interface QuoteFormProps {
  /** Render at a slightly smaller scale — used inside the floating-button Sheet. */
  compact?: boolean;
  /** Called after a successful submission (useful to auto-close the sheet). */
  onSubmitted?: () => void;
}

/* ===================================================================== */
/* Component                                                              */
/* ===================================================================== */

export default function QuoteForm({
  compact = false,
  onSubmitted,
}: QuoteFormProps) {
  const { toast } = useToast();
  const reduce = useReducedMotion();

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const timersRef = useRef<ReturnType<typeof setInterval>[]>([]);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    control,
    reset,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      contactTime: undefined,
      serviceType: undefined,
      location: "",
      description: "",
      images: [],
      company_url: "",
    },
    mode: "onChange",
  });

  /* ---------- Dropzone ---------- */

  const onDrop = useCallback(
    (accepted: File[], rejections: FileRejection[]) => {
      if (rejections.length > 0) {
        const first = rejections[0];
        const tooBig = first.errors.find((e) => e.code === "file-too-large");
        if (tooBig) {
          toast({
            title: "File too large",
            description: "Each image must be 10MB or less.",
            variant: "destructive",
          });
        }
      }
      const remaining = MAX_IMAGES - images.length;
      if (remaining <= 0) {
        toast({
          title: "Maximum 5 images",
          description: "Remove an existing image to add more.",
          variant: "destructive",
        });
        return;
      }
      const toAdd = accepted.slice(0, remaining);
      if (accepted.length > remaining) {
        toast({
          title: "Maximum 5 images",
          description: "Only the first 5 were added.",
        });
      }
      toAdd.forEach((file) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const preview = URL.createObjectURL(file);
        const newImg: UploadedImage = { id, file, preview, progress: 0 };
        setImages((prev) => [...prev, newImg]);
        // Simulated upload progress bar (animate 0 -> 100 over ~800ms)
        let p = 0;
        const interval = setInterval(() => {
          p += 14 + Math.random() * 14;
          if (p >= 100) {
            p = 100;
            clearInterval(interval);
            const idx = timersRef.current.indexOf(interval);
            if (idx >= 0) timersRef.current.splice(idx, 1);
          }
          setImages((prev) =>
            prev.map((img) =>
              img.id === id ? { ...img, progress: p } : img
            ),
          );
        }, 100);
        timersRef.current.push(interval);
      });
    },
    [images.length, toast],
  );

  const { getRootProps, getInputProps, isDragActive, open: openDialog } =
    useDropzone({
      onDrop,
      accept: {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/heic": [".heic"],
        "image/webp": [".webp"],
      },
      maxSize: MAX_FILE_SIZE,
      maxFiles: MAX_IMAGES,
      noClick: true,
      noKeyboard: true,
    });

  /* ---------- Sync images -> RHF ---------- */

  useEffect(() => {
    setValue("images", images.map((img) => img.file), {
      shouldValidate: step === 2,
      shouldDirty: true,
    });
  }, [images, setValue, step]);

  /* ---------- Cleanup on unmount ---------- */

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearInterval(t));
      timersRef.current = [];
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, []);

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((img) => img.id !== id);
    });
  };

  /* ---------- Step navigation ---------- */

  const handleContinue = async () => {
    let valid = true;
    if (step === 0) {
      valid = await trigger(["fullName", "email"]);
    } else if (step === 1) {
      valid = await trigger(["serviceType", "description"]);
    } else if (step === 2) {
      valid = await trigger(["images"]);
    }
    if (valid) {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));
  const jumpToStep = (target: number) => setStep(target);

  /* ---------- Submit ---------- */

  const onSubmit = async (data: QuoteFormValues) => {
    // Honeypot — silently succeed without sending any email
    if (data.company_url) {
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
        setShowCheck(true);
        setTimeout(() => {
          setSubmitted(true);
          setShowCheck(false);
          onSubmitted?.();
        }, 1100);
      }, 600);
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      if (data.phone) formData.append("phone", data.phone);
      if (data.contactTime) formData.append("contactTime", data.contactTime);
      formData.append("serviceType", data.serviceType);
      if (data.location) formData.append("location", data.location);
      formData.append("description", data.description);
      formData.append("company_url", data.company_url ?? "");
      images.forEach((img) => {
        formData.append("images", img.file, img.file.name);
      });

      const res = await fetch("/api/quote", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errJson = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(
          errJson?.error ?? "Something went wrong. Please try again.",
        );
      }

      setSubmitting(false);
      setShowCheck(true);
      setTimeout(() => {
        setSubmitted(true);
        setShowCheck(false);
        onSubmitted?.();
      }, 1100);
    } catch (err) {
      setSubmitting(false);
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      toast({
        title: "Could not send request",
        description: message,
        variant: "destructive",
      });
    }
  };

  /* ---------- Reset ---------- */

  const resetForm = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    reset();
    setStep(0);
    setSubmitted(false);
    setShowCheck(false);
    setSubmitting(false);
  };

  /* ---------- Watch for the Review step ---------- */

  const watched = watch();

  /* ---------- Derived ---------- */

  const stepVariants = {
    enter: (direction: number) => ({
      x: reduce ? 0 : direction > 0 ? 28 : -28,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: reduce ? 0 : direction > 0 ? -28 : 28,
      opacity: 0,
    }),
  };

  const cardClasses = cn(
    "bg-white rounded-3xl border border-[#E8E4DE] shadow-[0_24px_60px_-30px_rgba(43,43,43,0.18)] mx-auto",
    compact ? "w-full p-6 sm:p-7" : "max-w-3xl p-8 md:p-12",
  );

  const headerBlock = (
    <div className={cn("text-center", compact ? "mb-6" : "mb-10")}>
      <span className="smallcaps-label">Request a Quote</span>
      <h2 className="mt-3 font-serif text-[#2B2B2B] text-balance text-2xl md:text-4xl">
        Real photos. Real review. Real pricing.
      </h2>
      <div className="hairline mx-auto my-5 w-20" />
      <p className="mx-auto max-w-xl text-sm leading-relaxed text-[#6B6258] md:text-base">
        Show us the space — a few clear photos help our team give you the most
        accurate quote. No instant estimates, just a thoughtful one within
        24–48 hours.
      </p>
    </div>
  );

  const formContent = (
    <div className={cardClasses}>
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: reduce ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : -14 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center py-10 text-center"
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.05,
              }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
            >
              <CheckCircle2 className="h-9 w-9" />
            </motion.div>
            <h3 className="mt-6 font-serif text-2xl text-[#2B2B2B]">
              Thanks! Your request has been sent.
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#6B6258]">
              Check your email for confirmation — we&rsquo;ll follow up with
              your quote soon.
            </p>
            <button
              type="button"
              onClick={resetForm}
              className="link-underline mt-6 text-sm font-medium text-[#B8894F]"
            >
              Send another request
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Progress indicator */}
            <div className={cn(compact ? "mb-6" : "mb-10")}>
              <ol className="flex items-center">
                {STEPS.map((label, i) => (
                  <li
                    key={label}
                    className={cn(
                      "flex items-center",
                      i < STEPS.length - 1 ? "flex-1" : "",
                    )}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-500",
                          i === step &&
                            "border-[#B8894F] bg-[#B8894F] text-white shadow-[0_8px_18px_-8px_rgba(184,137,79,0.65)]",
                          i < step &&
                            "border-[#B8894F] bg-[#B8894F]/10 text-[#B8894F]",
                          i > step &&
                            "border-[#E8E4DE] bg-white text-[#6B6258]",
                        )}
                      >
                        {i < step ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          i + 1
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-[10px] uppercase tracking-[0.18em] font-semibold transition-colors duration-300",
                          i === step
                            ? "text-[#B8894F]"
                            : "text-[#6B6258]/80",
                        )}
                      >
                        {label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={cn(
                          "mx-2 h-px flex-1 transition-colors duration-500",
                          i < step ? "bg-[#B8894F]" : "bg-[#E8E4DE]",
                        )}
                      />
                    )}
                  </li>
                ))}
              </ol>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-6"
            >
              {/* Honeypot — visually hidden, real users won't fill this */}
              <div
                aria-hidden
                className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden opacity-0"
              >
                <label htmlFor="company_url">Website (leave blank)</label>
                <input
                  id="company_url"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register("company_url")}
                />
              </div>

              <AnimatePresence mode="wait" custom={1}>
                <motion.div
                  key={step}
                  custom={1}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: reduce ? 0.2 : 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {/* Step 1 — Contact Info */}
                  {step === 0 && (
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">
                          Full Name{" "}
                          <span className="text-[#B8894F]">*</span>
                        </Label>
                        <Input
                          id="fullName"
                          placeholder="Priya Menon"
                          aria-invalid={!!errors.fullName}
                          {...register("fullName")}
                        />
                        {errors.fullName && (
                          <p className="text-xs text-[#B3261E]">
                            {errors.fullName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">
                          Email{" "}
                          <span className="text-[#B8894F]">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="priya@example.com"
                          aria-invalid={!!errors.email}
                          {...register("email")}
                        />
                        {errors.email && (
                          <p className="text-xs text-[#B3261E]">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone (optional)</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          {...register("phone")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Preferred Contact Time (optional)</Label>
                        <Controller
                          control={control}
                          name="contactTime"
                          render={({ field }) => (
                            <RadioGroup
                              value={field.value ?? ""}
                              onValueChange={(val) =>
                                field.onChange(val || undefined)
                              }
                              className="grid grid-cols-3 gap-3 pt-1"
                            >
                              {CONTACT_TIMES.map((time) => (
                                <Label
                                  key={time}
                                  htmlFor={`ct-${time}`}
                                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#E8E4DE] p-3 text-sm transition-colors hover:border-[#B8894F]/60 hover:bg-[#FAF8F5] has-[:checked]:border-[#B8894F] has-[:checked]:bg-[#B8894F]/8"
                                >
                                  <RadioGroupItem id={`ct-${time}`} value={time} />
                                  <span className="text-[#2B2B2B]">{time}</span>
                                </Label>
                              ))}
                            </RadioGroup>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2 — Project Details */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="serviceType">
                          Service Type{" "}
                          <span className="text-[#B8894F]">*</span>
                        </Label>
                        <Controller
                          control={control}
                          name="serviceType"
                          render={({ field }) => (
                            <Select
                              value={field.value ?? ""}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger
                                id="serviceType"
                                className="w-full"
                                aria-invalid={!!errors.serviceType}
                              >
                                <SelectValue placeholder="Choose a service" />
                              </SelectTrigger>
                              <SelectContent>
                                {SERVICE_OPTIONS.map((opt) => (
                                  <SelectItem key={opt} value={opt}>
                                    {opt}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.serviceType && (
                          <p className="text-xs text-[#B3261E]">
                            {errors.serviceType.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">
                          Location / Site Address (optional)
                        </Label>
                        <Input
                          id="location"
                          placeholder="e.g. Indiranagar, Bangalore 560038"
                          {...register("location")}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">
                          Project Description{" "}
                          <span className="text-[#B8894F]">*</span>
                        </Label>
                        <Textarea
                          id="description"
                          rows={5}
                          placeholder="Rooms, area size, materials, timeline…"
                          aria-invalid={!!errors.description}
                          {...register("description")}
                        />
                        {errors.description && (
                          <p className="text-xs text-[#B3261E]">
                            {errors.description.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3 — Upload Photos */}
                  {step === 2 && (
                    <div className="space-y-4">
                      <div
                        {...getRootProps()}
                        className={cn(
                          "relative rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors duration-300",
                          isDragActive
                            ? "border-[#B8894F] bg-[#B8894F]/6"
                            : "border-[#E8E4DE] bg-[#FAF8F5]/40 hover:border-[#B8894F]/60",
                        )}
                      >
                        <input {...getInputProps()} />
                        <motion.div
                          animate={
                            isDragActive
                              ? { scale: 1.08, y: -2 }
                              : { scale: 1, y: 0 }
                          }
                          transition={{
                            duration: 0.3,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#B8894F]/10 text-[#B8894F]"
                        >
                          <UploadCloud className="h-7 w-7" />
                        </motion.div>
                        <p className="mt-4 font-serif text-lg text-[#2B2B2B]">
                          {isDragActive
                            ? "Drop your photos here…"
                            : "Drag & drop photos here"}
                        </p>
                        <p className="mt-1 text-sm text-[#6B6258]">
                          or{" "}
                          <button
                            type="button"
                            onClick={openDialog}
                            className="link-underline font-medium text-[#B8894F]"
                          >
                            browse files
                          </button>{" "}
                          from your device
                        </p>
                        <p className="mt-4 text-xs text-[#6B6258]/80">
                          JPG, PNG, HEIC or WEBP — up to 5 images, 10MB each.
                        </p>
                      </div>

                      {errors.images && (
                        <p className="text-xs text-[#B3261E]">
                          {errors.images.message as string}
                        </p>
                      )}

                      {images.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                          <AnimatePresence>
                            {images.map((img) => (
                              <motion.div
                                key={img.id}
                                layout
                                initial={{ opacity: 0, scale: 0.92 }}
                                animate={{
                                  opacity: 1,
                                  scale: img.progress >= 100 ? 1 : 0.96,
                                }}
                                exit={{ opacity: 0, scale: 0.92 }}
                                transition={{
                                  duration: 0.35,
                                  ease: [0.22, 1, 0.36, 1],
                                }}
                                className="group relative aspect-square overflow-hidden rounded-xl border border-[#E8E4DE] bg-[#F2EFE9]"
                              >
                                <img
                                  src={img.preview}
                                  alt={img.file.name}
                                  className="h-full w-full object-cover"
                                />
                                {/* progress overlay */}
                                {img.progress < 100 && (
                                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/35 backdrop-blur-[2px]">
                                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                                    <div className="h-1 w-3/4 overflow-hidden rounded-full bg-white/30">
                                      <motion.div
                                        className="h-full bg-white"
                                        animate={{ width: `${img.progress}%` }}
                                        transition={{ duration: 0.2 }}
                                      />
                                    </div>
                                  </div>
                                )}
                                {/* remove button */}
                                <button
                                  type="button"
                                  onClick={() => removeImage(img.id)}
                                  className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/85 text-[#2B2B2B] opacity-0 shadow-sm transition-opacity duration-200 hover:bg-white group-hover:opacity-100"
                                  aria-label={`Remove ${img.file.name}`}
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </motion.div>
                            ))}
                          </AnimatePresence>

                          {images.length < MAX_IMAGES && (
                            <button
                              type="button"
                              onClick={openDialog}
                              className="flex aspect-square items-center justify-center rounded-xl border border-dashed border-[#E8E4DE] text-[#6B6258] transition-colors hover:border-[#B8894F]/60 hover:text-[#B8894F]"
                              aria-label="Add more photos"
                            >
                              <ImagePlus className="h-6 w-6" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 4 — Review */}
                  {step === 3 && (
                    <div className="space-y-5">
                      {/* Contact */}
                      <ReviewGroup
                        title="Contact"
                        onEdit={() => jumpToStep(0)}
                      >
                        <ReviewRow label="Name" value={watched.fullName} />
                        <ReviewRow label="Email" value={watched.email} />
                        <ReviewRow
                          label="Phone"
                          value={watched.phone || "—"}
                        />
                        <ReviewRow
                          label="Contact time"
                          value={watched.contactTime ?? "Anytime"}
                        />
                      </ReviewGroup>

                      {/* Project */}
                      <ReviewGroup
                        title="Project"
                        onEdit={() => jumpToStep(1)}
                      >
                        <ReviewRow
                          label="Service"
                          value={watched.serviceType}
                        />
                        <ReviewRow
                          label="Location"
                          value={watched.location || "—"}
                        />
                        <ReviewRow
                          label="Description"
                          value={watched.description}
                          multiline
                        />
                      </ReviewGroup>

                      {/* Photos */}
                      <ReviewGroup
                        title={`Photos (${images.length})`}
                        onEdit={() => jumpToStep(2)}
                      >
                        {images.length === 0 ? (
                          <p className="text-sm text-[#6B6258]">No photos.</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {images.map((img) => (
                              <div
                                key={img.id}
                                className="relative h-16 w-16 overflow-hidden rounded-lg border border-[#E8E4DE] bg-[#F2EFE9]"
                              >
                                <img
                                  src={img.preview}
                                  alt={img.file.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </ReviewGroup>

                      <p className="rounded-xl bg-[#FAF8F5] p-3 text-xs leading-relaxed text-[#6B6258]">
                        By sending this request you agree to be contacted by
                        Maison Studio about your project. Your photos are used
                        only to prepare your quote.
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Nav buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                {step > 0 && !submitted ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn-outline-bronze inline-flex items-center gap-2 text-sm disabled:opacity-50"
                    disabled={submitting || showCheck}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                ) : (
                  <span aria-hidden />
                )}

                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="btn-bronze inline-flex items-center gap-2 text-sm"
                  >
                    Continue
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting || showCheck}
                    className="btn-bronze inline-flex min-w-44 items-center justify-center gap-2 text-sm disabled:cursor-not-allowed"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {submitting ? (
                        <motion.span
                          key="loading"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className="inline-flex items-center gap-2"
                        >
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending…
                        </motion.span>
                      ) : showCheck ? (
                        <motion.span
                          key="check"
                          initial={{ opacity: 0, scale: 0.6 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                          transition={{
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="inline-flex items-center gap-2 text-emerald-50"
                        >
                          <CheckCircle2 className="h-5 w-5 text-emerald-200" />
                          Sent
                        </motion.span>
                      ) : (
                        <motion.span
                          key="text"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="inline-flex items-center gap-2"
                        >
                          Send My Request
                          <ArrowLeft className="h-4 w-4 rotate-180" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (compact) {
    return (
      <div className="w-full">
        {headerBlock}
        {formContent}
      </div>
    );
  }

  return (
    <section
      id="quote"
      className="scroll-mt-24 bg-[#FAF8F5] px-5 py-20 sm:px-8 md:py-28"
    >
      <div className="mx-auto max-w-3xl">
        <Reveal>{headerBlock}</Reveal>
        <Reveal delay={0.05}>{formContent}</Reveal>
      </div>
    </section>
  );
}

/* ---------- Small helpers ---------- */

function ReviewGroup({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#E8E4DE] bg-[#FAF8F5]/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-serif text-sm uppercase tracking-[0.18em] text-[#2B2B2B]">
          {title}
        </h4>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#B8894F] hover:underline"
        >
          <Pencil className="h-3 w-3" />
          Edit
        </button>
      </div>
      <dl className="space-y-2">{children}</dl>
    </div>
  );
}

function ReviewRow({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string | undefined;
  multiline?: boolean;
}) {
  const display = value && value.length > 0 ? value : "—";
  return (
    <div
      className={cn(
        "flex gap-3",
        multiline ? "flex-col" : "flex-row items-baseline",
      )}
    >
      <dt
        className={cn(
          "text-[11px] uppercase tracking-[0.18em] text-[#6B6258]/80",
          multiline ? "" : "w-28 shrink-0",
        )}
      >
        {label}
      </dt>
      <dd
        className={cn(
          "text-sm text-[#2B2B2B]",
          multiline && "max-h-32 overflow-y-auto whitespace-pre-wrap break-words",
        )}
      >
        {display}
      </dd>
    </div>
  );
}
