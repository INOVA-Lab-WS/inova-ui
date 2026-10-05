import * as React from "react";
import { cn } from "../lib/cn";
import { ChartStateMessage, nf, SERIES_COLORS, type ChartState } from "./chart-shared";

/** Vertical bar chart · Figma "bar-chart" (e.g. sessions by hour or by weekday). Single series. */
export interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: { label: string; value: number }[];
  label: string;
  state?: ChartState;
  emptyMessage?: string;
  /** Thin bars for many buckets (24 hours), wide bars for few (7 days). */
  density?: "thin" | "wide";
}

export function BarChart({ data, label, state = "ready", emptyMessage, density = "wide", className, ...props }: BarChartProps) {
  if (state !== "ready" || data.length === 0) return <ChartStateMessage state={state === "ready" ? "empty" : state} emptyMessage={emptyMessage} />;
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className={cn("flex flex-col gap-2 font-sans", className)} {...props}>
      <div role="img" aria-label={label} className={cn("flex h-28 items-end border-b border-border-default", density === "thin" ? "gap-1" : "gap-3")}>
        {data.map((d) => (
          <span key={d.label} title={`${d.label}: ${nf.format(d.value)}`} className="flex h-full flex-1 items-end justify-center">
            <span className={cn("rounded-t-4", SERIES_COLORS[0], density === "thin" ? "w-1" : "w-full")} style={{ height: `${(d.value / max) * 100}%` }} />
          </span>
        ))}
      </div>
      <div className={cn("flex text-chart-axis text-text-muted", density === "thin" ? "gap-1" : "gap-3")}>
        {data.map((d) => <span key={d.label} className="flex-1 truncate text-center">{d.label}</span>)}
      </div>
    </div>
  );
}
