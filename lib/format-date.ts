/**
 * Date formatting utilities for consistent local time display
 */

/**
 * Format date to local time string
 */
export function formatLocalTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  
  const d = typeof date === "string" ? new Date(date) : date;
  
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format date to local time string with seconds
 */
export function formatLocalTimeWithSeconds(date: Date | string | null | undefined): string {
  if (!date) return "—";
  
  const d = typeof date === "string" ? new Date(date) : date;
  
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

/**
 * Format date to local date and time string
 */
export function formatLocalDateTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  
  const d = typeof date === "string" ? new Date(date) : date;
  
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Format date to local date string
 */
export function formatLocalDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  
  const d = typeof date === "string" ? new Date(date) : date;
  
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
