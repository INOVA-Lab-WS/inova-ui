import * as React from "react";
import { cn } from "../lib/cn";
import { areaPath, areaSegments, linePath, measured } from "./chart-area-geometry";
import { axisLabelIndexes, ChartExtremeMarker, ChartLineKey, ChartStateMessage, ComparisonTooltip, nf, useActiveBar, useElementWidth, type ChartState, type ChartTooltipRow } from "./chart-shared";

export interface AreaChartDatum {
  label: string;
  value: number | null;
  previousValue?: number | null;
  /** Display-ready period date; the chart does not infer comparison dates. */
  date?: string;
  previousDate?: string;
  /** Optional category breakdown for this current-period bucket. */
  parts?: ChartTooltipRow[];
}
export interface AreaChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: AreaChartDatum[];
  label: string;
  comparison?: boolean;
  showExtrema?: boolean;
  showLegend?: boolean;
  state?: ChartState | "unavailable";
  seriesLabel?: string;
  previousSeriesLabel?: string;
  formatValue?: (value: number) => string;
  labelStep?: number | "auto";
  emptyMessage?: string;
  unavailableMessage?: string;
  loadingMessage?: string;
  missingValueLabel?: string;
}

/** Numeric, responsive area chart. Zero is measured; null/NaN splits each series independently. */
export function AreaChart({ data, label, comparison = false, showExtrema = false, showLegend = true, state = "ready", seriesLabel = "Atual", previousSeriesLabel = "Anterior", formatValue = nf.format, labelStep = "auto", emptyMessage, unavailableMessage = "Sem medição no período.", loadingMessage, missingValueLabel = "Sem medição", className, ...props }: AreaChartProps) {
  const hasMeasurement = data.some(d => measured(d.value) || (comparison && measured(d.previousValue)));
  const actualState = state === "ready" && !data.length ? "empty" : state === "ready" && !hasMeasurement ? "unavailable" : state;
  return <div className={cn("flex min-w-0 flex-col gap-2 font-sans", className)} {...props}>
    {actualState === "unavailable" ? <p role="status" className="py-8 text-sm text-text-muted">{unavailableMessage}</p> : actualState !== "ready" ? <ChartStateMessage state={actualState} emptyMessage={emptyMessage} loadingMessage={loadingMessage} /> : <AreaChartPlot data={data} label={label} comparison={comparison} showExtrema={showExtrema} showLegend={showLegend} seriesLabel={seriesLabel} previousSeriesLabel={previousSeriesLabel} formatValue={formatValue} labelStep={labelStep} missingValueLabel={missingValueLabel} />}
  </div>;
}

