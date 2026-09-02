/**
 * Cloudinary unsigned upload helper (frontend-only).
 *
 * Reads `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and
 * `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` from env. If they're missing or
 * empty, `uploadToCloudinary` throws a friendly error so the UI can fall
 * back to letting the user send the WhatsApp message without images.
 *
 * Free-tier docs:
 * https://cloudinary.com/documentation/upload_images#unsigned_upload
 */

export type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
};

export type UploadProgress = (percent: number) => void;

export const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
export const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "";

export function isCloudinaryConfigured(): boolean {
  return (
    typeof CLOUDINARY_CLOUD_NAME === "string" &&
    CLOUDINARY_CLOUD_NAME.length > 0 &&
    typeof CLOUDINARY_UPLOAD_PRESET === "string" &&
    CLOUDINARY_UPLOAD_PRESET.length > 0
  );
}

/**
 * Read a File as a base64 data URL — used by the upload helper to attach
 * the file to the multipart form.
 */
function readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Compress + resize an image client-side before upload (max 1600px on the
 * long edge, JPEG quality 0.82). This keeps uploads fast and Cloudinary
 * storage small. Returns a new File.
 */
export async function compressImage(file: File, maxEdge = 1600): Promise<File> {
  try {
    if (!file.type.startsWith("image/")) return file;
    // HEIC can't be decoded by canvas reliably across browsers — skip
    // compression for it; Cloudinary will optimize on its side.
    if (file.type === "image/heic" || file.type === "image/heif") return file;

    const bitmap = await createImageBitmap(file);
    const ratio = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const targetW = Math.round(bitmap.width * ratio);
    const targetH = Math.round(bitmap.height * ratio);

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, targetW, targetH);
    bitmap.close?.();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.82),
    );
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.(heic|heif|png|webp)$/i, ".jpg"), {
      type: "image/jpeg",
    });
  } catch {
    // If anything goes wrong, send the original file — Cloudinary can handle it.
    return file;
  }
}

/**
 * Upload a single image to Cloudinary via unsigned POST.
 * Reports progress via the `onProgress` callback (0–100).
 *
 * Uses XHR so we get real upload progress events (fetch() can't).
 */
export function uploadToCloudinary(
  file: File,
  onProgress?: UploadProgress,
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      reject(
        new Error(
          "Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your .env file to enable image uploads.",
        ),
      );
      return;
    }

    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    // Ask Cloudinary to auto-optimize + limit max width to keep files light.
    fd.append("flags", "immutable_cache");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const pct = Math.round((event.loaded / event.total) * 100);
        onProgress(pct);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const json = JSON.parse(xhr.responseText) as CloudinaryUploadResult;
          resolve(json);
        } catch (err) {
          reject(new Error("Invalid response from Cloudinary."));
        }
      } else {
        let msg = `Upload failed (${xhr.status})`;
        try {
          const j = JSON.parse(xhr.responseText);
          if (j?.error?.message) msg = j.error.message;
        } catch {
          /* ignore */
        }
        reject(new Error(msg));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.onabort = () => reject(new Error("Upload aborted."));
    xhr.send(fd);
  });
}

/**
 * Build the pre-filled WhatsApp message that the user will review and send.
 *
 * Format (matches the brief):
 *
 *   Hi! I'd like a quote for a project.
 *
 *   Name: [Full Name]
 *   Service: [Service Type]
 *   Phone: [Phone or "—"]
 *   Details: [Project Description]
 *
 *   Reference Images:
 *   [Cloudinary Image Link 1]
 *   [Cloudinary Image Link 2]
 */
export function buildWhatsAppMessage(opts: {
  name: string;
  serviceType: string;
  phone?: string;
  description: string;
  imageUrls: string[];
}): string {
  const lines = [
    "Hi! I'd like a quote for a project.",
    "",
    `Name: ${opts.name.trim()}`,
    `Service: ${opts.serviceType}`,
    `Phone: ${opts.phone?.trim() ? opts.phone.trim() : "—"}`,
    `Details: ${opts.description.trim()}`,
    "",
    "Reference Images:",
  ];
  if (opts.imageUrls.length > 0) {
    opts.imageUrls.forEach((u, i) => lines.push(`${i + 1}. ${u}`));
  } else {
    lines.push("(no images uploaded)");
  }
  return lines.join("\n");
}

/**
 * Build a wa.me URL with the URL-encoded message.
 * `number` is in international format, no `+`, no spaces (e.g. "919343815319").
 */
export function buildWhatsAppUrl(
  number: string,
  message: string,
): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
