import * as React from "react";
import { cn } from "../lib/cn";
import { barGap, ChartAxisLabels, ChartStateMessage, ChartTooltip, nf, SERIES_COLORS, useActiveBar, type ChartState } from "./chart-shared";

/**
 * Vertical bar chart · Figma "bar-chart" (e.g. sessions by hour or by weekday). Single series.
 * Many bars (#73): bars shrink to the card width and never overflow; axis labels are thinned so none is cut, always
 * with the first and the last (`labelStep` forces a step).
 * Hover and focus (#77): the bar under the pointer, or focused with Tab and the arrows, stays and the others fade; the
 * tooltip shows the bar's label and `valueLabel` with the value.
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
  /** Name of the value in the tooltip (e.g. "Sessões"); defaults to `label`. */
  valueLabel?: string;
}

export function BarChart({ data, label, state = "ready", emptyMessage, density = "wide", labelStep = "auto", valueLabel, className, ...props }: BarChartProps) {
  if (state !== "ready" || data.length === 0) return <ChartStateMessage state={state === "ready" ? "empty" : state} emptyMessage={emptyMessage} />;
  return <BarChartPlot data={data} label={label} density={density} labelStep={labelStep} valueLabel={valueLabel} className={className} {...props} />;
}

function BarChartPlot({ data, label, density, labelStep, valueLabel, className, ...props }: Omit<BarChartProps, "state" | "emptyMessage">) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const { active, bar, dim } = useActiveBar(data.length);
  return (
    <div className={cn("flex min-w-0 flex-col gap-2 font-sans", className)} {...props}>
      <div className="relative min-w-0">
        <div role="group" aria-label={label} className={cn("flex h-28 min-w-0 items-end overflow-hidden border-b border-border-default", barGap(data.length, density === "thin" ? "gap-1" : "gap-3"))}>
          {data.map((d, i) => (
            <span key={d.label} {...bar(i)} aria-label={`${d.label}: ${nf.format(d.value)}`} className={cn("flex h-full min-w-0 flex-1 cursor-default items-end justify-center", dim(i))}>
              <span className={cn("rounded-t-4", SERIES_COLORS[0], density === "thin" ? "w-1 max-w-full" : "w-full")} style={{ height: `${(d.value / max) * 100}%` }} />
            </span>
          ))}
        </div>
        {active !== null && (
          <ChartTooltip index={active} count={data.length} title={data[active].label} rows={[{ label: valueLabel ?? label, value: data[active].value, colorClass: SERIES_COLORS[0] }]} />
        )}
      </div>
      <ChartAxisLabels labels={data.map((d) => d.label)} step={labelStep} />
    </div>
  );
}
