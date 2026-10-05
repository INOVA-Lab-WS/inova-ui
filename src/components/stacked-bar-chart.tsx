import * as React from "react";
import { cn } from "../lib/cn";
import { CATEGORY_COLORS, ChartLegend, ChartStateMessage, nf, type ChartState } from "./chart-shared";

/** Stacked bar chart · Figma "stacked-bar-chart" (e.g. images per day by type). Categorical palette, legend on top. */
export interface StackedBarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  series: string[];
  data: { label: string; values: number[] }[];
  label: string;
  state?: ChartState;
  emptyMessage?: string;
  /** Number of y-axis ticks (default 5). */
  ticks?: number;
}

export function StackedBarChart({ series, data, label, state = "ready", emptyMessage, ticks = 5, className, ...props }: StackedBarChartProps) {
  if (state !== "ready" || data.length === 0) return <ChartStateMessage state={state === "ready" ? "empty" : state} emptyMessage={emptyMessage} />;
  const totals = data.map((d) => d.values.reduce((a, b) => a + b, 0));
  const step = Math.max(1, Math.ceil(Math.max(1, ...totals) / (ticks - 1)));
  const top = step * (ticks - 1);
  return (
    <div className={cn("flex flex-col gap-4 font-sans", className)} {...props}>
      <ChartLegend items={series.map((s, i) => ({ label: s, colorClass: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }))} />
      <div role="img" aria-label={label} className="flex gap-2">
        <div className="flex h-40 flex-col-reverse justify-between text-chart-axis tabular-nums text-text-muted">
          {Array.from({ length: ticks }, (_, i) => <span key={i}>{nf.format(i * step)}</span>)}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex h-40 items-end gap-2 border-b border-border-default">
            {data.map((d, di) => (
              <div key={d.label} className="flex h-full flex-1 flex-col-reverse" title={`${d.label}: ${nf.format(totals[di])}`}>
                {d.values.map((v, i) => (
                  <span key={i} className={cn("w-full first:rounded-b-0 last:rounded-t-4", CATEGORY_COLORS[i % CATEGORY_COLORS.length])} style={{ height: `${(v / top) * 100}%` }} />
                ))}
              </div>
            ))}
          </div>
          <div className="flex gap-2 text-chart-axis text-text-muted">
            {data.map((d) => <span key={d.label} className="flex-1 truncate text-center">{d.label}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}
