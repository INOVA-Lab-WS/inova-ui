import * as React from "react";
import { cn } from "../lib/cn";
import { barGap, ChartAxisLabels, ChartStateMessage, nf, SERIES_COLORS, type ChartState } from "./chart-shared";

/**
 * Vertical bar chart · Figma "bar-chart" (e.g. sessions by hour or by weekday). Single series.
 * Many bars (#73): bars shrink to the card width and never overflow; axis labels are thinned so none is cut, always
 * with the first and the last (`labelStep` forces a step).
 */
export interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: { label: string; value: number }[];
  label: string;
  state?: ChartState;
  emptyMessage?: string;
  /** Thin bars for many buckets (24 hours), wide bars for few (7 days). */
  density?: "thin" | "wide";
  /** Show every Nth axis label; "auto" (default) picks the step from the width so no label is cut. */
  labelStep?: number | "auto";
}

export function BarChart({ data, label, state = "ready", emptyMessage, density = "wide", labelStep = "auto", className, ...props }: BarChartProps) {
  if (state !== "ready" || data.length === 0) return <ChartStateMessage state={state === "ready" ? "empty" : state} emptyMessage={emptyMessage} />;
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className={cn("flex min-w-0 flex-col gap-2 font-sans", className)} {...props}>
      <div role="img" aria-label={label} className={cn("flex h-28 min-w-0 items-end overflow-hidden border-b border-border-default", barGap(data.length, density === "thin" ? "gap-1" : "gap-3"))}>
        {data.map((d) => (
          <span key={d.label} title={`${d.label}: ${nf.format(d.value)}`} className="flex h-full min-w-0 flex-1 items-end justify-center">
            <span className={cn("rounded-t-4", SERIES_COLORS[0], density === "thin" ? "w-1 max-w-full" : "w-full")} style={{ height: `${(d.value / max) * 100}%` }} />
          </span>
        ))}
      </div>
      <ChartAxisLabels labels={data.map((d) => d.label)} step={labelStep} />
    </div>
  );
}
