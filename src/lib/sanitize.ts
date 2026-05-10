import DOMPurify from "dompurify";

export function sanitizeHTML(dirty: string): string {
  if (typeof window !== "undefined") {
    return DOMPurify.sanitize(dirty);
  }
  // Server-side fallback: basic HTML tag stripping
  return dirty.replace(/<[^>]*>/g, "");
}
