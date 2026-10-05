import * as React from "react";
import { cn } from "../lib/cn";
import { ChartStateMessage, nf, SERIES_COLORS, type ChartState } from "./chart-shared";

/** Distribution chart · Figma "distribution-chart": rows with label, share bar and count. */
export interface DistributionChartProps extends React.HTMLAttributes<HTMLUListElement> {
  data: { label: string; value: number }[];
  label: string;
  state?: ChartState;
  emptyMessage?: string;
}

export function DistributionChart({ data, label, state = "ready", emptyMessage, className, ...props }: DistributionChartProps) {
  if (state !== "ready" || data.length === 0) return <ChartStateMessage state={state === "ready" ? "empty" : state} emptyMessage={emptyMessage} />;
  const total = data.reduce((a, d) => a + d.value, 0) || 1;
  const pct = new Intl.NumberFormat("pt-BR", { style: "percent", maximumFractionDigits: 0 });
  return (
    <ul role="img" aria-label={label} className={cn("flex flex-col gap-3 font-sans", className)} {...props}>
      {data.map((d) => (
        <li key={d.label} className="flex flex-col gap-1">
          <span className="flex items-baseline justify-between gap-3 text-xs">
            <span className="truncate text-text-primary">{d.label}</span>
            <span className="tabular-nums text-text-muted">{nf.format(d.value)} · {pct.format(d.value / total)}</span>
          </span>
          <span className="h-2 w-full rounded-pill bg-surface-muted">
            <span className={cn("block h-2 rounded-pill", SERIES_COLORS[0])} style={{ width: `${(d.value / total) * 100}%` }} />
          </span>
        </li>
      ))}
    </ul>
  );
}
