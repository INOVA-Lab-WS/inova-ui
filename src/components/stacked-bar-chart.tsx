import * as React from "react";
import { cn } from "../lib/cn";
import { barGap, CATEGORY_COLORS, ChartAxisLabels, ChartLegend, ChartStateMessage, nf, type ChartState } from "./chart-shared";

/**
 * Stacked bar chart · Figma "stacked-bar-chart" (e.g. images per day by type). Categorical palette, legend on top.
 * Many bars (#73, Figma buckets=30): bars shrink to the card width and never overflow; axis labels are thinned so none
 * is cut, always with the first and the last (`labelStep` forces a step).
 */
export interface StackedBarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  series: string[];
  data: { label: string; values: number[] }[];
  label: string;
  state?: ChartState;
  emptyMessage?: string;
  /** Number of y-axis ticks (default 5). */
  ticks?: number;
  /** Show every Nth axis label; "auto" (default) picks the step from the width so no label is cut. */
  labelStep?: number | "auto";
}

export function StackedBarChart({ series, data, label, state = "ready", emptyMessage, ticks = 5, labelStep = "auto", className, ...props }: StackedBarChartProps) {
  if (state !== "ready" || data.length === 0) return <ChartStateMessage state={state === "ready" ? "empty" : state} emptyMessage={emptyMessage} />;
  const totals = data.map((d) => d.values.reduce((a, b) => a + b, 0));
  const step = Math.max(1, Math.ceil(Math.max(1, ...totals) / (ticks - 1)));
  const top = step * (ticks - 1);
  return (
    <div className={cn("flex min-w-0 flex-col gap-4 font-sans", className)} {...props}>
      <ChartLegend items={series.map((s, i) => ({ label: s, colorClass: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }))} />
      <div role="img" aria-label={label} className="flex min-w-0 gap-2">
        <div className="flex h-40 flex-col-reverse justify-between text-chart-axis tabular-nums text-text-muted">
          {Array.from({ length: ticks }, (_, i) => <span key={i}>{nf.format(i * step)}</span>)}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className={cn("flex h-40 min-w-0 items-end overflow-hidden border-b border-border-default", barGap(data.length, "gap-2"))}>
            {data.map((d, di) => (
              <div key={d.label} className="flex h-full min-w-0 flex-1 flex-col-reverse" title={`${d.label}: ${nf.format(totals[di])}`}>
                {d.values.map((v, i) => (
                  <span key={i} className={cn("w-full first:rounded-b-0 last:rounded-t-4", CATEGORY_COLORS[i % CATEGORY_COLORS.length])} style={{ height: `${(v / top) * 100}%` }} />
                ))}
              </div>
            ))}
          </div>
          <ChartAxisLabels labels={data.map((d) => d.label)} step={labelStep} />
        </div>
      </div>
    </div>
  );
}
