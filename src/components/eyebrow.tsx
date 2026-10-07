import * as React from "react";
import { cn } from "../lib/cn";

/**
 * Eyebrow · Figma text style "INOVA/Eyebrow". Section label in capitals by CSS only: write it in lower case, so
 * screen readers do not spell it out. 12 (default) or 14, semibold, tracking-wide, text-muted.
 */
export const eyebrowClassName = (size: 12 | 14 = 12, className?: string) =>
  cn("font-sans font-semibold uppercase tracking-wide text-text-muted", size === 14 ? "text-sm" : "text-xs", className);

export interface EyebrowProps extends React.HTMLAttributes<HTMLElement> {
  size?: 12 | 14;
  as?: "p" | "span" | "h2" | "h3" | "h4";
}

export function Eyebrow({ size = 12, as: Tag = "p", className, ...props }: EyebrowProps) {
  return <Tag className={eyebrowClassName(size, className)} {...props} />;
}
