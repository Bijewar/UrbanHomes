import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";
// The quote flow has no upper bound on time (file writes + email sending).
export const dynamic = "force-dynamic";

/* ===================================================================== */
/* Paths                                                                 */
/* ===================================================================== */

const PROJECT_ROOT = "/home/z/my-project";
const PUBLIC_QUOTES_DIR = path.join(PROJECT_ROOT, "public", "quotes");
const DOWNLOAD_QUOTES_DIR = path.join(PROJECT_ROOT, "download", "quotes");

/* ===================================================================== */
/* Validation schema                                                      */
/* ===================================================================== */

const SERVICE_OPTIONS = [
  "Civil Engineering",
  "Architecture & Design",
  "Painting & Finishing",
  "Other",
] as const;

const quoteSchema = z.object({
  fullName: z.string().min(2, "Full name is required (min 2 chars)."),
  email: z.string().email("A valid email is required."),
  phone: z.string().optional(),
  contactTime: z.string().optional(),
  serviceType: z.enum(SERVICE_OPTIONS, {
    errorMap: () => ({ message: "Please choose a service type." }),
  }),
  location: z.string().optional(),
  description: z
    .string()
    .min(20, "Project description must be at least 20 characters."),
  company_url: z.string().optional(), // honeypot — must be blank
  images: z.array(z.instanceof(File)).max(5, "Maximum 5 images."),
});

type QuotePayload = z.infer<typeof quoteSchema>;

/* ===================================================================== */
/* Helpers                                                                */
/* ===================================================================== */

/** Map a File's MIME type to a sensible extension. */
function extForFile(file: File): string {
  const mimeMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/heic": "heic",
    "image/webp": "webp",
  };
  if (file.type && mimeMap[file.type]) return mimeMap[file.type];
  const dot = (file.name || "").lastIndexOf(".");
  if (dot > 0) return file.name.slice(dot + 1).toLowerCase() || "jpg";
  return "jpg";
}

function nowStamp(): string {
  const d = new Date();
  return (
    `${d.getFullYear()}` +
    `${String(d.getMonth() + 1).padStart(2, "0")}` +
    `${String(d.getDate()).padStart(2, "0")}` +
    `-` +
    `${String(d.getHours()).padStart(2, "0")}` +
    `${String(d.getMinutes()).padStart(2, "0")}` +
    `${String(d.getSeconds()).padStart(2, "0")}`
  );
}

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

/* ===================================================================== */
/* POST /api/quote                                                        */
/* ===================================================================== */

