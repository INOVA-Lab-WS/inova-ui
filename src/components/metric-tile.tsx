import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "../lib/cn";
import { Tooltip } from "./tooltip";
import { Skeleton } from "./skeleton";
import { TrendBadge, type TrendBadgeProps } from "./trend-badge";

/**
 * Metric tile · Figma "metric-tile": layouts stat, variant and count, with an "i" help trigger. "Não medido" is never 0.
 * Height (#91): standalone tiles are at least --inova-size-metric-tile (136px), with or without the dot or a
 * caption. Embedded tiles use the same content with a minimum 160px mobile width that grows to fit the full value, and a 96px minimum height.
 * Captions are limited to two lines.
 */
export interface MetricTileProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  /** The same KPI content, standalone or embedded in a metric/chart composition. */
  context?: "standalone" | "embedded";
  state?: "default" | "idle" | "selected" | "focus" | "static" | "disabled" | "loading" | "missing";
  selected?: boolean;
  disabled?: boolean;
  /** Enables a native selection button, separate from the help trigger. */
  onActivate?: () => void;
  trend?: TrendBadgeProps;
  /** null or undefined renders "Não medido". */
  value?: number | string | null;
  layout?: "stat" | "variant" | "count";
  /** Secondary line (variant name, unit, period). */
  caption?: string;
  /** Help text shown on the "i" trigger. */
  help?: string;
  /** layout="variant": colour of the 10px category marker (a bg-* class). Default chart-category1. */
  markerClassName?: string;
  /** Decorative monochrome icon replacing the variant dot. */
  icon?: React.ReactNode;
  /** layout="variant": false hides the marker and its space, the scene-tile look without the dot (#88). Default true. */
  marker?: boolean;
  /** While loading: the value and caption become skeletons and the tile gets aria-busy. */
  loading?: boolean;
}

