import { cn } from "../lib/cn";

/**
 * Text link style. For <a>, a framework Link or a <button> that reads as a link (secondary action).
 * Primary text colour, underline 4px below, muted on hover, visible focus.
 */
export const linkClassName = (className?: string) =>
  cn(
    "cursor-pointer rounded-4 bg-transparent p-0 font-medium text-text-primary underline underline-offset-4 decoration-1 transition-colors",
    "hover:text-text-muted outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
    className,
  );