export async function POST(req: Request): Promise<Response> {
  try {
    /* ---------- Parse multipart form data ---------- */

    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      return NextResponse.json(
        { error: "Expected multipart/form-data." },
        { status: 400 },
      );
    }

    /* ---------- Pull fields + honeypot ---------- */

    const fullName = String(form.get("fullName") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const contactTime =
      String(form.get("contactTime") ?? "").trim() || undefined;
    const serviceType = String(form.get("serviceType") ?? "").trim();
    const location = String(form.get("location") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const company_url = String(form.get("company_url") ?? "").trim();

    /* ---------- Pull images ---------- */

    const rawImages = form
      .getAll("images")
      .filter((v): v is File => v instanceof File);
    // Cap at 5 — defensive (dropzone already enforces client-side).
    const images = rawImages.slice(0, 5);

    /* ---------- Honeypot — silently succeed ---------- */

    if (company_url.length > 0) {
      console.warn("[quote] honeypot triggered — silently succeeding.");
      return NextResponse.json({ ok: true, spam: true });
    }

    /* ---------- Validate ---------- */

    const parsed = quoteSchema.safeParse({
      fullName,
      email,
      phone: phone || undefined,
      contactTime,
      serviceType,
      location,
      description,
      company_url,
      images,
    });

    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return NextResponse.json(
        { error: first?.message ?? "Please review the highlighted fields." },
        { status: 400 },
      );
    }
    const data: QuotePayload = parsed.data;

    /* ---------- Enforce per-file size cap (10MB) ---------- */

    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    for (const f of data.images) {
      if (f.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `Image "${f.name}" exceeds the 10MB limit.` },
          { status: 400 },
        );
      }
    }

    /* ---------- Ensure dirs exist ---------- */

    await ensureDir(PUBLIC_QUOTES_DIR);
    await ensureDir(DOWNLOAD_QUOTES_DIR);

    /* ---------- Save images to /public/quotes ---------- */

    const stamp = nowStamp();
    const savedFiles: {
      filename: string;
      relativeUrl: string;
      originalName: string;
      size: number;
    }[] = [];

    for (const f of data.images) {
      const ext = extForFile(f);
      const rand = crypto.randomUUID().split("-")[0];
      const filename = `${stamp}-${rand}.${ext}`;
      const filePath = path.join(PUBLIC_QUOTES_DIR, filename);
      const bytes = Buffer.from(await f.arrayBuffer());
      await fs.writeFile(filePath, bytes);
      savedFiles.push({
        filename,
        relativeUrl: `/quotes/${filename}`,
        originalName: f.name,
        size: f.size,
      });
    }

    /* =================================================================== */
    /* Email payloads                                                        */
    /*                                                                     */
    /* TODO: integrate real SMTP transport.                                 */
    /* The sandbox has no SMTP credentials — for now we write .eml-style   */
    /* text files to /home/z/my-project/download/quotes/ AND log to         */
    /* console. In production, swap this block for SendGrid / Resend /      */
    /* Nodemailer. The payload structure below already matches the shape   */
    /* most SMTP libraries expect (to / from / subject / text / html /     */
    /* replyTo).                                                            */
    /* =================================================================== */

    const submissionId = `${stamp}-${crypto.randomUUID().slice(0, 8)}`;
    const replyMailto = `mailto:${encodeURIComponent(
      data.email,
    )}?subject=${encodeURIComponent(
      `Re: Your quote request — ${data.serviceType}`,
    )}`;

    const imageListText = savedFiles
      .map(
        (s) =>
          `• ${s.originalName} → /quotes/${s.filename} (${(
            s.size / 1024
          ).toFixed(1)} KB)`,
      )
      .join("\n");

    const imageListHtml = savedFiles
      .map(
        (s) =>
          `<li><a href="${s.relativeUrl}">${escapeHtml(
            s.originalName,
          )}</a> — ${s.relativeUrl} (${(s.size / 1024).toFixed(1)} KB)</li>`,
      )
      .join("");

    /* ----- Email #1 — to admin ----- */
    const adminEmail = {
      to: "studio@maisonstudio.example",
      replyTo: data.email,
      subject: `New quote request — ${data.serviceType} — ${data.fullName}`,
      text: [
        `New quote request received at ${new Date().toISOString()}`,
        ``,
        `Customer details`,
        `-------------`,
        `Name:           ${data.fullName}`,
        `Email:          ${data.email}`,
        `Phone:          ${data.phone || "—"}`,
        `Contact time:   ${data.contactTime ?? "Anytime"}`,
        ``,
        `Project details`,
        `---------------`,
        `Service type:   ${data.serviceType}`,
        `Location:       ${data.location || "—"}`,
        `Description:`,
        data.description,
        ``,
        `Uploaded images (${savedFiles.length})`,
        `-----------------`,
        imageListText || "—",
        ``,
        `View images at:`,
        savedFiles.map((s) => s.relativeUrl).join("\n") || "—",
        ``,
        `Reply to customer: ${replyMailto}`,
        ``,
        `Submission ID: ${submissionId}`,
      ].join("\n"),
      html: `
        <div style="font-family: Georgia, serif; color:#2B2B2B;">
          <h2 style="color:#B8894F;">New quote request — ${escapeHtml(data.serviceType)}</h2>
          <p style="color:#6B6258;">Received ${new Date().toISOString()} · Submission #${escapeHtml(submissionId)}</p>

          <h3 style="margin-top:24px;">Customer details</h3>
          <table cellpadding="6" style="border-collapse:collapse;font-family:Inter,Arial,sans-serif;font-size:14px;">
            <tr><td style="color:#6B6258;">Name</td><td>${escapeHtml(data.fullName)}</td></tr>
            <tr><td style="color:#6B6258;">Email</td><td><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
            <tr><td style="color:#6B6258;">Phone</td><td>${escapeHtml(data.phone || "—")}</td></tr>
            <tr><td style="color:#6B6258;">Preferred contact time</td><td>${escapeHtml(data.contactTime ?? "Anytime")}</td></tr>
          </table>

          <h3 style="margin-top:24px;">Project details</h3>
          <table cellpadding="6" style="border-collapse:collapse;font-family:Inter,Arial,sans-serif;font-size:14px;">
            <tr><td style="color:#6B6258;">Service type</td><td>${escapeHtml(data.serviceType)}</td></tr>
            <tr><td style="color:#6B6258;">Location</td><td>${escapeHtml(data.location || "—")}</td></tr>
          </table>
          <p style="font-family:Inter,Arial,sans-serif;font-size:14px;white-space:pre-wrap;">${escapeHtml(data.description)}</p>

          <h3 style="margin-top:24px;">Uploaded images (${savedFiles.length})</h3>
          <ul style="font-family:Inter,Arial,sans-serif;font-size:14px;padding-left:18px;">
            ${imageListHtml || "<li>—</li>"}
          </ul>

          <p style="margin-top:24px;font-family:Inter,Arial,sans-serif;font-size:13px;">
            <a href="${escapeHtml(replyMailto)}" style="background:#B8894F;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none;">
              Reply to customer
            </a>
          </p>
        </div>
      `,
    };

    /* ----- Email #2 — auto-reply to user (NO PRICE) ----- */
    const firstName = data.fullName.split(" ")[0] || "there";
    const userEmail = {
      to: data.email,
      from: "Maison Studio <studio@maisonstudio.example>",
      subject: "We've received your request!",
      text: [
        `Hi ${firstName},`,
        ``,
        `Thank you for sharing your project details with Maison Studio.`,
        `Our team is reviewing your photos and description and will send a`,
        `detailed, accurate quote within 24–48 hours.`,
        ``,
        `Questions? Call us at +91 98765 43210 or reply to this email.`,
        ``,
        `Warm regards,`,
        `The Maison Studio team`,
      ].join("\n"),
      html: `
        <div style="font-family: Georgia, serif; color:#2B2B2B; max-width:560px;">
          <h2 style="color:#B8894F;">We've received your request!</h2>
          <p style="font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.6;color:#2B2B2B;">
            Hi ${escapeHtml(firstName)},
          </p>
          <p style="font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.6;color:#2B2B2B;">
            Thank you for sharing your project details with Maison Studio.
            Our team is reviewing your photos and description and will send a
            detailed, accurate quote within 24–48 hours.
          </p>
          <p style="font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.6;color:#2B2B2B;">
            Questions? Call us at <strong>+91 98765 43210</strong> or reply to this email.
          </p>
          <p style="font-family:Inter,Arial,sans-serif;font-size:14px;color:#6B6258;margin-top:28px;">
            Warm regards,<br/>
            The Maison Studio team
          </p>
        </div>
      `,
    };

    /* ---------- Write .eml-style payloads to disk + log ---------- */

    const adminEmlPath = path.join(
      DOWNLOAD_QUOTES_DIR,
      `${submissionId}-admin.eml.txt`,
    );
    const userEmlPath = path.join(
      DOWNLOAD_QUOTES_DIR,
      `${submissionId}-user.eml.txt`,
    );
    const recordPath = path.join(DOWNLOAD_QUOTES_DIR, `${submissionId}.json`);

    await fs.writeFile(
      adminEmlPath,
      `From: ${adminEmail.to}\nReply-To: ${adminEmail.replyTo}\nSubject: ${adminEmail.subject}\nDate: ${new Date().toUTCString()}\n\n${adminEmail.text}\n\n----- HTML -----\n${adminEmail.html}\n`,
      "utf8",
    );

    await fs.writeFile(
      userEmlPath,
      `To: ${userEmail.to}\nFrom: ${userEmail.from}\nSubject: ${userEmail.subject}\nDate: ${new Date().toUTCString()}\n\n${userEmail.text}\n\n----- HTML -----\n${userEmail.html}\n`,
      "utf8",
    );

    const record = {
      submissionId,
      receivedAt: new Date().toISOString(),
      customer: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || null,
        contactTime: data.contactTime ?? null,
      },
      project: {
        serviceType: data.serviceType,
        location: data.location || null,
        description: data.description,
      },
      images: savedFiles.map((s) => ({
        filename: s.filename,
        relativeUrl: s.relativeUrl,
        originalName: s.originalName,
        size: s.size,
      })),
      emails: {
        admin: { path: adminEmlPath, subject: adminEmail.subject },
        user: { path: userEmlPath, subject: userEmail.subject },
      },
    };
    await fs.writeFile(recordPath, JSON.stringify(record, null, 2), "utf8");

    console.log("=".repeat(64));
    console.log(`[quote] New submission ${submissionId}`);
    console.log(`  Customer: ${data.fullName} <${data.email}>`);
    console.log(`  Service:  ${data.serviceType}`);
    console.log(
      `  Images:   ${savedFiles.length} file(s) saved to ${PUBLIC_QUOTES_DIR}`,
    );
    console.log(`  Admin email written: ${adminEmlPath}`);
    console.log(`  User email written:  ${userEmlPath}`);
    console.log(`  Record written:      ${recordPath}`);
    console.log("=".repeat(64));
    console.log("[admin email]\n" + adminEmail.text);
    console.log("-".repeat(64));
    console.log("[user email]\n" + userEmail.text);
    console.log("=".repeat(64));

    /* ---------- Respond ---------- */

    return NextResponse.json({ ok: true, submissionId });
  } catch (err) {
    console.error("[quote] handler error:", err);
    return NextResponse.json(
      { error: "Something went wrong while sending your request." },
      { status: 500 },
    );
  }
}

/* ---------- Tiny HTML-escaping helper ---------- */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
