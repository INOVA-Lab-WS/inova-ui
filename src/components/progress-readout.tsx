import * as React from "react";
import { cn } from "../lib/cn";

/**
 * Progress readout · Figma "progress-readout": percent (12 medium) and a 100x4 bar.
 * tone "on-image" (default): white, over an image or a dark surface (track white at 25%).
 * tone "on-surface" (#63): text/primary, over a light surface with no image (track at 15%).
 * The label names it for screen readers. Accepts any number; clamps 0 to 100.
 */
export interface ProgressReadoutProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  percent: number;
  tone?: "on-image" | "on-surface";
}

export const ProgressReadout = React.forwardRef<HTMLDivElement, ProgressReadoutProps>(({ label, percent, tone = "on-image", className, ...props }, ref) => {
  const v = Math.min(100, Math.max(0, percent));
  const onSurface = tone === "on-surface";
  return (
    <div ref={ref} className={cn("flex items-center gap-2 font-sans", className)} {...props}>
      <span className={cn("text-xs font-medium tabular-nums", onSurface ? "text-text-primary" : "text-text-on-ink")}>{new Intl.NumberFormat("pt-BR").format(Math.round(v))}%</span>
      <span role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={v} className={cn("h-1 w-25 rounded-pill", onSurface ? "bg-text-primary/15" : "bg-text-on-ink/25")}>
        <span className={cn("block h-1 rounded-pill", onSurface ? "bg-text-primary" : "bg-text-on-ink")} style={{ width: `${v}%` }} />
      </span>
    </div>
  );
});
ProgressReadout.displayName = "ProgressReadout";
