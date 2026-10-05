import * as React from "react";
import { cn } from "../lib/cn";

const sizes = { small: "size-4", medium: "size-6", big: "size-8" } as const;

/** Spinner · Figma "spinner". small 16, medium 24, big 32; stroke in text/brand. */
export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: keyof typeof sizes;
  label?: string;
}

export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ size = "medium", label = "Carregando…", className, ...props }, ref) => (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label={label}
      className={cn("shrink-0 animate-spin text-text-brand motion-reduce:animate-none", sizes[size], className)}
      {...props}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2.5" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
);
Spinner.displayName = "Spinner";
