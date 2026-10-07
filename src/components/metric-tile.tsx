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

/**
 * MetricTileGroup · the "Grupo de métricas" section of the metric-tile doc. Below 1024px: one row that scrolls
 * sideways with snap at each tile, 144px tiles, bleeding to the screen edge with the grid margin and no bar, the
 * last tile cut to show there is more. From 1024px: a grid of columns (2 to 6) with the grid gutter.
 * role="list"; wrap each MetricTile in an item (the group does it).
 */
export interface MetricTileGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4 | 5 | 6;
}

const COLS = { 2: "desktop:grid-cols-2", 3: "desktop:grid-cols-3", 4: "desktop:grid-cols-4", 5: "desktop:grid-cols-5", 6: "desktop:grid-cols-6" } as const;

export function MetricTileGroup({ columns = 4, className, children, ...props }: MetricTileGroupProps) {
  return (
    <div
      role="list"
      className={cn(
        "scrollbar-none -mx-[var(--inova-grid-margin)] flex snap-x snap-mandatory scroll-px-[var(--inova-grid-margin)] gap-3 overflow-x-auto px-[var(--inova-grid-margin)]",
        "desktop:mx-0 desktop:grid desktop:gap-[var(--inova-grid-gutter)] desktop:overflow-visible desktop:px-0",
        COLS[columns],
        className,
      )}
      {...props}
    >
      {React.Children.map(children, (child) => (
        <div role="listitem" className="w-36 shrink-0 snap-start desktop:w-auto">
          {child}
        </div>
      ))}
    </div>
  );
}
