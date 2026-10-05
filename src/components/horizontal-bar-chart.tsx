import * as React from "react";
import { cn } from "../lib/cn";
import { ChartStateMessage, nf, SERIES_COLORS, type ChartState } from "./chart-shared";

/** Horizontal bar chart · Figma "horizontal-bar-chart" (recipes by-store, by-room, ranking). Single series, green ramp. */
export interface HorizontalBarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: { label: string; value: number }[];
  /** Accessible description of the chart. */
  label: string;
  state?: ChartState;
  /** "wide" gives more room to long labels, like ranking of sellers. */
  labelAxis?: "standard" | "wide";
  emptyMessage?: string;
}

export function HorizontalBarChart({ data, label, state = "ready", labelAxis = "standard", emptyMessage, className, ...props }: HorizontalBarChartProps) {
  const max = Math.max(1, ...data.map((d) => d.value));
  if (state !== "ready" || data.length === 0) return <ChartStateMessage state={state === "ready" ? "empty" : state} emptyMessage={emptyMessage} />;
  return (
    <div role="img" aria-label={label} className={cn("flex flex-col gap-2 font-sans", className)} {...props}>
      {data.map((d) => (
        <div key={d.label} className={cn("grid items-center gap-3", labelAxis === "wide" ? "grid-cols-[minmax(0,10rem)_1fr]" : "grid-cols-[minmax(0,6rem)_1fr]")}>
          <span className="truncate text-xs text-text-primary" title={d.label}>{d.label}</span>
          <span className="flex items-center gap-2">
            <span className={cn("h-6 rounded-4", SERIES_COLORS[0])} style={{ width: `${(d.value / max) * 100}%` }} />
            <span className="text-chart-axis tabular-nums text-text-muted">{nf.format(d.value)}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