export const MetricTile = React.forwardRef<HTMLDivElement, MetricTileProps>(({ label, value, layout = "stat", context = "standalone", state = "default", selected, disabled, onActivate, trend, caption, help, markerClassName, icon, marker = true, loading, className, style, ...props }, ref) => {
  const stat = layout === "stat";
  const embedded = context === "embedded";
  const busy = loading || state === "loading";
  const inactive = disabled || state === "disabled" || busy;
  const active = selected ?? state === "selected";
  const selectable = !!onActivate && state !== "static";
  const measured = state !== "missing" && value !== null && value !== undefined;
  const shown = !measured ? "Não medido" : typeof value === "number" ? new Intl.NumberFormat("pt-BR").format(value) : value;
  const labelId = React.useId();
  const valueId = React.useId();
  const valueProbeRef = React.useRef<HTMLSpanElement>(null);
  const [mobileValueWidth, setMobileValueWidth] = React.useState(0);
  const trendRef = React.useRef<HTMLSpanElement>(null);
  const captionProbeRef = React.useRef<HTMLSpanElement>(null);
  const [captionLines, setCaptionLines] = React.useState(2);
  const [trendWidth, setTrendWidth] = React.useState(0);
  const showTrend = !!trend && measured && !busy;
  React.useLayoutEffect(() => {
    const el = trendRef.current;
    if (!el || !showTrend) return;
    const measure = () => setTrendWidth(el.getBoundingClientRect().width);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [showTrend, trend]);
  React.useLayoutEffect(() => {
    const el = captionProbeRef.current;
    if (!el || !showTrend) return;
    const measure = () => {
      const lineHeight = Number.parseFloat(getComputedStyle(el).lineHeight);
      if (lineHeight > 0) setCaptionLines(Math.max(1, Math.min(2, Math.round(el.getBoundingClientRect().height / lineHeight))));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [caption, showTrend]);
  React.useLayoutEffect(() => {
    const el = valueProbeRef.current;
    if (!el || !embedded) return;
    const measure = () => setMobileValueWidth(Math.ceil(el.getBoundingClientRect().width));
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [embedded, shown, busy]);
  const mobileStyle = embedded ? { "--metric-mobile-width": `${Math.max(160, mobileValueWidth + 32 + (showTrend ? trendWidth + 8 : 0))}px` } as React.CSSProperties : undefined;
  // Keep the badge out of content flow, reserving its measured width where text can meet it.
  const trendSpace = showTrend ? { paddingInlineEnd: trendWidth + 8 } : undefined;
  return (
    <div ref={ref} style={{ ...mobileStyle, ...style }} aria-busy={busy || undefined} data-context={context} data-state={busy ? "loading" : inactive ? "disabled" : active ? "selected" : state} className={cn(
      "relative isolate flex flex-col font-sans",
      embedded ? "min-h-24 min-w-40 w-[var(--metric-mobile-width,160px)] shrink-0 gap-1 p-4 desktop:min-w-0 desktop:w-auto" : "min-h-[var(--inova-size-metric-tile)] rounded-16 border border-border-default bg-surface-card",
      !embedded && (stat ? "gap-1 p-5" : "p-4"),
      active && (embedded ? "bg-surface-page" : "border-surface-action"),
      inactive && !busy && "opacity-50",
      state === "focus" && "outline-2 outline-offset-2 outline-text-primary",
      className,
    )} {...props}>
      {selectable && <button type="button" aria-labelledby={labelId} aria-describedby={valueId} aria-pressed={active} disabled={inactive} onClick={onActivate} className="absolute inset-0 z-raised rounded-[inherit] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary disabled:cursor-not-allowed" />}
      <div className={cn("relative flex min-w-0 flex-col", (stat || embedded) && "gap-1")}>
      {layout === "variant" && (icon != null || marker) && (icon != null
        ? <span aria-hidden="true" className="mb-2 inline-flex size-2.5 shrink-0 items-center justify-center text-text-muted [&>svg]:size-2.5 [&>img]:size-2.5">{icon}</span>
        : <span aria-hidden className={cn("mb-2 size-2.5 rounded-pill", markerClassName ?? "bg-chart-category1")} />)}
      <span id={labelId} className={cn("pr-6 text-xs text-text-muted", stat && !embedded && "font-medium uppercase")}>{label}</span>
      {busy ? (
        <>
          <span id={valueId} className="sr-only">Carregando</span>
          <Skeleton className={stat && !embedded ? "my-1 h-7 w-16" : "my-1 h-6 w-14"} />
          {caption !== undefined && <Skeleton shape="text" className="w-12" />}
        </>
      ) : (
        <>
          <span id={valueId} style={trendSpace} className={cn("min-w-0 tabular-nums", embedded ? "whitespace-nowrap desktop:truncate" : "truncate", !measured ? "text-sm text-text-muted" : embedded ? "text-xl font-bold leading-7 text-text-primary" : stat ? "text-2xl font-bold text-text-primary" : "text-xl font-bold text-text-primary")}>{shown}</span>
          {caption && <>
            {showTrend && <span ref={captionProbeRef} aria-hidden className="pointer-events-none invisible absolute left-0 top-0 w-full line-clamp-2 text-xs text-text-muted">{caption}</span>}
            <span style={showTrend ? { ...trendSpace, WebkitLineClamp: captionLines } : undefined} className="line-clamp-2 text-xs text-text-muted">{caption}</span>
          </>}
        </>
      )}
      </div>
      {embedded && !busy && <span ref={valueProbeRef} aria-hidden="true" className={cn("pointer-events-none invisible absolute left-0 top-0 w-max whitespace-nowrap tabular-nums", measured ? "text-xl font-bold leading-7" : "text-sm")}>{shown}</span>}
      {help && (
        <Tooltip text={help} placement="top-end">
          <button type="button" aria-label={help} className="absolute right-3 top-3 z-header flex size-6 items-center justify-center rounded-pill focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary">
            <Info aria-hidden className="size-3.5 text-text-muted" />
          </button>
        </Tooltip>
      )}
      {showTrend && <span ref={trendRef} data-metric-trend="" className="pointer-events-none absolute bottom-3 right-3 inline-flex max-w-[40%] items-end overflow-hidden"><TrendBadge {...trend} className={cn("max-w-full overflow-hidden whitespace-nowrap", trend.className)} /></span>}
    </div>
  );
});
MetricTile.displayName = "MetricTile";

/**
 * MetricTileGroup · the "Grupo de métricas" section of the metric-tile doc. Below 1024px: one row that scrolls
 * sideways with snap at each tile, 144px tiles, bleeding to the screen edge with the grid margin and no bar, the
 * last tile cut to show there is more. From 1024px: a grid of columns (2 to 6) with the grid gutter.
 * role="list"; wrap each MetricTile in an item (the group does it). Tiles in a row share its height (#89): each item
 * stretches its tile, with or without a caption.
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
        <div role="listitem" className="flex w-36 shrink-0 snap-start desktop:w-auto [&>*]:min-w-0 [&>*]:flex-1">
          {child}
        </div>
      ))}
    </div>
  );
}
