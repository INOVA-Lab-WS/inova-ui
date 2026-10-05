import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "../lib/cn";

/** Metric tile · Figma "metric-tile": layouts stat, variant and count, with an "i" help trigger. "Não medido" is never 0. */
export interface MetricTileProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  /** null or undefined renders "Não medido". */
  value?: number | string | null;
  layout?: "stat" | "variant" | "count";
  /** Secondary line (variant name, unit, period). */
  caption?: string;
  /** Help text shown on the "i" trigger. */
  help?: string;
}

export const MetricTile = React.forwardRef<HTMLDivElement, MetricTileProps>(({ label, value, layout = "stat", caption, help, className, ...props }, ref) => {
  const measured = value !== null && value !== undefined;
  const shown = !measured ? "Não medido" : typeof value === "number" ? new Intl.NumberFormat("pt-BR").format(value) : value;
  return (
    <div ref={ref} className={cn("relative flex flex-col gap-2 rounded-16 border border-border-default bg-surface-card p-4 font-sans", className)} {...props}>
      <span className="pr-8 text-xs text-text-muted">{label}</span>
      {help && (
        <button type="button" aria-label={help} title={help} className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-pill focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-focus">
          <Info aria-hidden className="size-3.5 text-text-muted" />
        </button>
      )}
      <span className={cn("tabular-nums", !measured ? "text-sm text-text-muted" : layout === "count" ? "text-xl font-semibold text-text-primary" : "text-2xl font-semibold text-text-primary")}>{shown}</span>
      {caption && <span className={cn("text-xs", layout === "variant" ? "text-text-accent" : "text-text-muted")}>{caption}</span>}
    </div>
  );
});
MetricTile.displayName = "MetricTile";
