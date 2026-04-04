/**
 * Input sanitization utilities
 */
import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize HTML content to prevent XSS
 */
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // Strip all HTML tags
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize text input (removes HTML, trims whitespace)
 */
export function sanitizeText(input: string): string {
  return sanitizeHTML(input).trim();
}

/**
 * Sanitize email (lowercase, trim, remove HTML)
 */
export function sanitizeEmail(email: string): string {
  return sanitizeText(email).toLowerCase();
}

/**
 * Sanitize rich text (allows safe HTML tags)
 */
export function sanitizeRichText(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
}

/**
 * Sanitize object with string values
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };
  for (const key in sanitized) {
    if (typeof sanitized[key] === "string") {
      sanitized[key] = sanitizeText(sanitized[key] as string) as T[Extract<keyof T, string>];
    }
  }
  return sanitized;
}
