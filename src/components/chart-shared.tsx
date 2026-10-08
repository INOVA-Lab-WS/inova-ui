import * as React from "react";
import { cn } from "../lib/cn";
import { Skeleton } from "./skeleton";

/** Shared pieces for the INOVA charts: series colors, number format, legend and empty/loading states. */
export const SERIES_COLORS = ["bg-chart-series1", "bg-chart-series2", "bg-chart-series3", "bg-chart-series4", "bg-chart-series5"] as const;
export const CATEGORY_COLORS = ["bg-chart-category1", "bg-chart-category2", "bg-chart-category3", "bg-chart-category4", "bg-chart-category5"] as const;
export const FILL_SERIES = ["fill-chart-series1", "fill-chart-series2", "fill-chart-series3", "fill-chart-series4", "fill-chart-series5"] as const;
export const FILL_CATEGORY = ["fill-chart-category1", "fill-chart-category2", "fill-chart-category3", "fill-chart-category4", "fill-chart-category5"] as const;

export const nf = new Intl.NumberFormat("pt-BR");

export type ChartState = "loading" | "empty" | "ready";

export interface ChartLegendItem { label: string; colorClass: string }

export function ChartLegend({ items, className }: { items: ChartLegendItem[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-x-4 gap-y-2 text-xs text-text-muted", className)}>
      {items.map((it) => (
        <li key={it.label} className="inline-flex items-center gap-2">
          <span aria-hidden className={cn("size-3 rounded-4", it.colorClass)} />
          {it.label}
        </li>
      ))}
    </ul>
  );
}

const SKELETON_BARS = [35, 55, 80, 50, 95, 65, 40, 70, 45, 85, 60, 30];

/**
 * Loading skeleton shared by the charts (#66, Figma bar-chart state=loading): the grid baseline with muted bars and a
 * text line where the axis goes. The loading phrase stays for screen readers only.
 */
export function ChartSkeleton({ loadingMessage, className }: { loadingMessage?: string; className?: string }) {
  return (
    <div role="status" aria-busy className={cn("flex flex-col gap-3 py-2", className)}>
      <span className="sr-only">{loadingMessage ?? "Carregando…"}</span>
      <div aria-hidden className="flex h-22 items-end gap-1 border-b border-border-default">
        {SKELETON_BARS.map((h, i) => (
          <Skeleton key={i} className="flex-1 rounded-t-4 rounded-b-none" style={{ height: `${h}%` }} />
        ))}
      </div>
      <Skeleton shape="text" className="w-1/2" />
    </div>
  );
}

export function ChartStateMessage({ state, emptyMessage, loadingMessage }: { state: ChartState; emptyMessage?: string; loadingMessage?: string }) {
  if (state === "ready") return null;
  if (state === "loading") return <ChartSkeleton loadingMessage={loadingMessage} />;
  return (
    <p className="py-8 text-sm text-text-muted" role="status">
      {emptyMessage ?? "Sem dados no filtro atual."}
    </p>
  );
}

/** Gap between bars by how many there are (#73): fewer bars keep the roomy gap, many bars shrink it, never overflow. */
export function barGap(count: number, roomy: string) {
  return count > 24 ? "gap-0.5" : count > 12 ? "gap-1" : roomy;
}

/** Width of an element, kept up to date with ResizeObserver. null until measured (server and first render). */
export function useElementWidth<T extends HTMLElement>(): [React.RefObject<T | null>, number | null] {
  const ref = React.useRef<T | null>(null);
  const [width, setWidth] = React.useState<number | null>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
}

/** Approximate width of a 10px axis label (text-chart-axis), plus the minimum space between 2 labels. */
const AXIS_CHAR_PX = 6;
const AXIS_LABEL_GAP = 8;

/**
 * Which axis labels to show so none is cut (#73, Figma stacked-bar-chart buckets=30): the smallest step at which
 * neighbours stay 8px apart, counting the first label aligned left; always the first and the last, and a regular label
 * that would touch the last one is dropped. `step` forces a step (1 shows every label).
 */
export function axisLabelIndexes(labels: string[], width: number | null, step?: number): number[] {
  const n = labels.length;
  if (n <= 1) return labels.map((_, i) => i);
  const w = Math.max(...labels.map((l) => l.length)) * AXIS_CHAR_PX;
  const W = width ?? 300;
  const slot = W / n;
  const s = step ?? Math.max(1, Math.ceil((w + AXIS_LABEL_GAP) / slot), Math.ceil((1.5 * w + AXIS_LABEL_GAP) / slot - 0.5));
  if (s <= 1) return labels.map((_, i) => i);
  const lastLeft = W - w;
  const out: number[] = [];
  for (let i = 0; i < n - 1; i += s) {
    const right = i === 0 ? w : (i + 0.5) * slot + w / 2;
    if (right <= lastLeft - AXIS_LABEL_GAP) out.push(i);
  }
  out.push(n - 1);
  return out;
}

/**
 * The x axis under a bar chart: one slot per bar, labels thinned by axisLabelIndexes. The first label aligns left, the
 * last right and the others center on their bar, never wider than the chart.
 */
export function ChartAxisLabels({ labels, step }: { labels: string[]; step?: number | "auto" }) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const n = labels.length;
  const shown = axisLabelIndexes(labels, width, step === "auto" ? undefined : step);
  return (
    <div ref={ref} className="relative h-4 min-w-0 overflow-hidden text-chart-axis text-text-muted">
      {shown.map((i) => {
        const edge = n > 1 && i === 0 ? "start" : n > 1 && i === n - 1 ? "end" : "center";
        return (
          <span
            key={i}
            className={cn("absolute top-0 whitespace-nowrap", edge === "center" && "-translate-x-1/2")}
            style={edge === "start" ? { left: 0 } : edge === "end" ? { right: 0 } : { left: `${((i + 0.5) / n) * 100}%` }}
          >
            {labels[i]}
          </span>
        );
      })}
    </div>
  );
}

