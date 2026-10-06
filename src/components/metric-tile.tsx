import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "../lib/cn";
import { Tooltip } from "./tooltip";
import { Skeleton } from "./skeleton";

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
  /** layout="variant": colour of the 10px category marker (a bg-* class). Default chart-category1. */
  markerClassName?: string;
  /** While loading: the value and caption become skeletons and the tile gets aria-busy. */
  loading?: boolean;
}

export const MetricTile = React.forwardRef<HTMLDivElement, MetricTileProps>(({ label, value, layout = "stat", caption, help, markerClassName, loading, className, ...props }, ref) => {
  const stat = layout === "stat";
  const measured = value !== null && value !== undefined;
  const shown = !measured ? "Não medido" : typeof value === "number" ? new Intl.NumberFormat("pt-BR").format(value) : value;
  return (
    <div ref={ref} aria-busy={loading || undefined} className={cn("relative flex flex-col rounded-16 border border-border-default bg-surface-card font-sans", stat ? "gap-1 p-5" : "p-4", className)} {...props}>
      {layout === "variant" && <span aria-hidden className={cn("mb-2 size-2.5 rounded-pill", markerClassName ?? "bg-chart-category1")} />}
      <span className={cn("pr-6 text-xs text-text-muted", stat && "font-medium uppercase")}>{label}</span>
      {help && (
        <Tooltip text={help}  placement="top-end">
          <button type="button" aria-label={help} className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-pill focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary">
            <Info aria-hidden className="size-3.5 text-text-muted" />
          </button>
        </Tooltip>
      )}
      {loading ? (
        <>
          <Skeleton className={stat ? "my-1 h-7 w-16" : "my-1 h-6 w-14"} />
          {caption !== undefined && <Skeleton shape="text" className="w-12" />}
        </>
      ) : (
        <>
      <span className={cn("tabular-nums", !measured ? "text-sm text-text-muted" : stat ? "text-2xl font-bold text-text-primary" : "text-xl font-bold text-text-primary")}>{shown}</span>
      {caption && <span className="text-xs text-text-muted">{caption}</span>}
        </>
      )}
    </div>
  );
});
MetricTile.displayName = "MetricTile";
