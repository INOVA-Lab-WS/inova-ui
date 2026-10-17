import * as React from "react";
import { cn } from "../lib/cn";
import { ChartStateMessage, nf, SERIES_COLORS, useActiveBar, type ChartState } from "./chart-shared";

/** Horizontal bar chart · Figma "horizontal-bar-chart" (recipes by-store, by-room, ranking). Single series, green ramp. */
export interface HorizontalBarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: { label: string; value: number }[];
  /** Accessible description of the chart. */
  label: string;
  state?: ChartState;
  /** "wide" gives more room to long labels, like ranking of sellers. */
  labelAxis?: "standard" | "wide";
  emptyMessage?: string;
  /** Controlled selection. Selecting the active row clears it. */
  selectedLabel?: string | null;
  onSelectionChange?: (label: string | null) => void;
}

export function HorizontalBarChart({ data, label, state = "ready", labelAxis = "standard", emptyMessage, selectedLabel, onSelectionChange, className, ...props }: HorizontalBarChartProps) {
  const { bar, dim } = useActiveBar(data.length);
  const max = Math.max(1, ...data.map((d) => d.value));
  if (state !== "ready" || data.length === 0) return <ChartStateMessage state={state === "ready" ? "empty" : state} emptyMessage={emptyMessage} />;
  return (
    <div role={onSelectionChange ? "group" : "img"} aria-label={label} className={cn("flex flex-col gap-2 font-sans", className)} {...props}>
      {data.map((d, i) => (
        <div key={d.label} {...(onSelectionChange ? bar(i) : {})} role={onSelectionChange ? "button" : undefined} aria-label={onSelectionChange ? `${d.label}: ${nf.format(d.value)}` : undefined} aria-pressed={onSelectionChange ? selectedLabel === d.label : undefined} onClick={onSelectionChange ? () => onSelectionChange(selectedLabel === d.label ? null : d.label) : undefined} onKeyDown={onSelectionChange ? (e) => { bar(i).onKeyDown(e); if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (!e.repeat) onSelectionChange(selectedLabel === d.label ? null : d.label); } } : undefined} className={cn(onSelectionChange && dim(i), onSelectionChange && "cursor-pointer rounded-4", selectedLabel != null && selectedLabel !== d.label && "opacity-40", "grid items-center gap-3", labelAxis === "wide" ? "grid-cols-[minmax(0,10rem)_1fr]" : "grid-cols-[minmax(0,6rem)_1fr]")}>
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
