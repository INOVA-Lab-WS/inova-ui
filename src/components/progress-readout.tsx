import * as React from "react";
import { cn } from "../lib/cn";

/**
 * Progress readout · Figma "progress-readout": percent (12 medium) and a 100x4 bar, white over an image
 * (track white at 25%). The label names it for screen readers. Accepts any number; clamps 0 to 100.
 */
export interface ProgressReadoutProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  percent: number;
}

export const ProgressReadout = React.forwardRef<HTMLDivElement, ProgressReadoutProps>(({ label, percent, className, ...props }, ref) => {
  const v = Math.min(100, Math.max(0, percent));
  return (
    <div ref={ref} className={cn("flex items-center gap-2 font-sans", className)} {...props}>
      <span className="text-xs font-medium tabular-nums text-text-on-ink">{new Intl.NumberFormat("pt-BR").format(Math.round(v))}%</span>
      <span role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={v} className="h-1 w-25 rounded-pill bg-text-on-ink/25">
        <span className="block h-1 rounded-pill bg-text-on-ink" style={{ width: `${v}%` }} />
      </span>
    </div>
  );
});
ProgressReadout.displayName = "ProgressReadout";
