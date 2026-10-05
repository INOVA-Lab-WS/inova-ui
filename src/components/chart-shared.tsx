import * as React from "react";
import { cn } from "../lib/cn";

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

export function ChartStateMessage({ state, emptyMessage, loadingMessage }: { state: ChartState; emptyMessage?: string; loadingMessage?: string }) {
  if (state === "ready") return null;
  return (
    <p className="py-8 text-sm text-text-muted" role="status">
      {state === "loading" ? (loadingMessage ?? "Carregando…") : (emptyMessage ?? "Sem dados no filtro atual.")}
    </p>
  );
}
