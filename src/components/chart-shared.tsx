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
