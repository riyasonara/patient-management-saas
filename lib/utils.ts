// ============================================================
// Utility helpers
// ============================================================

/**
 * Merge CSS class names, filtering out falsy values.
 * Lightweight alternative to clsx / classnames.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Format an ISO date string into a human-readable form.
 * Returns "N/A" for empty / invalid values.
 */
export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "N/A";
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return "N/A";
  }
}

/**
 * Format a date string to YYYY-MM-DD for input[type="date"] value.
 */
export function toDateInputValue(dateStr?: string | null): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toISOString().split("T")[0];
  } catch {
    return "";
  }
}

/**
 * Debounce a callback by the given delay (ms).
 */
export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