/**
 * Hover and keyboard focus on bars (#77, Figma state=tooltip-visible): one bar is active at a time; the chart is one
 * tab stop and the arrows, Home and End move between bars. Spread `bar(i)` on each bar slot.
 */
export function useActiveBar(count: number) {
  const [active, setActive] = React.useState<number | null>(null);
  const [focusIndex, setFocusIndex] = React.useState(0);
  const refs = React.useRef<(HTMLElement | null)[]>([]);
  const move = (to: number) => {
    const i = Math.max(0, Math.min(count - 1, to));
    setFocusIndex(i);
    refs.current[i]?.focus();
  };
  const bar = (i: number) => ({
    ref: (el: HTMLElement | null) => {
      refs.current[i] = el;
    },
    tabIndex: i === focusIndex ? 0 : -1,
    onMouseEnter: () => setActive(i),
    onMouseLeave: () => setActive((a) => (a === i ? null : a)),
    onFocus: () => {
      setActive(i);
      setFocusIndex(i);
    },
    onBlur: () => setActive((a) => (a === i ? null : a)),
    onKeyDown: (e: React.KeyboardEvent) => {
      const k = e.key;
      if (k === "ArrowRight" || k === "ArrowDown") move(i + 1);
      else if (k === "ArrowLeft" || k === "ArrowUp") move(i - 1);
      else if (k === "Home") move(0);
      else if (k === "End") move(count - 1);
      else if (k === "Escape") setActive(null);
      else return;
      e.preventDefault();
    },
  });
  /** Classes for bar i: the others fade to 40% while one is active. */
  const dim = (i: number) => cn("outline-none transition-opacity motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text-primary", active !== null && active !== i && "opacity-40");
  return { active, bar, dim };
}

export interface ChartTooltipRow {
  label: string;
  value: number;
  colorClass?: string;
}

/**
 * The chart tooltip (Figma "tooltip" in state=tooltip-visible): the bar's label, then one line per series with its color
 * mark and value, and the total when given. Sits above the active bar, inside the chart (aligned to the edge near the
 * first and last bars).
 */
export function ChartTooltip({ index, count, title, rows, total }: { index: number; count: number; title: string; rows: ChartTooltipRow[]; total?: number }) {
  const center = ((index + 0.5) / count) * 100;
  const edge = index < count / 4 ? "start" : index >= count - count / 4 ? "end" : "center";
  return (
    <div
      role="status"
      className={cn(
        "pointer-events-none absolute top-0 z-raised flex min-w-36 max-w-[80%] flex-col gap-1 rounded-8 border border-border-default bg-surface-page px-3 py-1 text-xs shadow-raised",
        edge === "center" && "-translate-x-1/2",
      )}
      style={edge === "start" ? { left: 0 } : edge === "end" ? { right: 0 } : { left: `${center}%` }}
    >
      <span className="font-medium text-text-primary">{title}</span>
      {rows.map((r) => (
        <span key={r.label} className="flex items-center gap-2">
          {r.colorClass && <span aria-hidden className={cn("size-2.5 shrink-0 rounded-4", r.colorClass)} />}
          <span className="min-w-0 flex-1 truncate text-text-muted">{r.label}</span>
          <span className="font-medium tabular-nums text-text-primary">{nf.format(r.value)}</span>
        </span>
      ))}
      {total !== undefined && (
        <span className="flex items-center gap-2 border-t border-border-default pt-1">
          <span className="flex-1 text-text-muted">Total</span>
          <span className="font-medium tabular-nums text-text-primary">{nf.format(total)}</span>
        </span>
      )}
    </div>
  );
}
