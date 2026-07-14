/** Folder used when uploading product / farm media. */
export const CLOUDINARY_FOLDER = "mushroom-farm";

/**
 * True when `src` is a Cloudinary public ID or a res.cloudinary.com URL.
 * Local paths (`/…`) and other remote URLs fall through to next/image.
 */
export function isCloudinarySrc(src: string | undefined | null): boolean {
  if (!src) return false;
  if (src.startsWith("/") || src.startsWith("data:") || src.startsWith("blob:")) {
    return false;
  }
  if (src.includes("res.cloudinary.com")) return true;
  // Public IDs look like "folder/asset" or "cld-sample-5" — no protocol
  if (!/^https?:\/\//i.test(src)) return true;
  return false;
}

/** Extract a Cloudinary public ID from a delivery URL, or return the src as-is. */
export function toCloudinaryPublicId(src: string): string {
  if (!src.includes("res.cloudinary.com")) return src;

  try {
    const pathname = new URL(src).pathname;
    // /<cloud>/image/upload[/transforms]/v123>/<public_id>.<ext>
    const match = pathname.match(/\/upload\/(?:(?:[^/]+\/)*?v\d+\/)?(.+)$/);
    if (!match?.[1]) return src;
    return match[1].replace(/\.[a-z0-9]+$/i, "");
  } catch {
    return src;
  }
}
