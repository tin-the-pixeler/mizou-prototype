import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Keyboard focus ring. Appended AFTER `cn()` rather than passed through it:
 * tailwind-merge v3 follows Tailwind v4, where `outline` means width, so it
 * strips Tailwind v3's `outline` (style) when it sits beside `outline-2`.
 * (Ring utilities aren't an option — they need Preflight's --tw-ring-* defaults.)
 */
export const FOCUS_RING =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-interactive-primary';

/** Merge conditional class names, with later Tailwind utilities winning. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
