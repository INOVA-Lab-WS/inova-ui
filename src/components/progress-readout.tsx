import * as React from "react";
import { cn } from "../lib/cn";

/** Progress readout · Figma "progress-readout": label, percent and a bar. Accepts any number; clamps 0 to 100. */
export interface ProgressReadoutProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  percent: number;
}

export const ProgressReadout = React.forwardRef<HTMLDivElement, ProgressReadoutProps>(({ label, percent, className, ...props }, ref) => {
  const v = Math.min(100, Math.max(0, percent));
  return (
    <div ref={ref} className={cn("flex flex-col gap-2 font-sans", className)} {...props}>
      <span className="flex justify-between text-xs text-text-muted">
        <span>{label}</span>
        <span className="tabular-nums text-text-primary">{new Intl.NumberFormat("pt-BR").format(Math.round(v))}%</span>
      </span>
      <span role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={v} className="h-2 w-full rounded-pill bg-surface-muted">
        <span className="block h-2 rounded-pill bg-chart-series1" style={{ width: `${v}%` }} />
      </span>
    </div>
  );
});
ProgressReadout.displayName = "ProgressReadout";
