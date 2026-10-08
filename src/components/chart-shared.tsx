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