function AreaChartPlot({ data, label, comparison, showExtrema, showLegend, seriesLabel, previousSeriesLabel, formatValue, labelStep, missingValueLabel }: Required<Pick<AreaChartProps, "data" | "label" | "comparison" | "showExtrema" | "showLegend" | "seriesLabel" | "previousSeriesLabel" | "formatValue" | "labelStep" | "missingValueLabel">>) {
  const id = React.useId().replace(/:/g, "");
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const { active, bar, dim } = useActiveBar(data.length);
  const values = data.flatMap(d => comparison ? [d.value, d.previousValue] : [d.value]).filter(measured);
  const low = Math.min(0, ...values);
  const high = Math.max(0, ...values) || (low === 0 ? 1 : 0);
  const zeroY = 100 - (0 - low) / (high - low) * 100;
  const current = areaSegments(data.map(d => d.value), low, high);
  const previous = comparison ? areaSegments(data.map(d => d.previousValue), low, high) : [];
  const currentPoints = current.flat();
  const extremes = showExtrema && currentPoints.length ? [currentPoints.reduce((a, b) => b.value > a.value ? b : a), currentPoints.reduce((a, b) => b.value < a.value ? b : a)].filter((p, i, all) => i === 0 || p.index !== all[0].index) : [];
  const shown = axisLabelIndexes(data.map(d => d.label), width, labelStep === "auto" ? undefined : labelStep);
  const tooltipRows = (index: number) => [{ label: seriesLabel, value: measured(data[index].value) ? data[index].value : null, date: data[index].date, colorClass: "text-chart-series1", lineStyle: "solid" as const }, ...(data[index].parts ?? []), ...(comparison ? [{ label: previousSeriesLabel, value: measured(data[index].previousValue) ? data[index].previousValue! : null, date: data[index].previousDate, colorClass: "text-chart-series1", lineStyle: "dashed" as const }] : [])];
  return <>
    <div className="relative flex min-w-0 gap-2">
      <div aria-hidden className="flex w-12 shrink-0 flex-col justify-between overflow-hidden pb-6 text-right text-chart-axis tabular-nums text-text-muted"><span className="truncate">{formatValue(high)}</span><span className="truncate">{formatValue((high + low) / 2)}</span><span className="truncate">{formatValue(low)}</span></div>
      <div ref={ref} className="min-w-0 flex-1">
        <div role="group" aria-label={label} className="relative h-40 min-w-0">
          <svg aria-hidden width="100%" height="100%" viewBox="0 -4 100 108" preserveAspectRatio="none" className="overflow-visible text-chart-series1">
            <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="currentColor" stopOpacity="0.3" /><stop offset="100%" stopColor="currentColor" stopOpacity="0.02" /></linearGradient></defs>
            {[0, 50, 100].map(y => <line key={y} x1="0" x2="100" y1={y} y2={y} className="stroke-border-default" vectorEffect="non-scaling-stroke" />)}
            {current.map((points, i) => <g key={`current-${i}`}><path d={areaPath(points, zeroY)} fill={`url(#${id})`} /><path d={linePath(points)} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" /></g>)}
            {previous.map((points, i) => <g key={`previous-${i}`}><path d={linePath(points)} fill="none" stroke="currentColor" strokeDasharray="5 4" strokeWidth="2" vectorEffect="non-scaling-stroke" /></g>)}
          </svg>
          {[...current, ...previous].filter(points => points.length === 1).map((points, i) => <span key={`dot-${i}`} aria-hidden className="pointer-events-none absolute size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-chart-series1" style={{ left: `${points[0].x}%`, top: `${(points[0].y + 4) / 108 * 100}%` }} />)}
          <div className="absolute inset-0 flex">
            {data.map((d, i) => <span key={i} {...bar(i)} role="img" aria-label={`${d.label}: ${tooltipRows(i).map(r => `${r.label}${r.date ? ` ${r.date}` : ""}: ${r.value === null ? missingValueLabel : formatValue(r.value)}`).join("; ")}`} className={cn("h-full min-w-0 flex-1 cursor-default", dim(i))} />)}
          </div>
          {active === null && extremes.map((p, i) => <ChartExtremeMarker key={p.index} label={`${i === 0 ? "Máx." : "Mín."} ${formatValue(p.value)}`} className="absolute max-w-[50%] truncate" style={{ left: `${p.x}%`, top: `${(p.y + 4) / 108 * 100}%`, transform: `translate(${p.x > 50 ? "-100%" : "0"}, ${p.y < 50 ? "0" : "-100%"})` }} />)}
          {active !== null && <ComparisonTooltip index={active} count={data.length} title={data[active].label} rows={tooltipRows(active)} formatValue={formatValue} missingValueLabel={missingValueLabel} />}
        </div>
        <div aria-hidden className="relative mt-2 h-4 min-w-0 overflow-hidden text-chart-axis text-text-muted">{shown.map(i => <span key={i} className={cn("absolute top-0 max-w-full truncate", i !== 0 && i !== data.length - 1 && "-translate-x-1/2")} style={data.length === 1 ? { left: "50%", transform: "translateX(-50%)" } : i === 0 ? { left: 0 } : i === data.length - 1 ? { right: 0 } : { left: `${i / (data.length - 1) * 100}%` }}>{data[i].label}</span>)}</div>
      </div>
    </div>
    {showLegend && <div className="flex flex-wrap gap-x-4 gap-y-2"><ChartLineKey label={seriesLabel} />{comparison && <ChartLineKey label={previousSeriesLabel} lineStyle="dashed" />}</div>}
  </>;
}
