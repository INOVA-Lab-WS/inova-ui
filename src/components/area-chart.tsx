import * as React from "react";
import { cn } from "../lib/cn";
import { areaPath, areaSegments, linePath, measured, rangePath, rangeSegments } from "./chart-area-geometry";
import { axisLabelIndexes, ChartExtremeMarker, ChartLineKey, ChartStateMessage, ComparisonTooltip, nf, useActiveBar, useElementWidth, type ChartState, type ChartTooltipRow } from "./chart-shared";

export interface AreaChartDatum {
  label: string;
  value: number | null;
  previousValue?: number | null;
  /** Display-ready period date; the chart does not infer comparison dates. */
  date?: string;
  previousDate?: string;
  /** Forecast samples retain a distinct meaning from the previous-period comparison. */
  projected?: boolean;
  low?: number | null;
  high?: number | null;
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
  projectedLabel?: string;
  rangeLabel?: string;
  formatValue?: (value: number) => string;
  labelStep?: number | "auto";
  emptyMessage?: string;
  unavailableMessage?: string;
  loadingMessage?: string;
  missingValueLabel?: string;
}

/** Numeric, responsive area chart. Zero is measured; null/NaN splits each series independently. */
export function AreaChart({ data, label, comparison = false, showExtrema = false, showLegend = true, state = "ready", seriesLabel, previousSeriesLabel = "Anterior", projectedLabel = "Previsão", rangeLabel = "Faixa provável", formatValue = nf.format, labelStep = "auto", emptyMessage, unavailableMessage = "Sem medição no período.", loadingMessage, missingValueLabel = "Sem medição", className, ...props }: AreaChartProps) {
  const actualSeriesLabel = seriesLabel ?? (data.some(d => d.projected) ? "Realizado" : "Atual");
  const hasMeasurement = data.some(d => measured(d.value) || (comparison && measured(d.previousValue)) || (d.projected && measured(d.low) && measured(d.high) && d.low <= d.high));
  const actualState = state === "ready" && !data.length ? "empty" : state === "ready" && !hasMeasurement ? "unavailable" : state;
  return <div className={cn("flex min-w-0 flex-col gap-2 font-sans", className)} {...props}>
    {actualState === "unavailable" ? <p role="status" className="py-8 text-sm text-text-muted">{unavailableMessage}</p> : actualState !== "ready" ? <ChartStateMessage state={actualState} emptyMessage={emptyMessage} loadingMessage={loadingMessage} /> : <AreaChartPlot data={data} label={label} comparison={comparison} showExtrema={showExtrema} showLegend={showLegend} seriesLabel={actualSeriesLabel} previousSeriesLabel={previousSeriesLabel} projectedLabel={projectedLabel} rangeLabel={rangeLabel} formatValue={formatValue} labelStep={labelStep} missingValueLabel={missingValueLabel} />}
  </div>;
}

function AreaChartPlot({ data, label, comparison, showExtrema, showLegend, seriesLabel, previousSeriesLabel, projectedLabel, rangeLabel, formatValue, labelStep, missingValueLabel }: Required<Pick<AreaChartProps, "data" | "label" | "comparison" | "showExtrema" | "showLegend" | "seriesLabel" | "previousSeriesLabel" | "projectedLabel" | "rangeLabel" | "formatValue" | "labelStep" | "missingValueLabel">>) {
  const id = React.useId().replace(/:/g, "");
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const { active, bar, dim } = useActiveBar(data.length);
  const hasProjection = data.some(d => d.projected);
  const hasRange = data.some(d => d.projected && measured(d.low) && measured(d.high) && d.low <= d.high);
  const values = data.flatMap(d => [d.value, ...(comparison ? [d.previousValue] : []), ...(d.projected && measured(d.low) && measured(d.high) && d.low <= d.high ? [d.low, d.high] : [])]).filter(measured);
  const low = Math.min(0, ...values);
  const high = Math.max(0, ...values) || (low === 0 ? 1 : 0);
  const zeroY = 100 - (0 - low) / (high - low) * 100;
  const current = areaSegments(data.map(d => d.projected ? null : d.value), low, high);
  // Seed a projected run only at a contiguous measured boundary. A missing sample remains a gap.
  const projected = areaSegments(data.map((d, i) => d.projected || (data[i + 1]?.projected && measured(data[i + 1]?.value)) ? d.value : null), low, high);
  const ranges = rangeSegments(data, low, high);
  const previous = comparison ? areaSegments(data.map(d => d.previousValue), low, high) : [];
  const currentPoints = current.flat();
  const activeX = active === null ? null : data.length === 1 ? 50 : active / (data.length - 1) * 100;
  const activePoints = active === null ? [] : [
    ...(measured(data[active].value) ? [{ series: data[active].projected ? "projected" : "current", value: data[active].value, radius: 4 }] : []),
    ...(comparison && measured(data[active].previousValue) ? [{ series: "previous", value: data[active].previousValue!, radius: 3 }] : []),
  ];
  const extremes = showExtrema && currentPoints.length ? [currentPoints.reduce((a, b) => b.value > a.value ? b : a), currentPoints.reduce((a, b) => b.value < a.value ? b : a)].filter((p, i, all) => i === 0 || p.index !== all[0].index) : [];
  const labels = data.map(d => d.label);
  const shown = hasProjection ? projectedAxisLabels(labels, width ?? 300, labelStep) : axisLabelIndexes(labels, width, labelStep === "auto" ? undefined : labelStep);
  const tooltipRows = (index: number): ChartTooltipRow[] => {
    const d = data[index];
    const validRange = measured(d.low) && measured(d.high) && d.low <= d.high;
    return [{ label: d.projected ? projectedLabel : seriesLabel, value: measured(d.value) ? d.value : null, date: d.date, colorClass: d.projected ? "text-text-muted" : "text-chart-series1", lineStyle: d.projected ? "dashed" : "solid" },
      ...(d.parts ?? []),
      ...(d.projected && (d.low !== undefined || d.high !== undefined) ? [{ label: rangeLabel, value: null, valueText: validRange ? `entre ${formatValue(d.low!)} e ${formatValue(d.high!)}` : missingValueLabel, colorClass: "text-text-muted" }] : []),
      ...(comparison ? [{ label: previousSeriesLabel, value: measured(d.previousValue) ? d.previousValue! : null, date: d.previousDate, colorClass: "text-chart-series1", lineStyle: "dashed" as const }] : [])];
  };
  return <>
    <div className="relative flex min-w-0 gap-2">
      <div aria-hidden className="flex w-12 shrink-0 flex-col justify-between overflow-hidden pb-6 text-right text-chart-axis tabular-nums text-text-muted"><span className="truncate">{formatValue(high)}</span><span className="truncate">{formatValue((high + low) / 2)}</span><span className="truncate">{formatValue(low)}</span></div>
      <div ref={ref} className="min-w-0 flex-1">
        <div role="group" aria-label={label} className="relative h-40 min-w-0">
          <svg aria-hidden width="100%" height="100%" viewBox="0 -4 100 108" preserveAspectRatio="none" className="overflow-visible text-chart-series1">
            <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="currentColor" stopOpacity="0.3" /><stop offset="100%" stopColor="currentColor" stopOpacity="0.02" /></linearGradient></defs>
            {[0, 50, 100].map(y => <line key={y} x1="0" x2="100" y1={y} y2={y} className="stroke-border-default" vectorEffect="non-scaling-stroke" />)}
            {ranges.map((segment, i) => <path key={`range-${i}`} data-projected-range="" d={rangePath(segment)} className="text-text-muted" fill="currentColor" fillOpacity="0.06" />)}
            {current.map((points, i) => <g key={`current-${i}`}><path d={areaPath(points, zeroY)} fill={`url(#${id})`} /><path d={linePath(points)} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" /></g>)}
            {hasProjection && projected.map((points, i) => <g key={`projected-${i}`} className="text-text-muted"><path data-projected-area="" d={areaPath(points, zeroY)} fill="currentColor" fillOpacity="0.1" /><path data-projected-line="" d={linePath(points)} fill="none" stroke="currentColor" strokeDasharray="5 4" strokeWidth="2" vectorEffect="non-scaling-stroke" /></g>)}
            {previous.map((points, i) => <g key={`previous-${i}`}><path d={linePath(points)} fill="none" stroke="currentColor" strokeDasharray="5 4" strokeWidth="2" vectorEffect="non-scaling-stroke" /></g>)}
          </svg>
          {[...current.map(points => ({ points, neutral: false })), ...previous.map(points => ({ points, neutral: false })), ...(hasProjection ? projected.map(points => ({ points, neutral: true })) : [])].filter(({ points }) => points.length === 1).map(({ points, neutral }, i) => <span key={`dot-${i}`} aria-hidden className="pointer-events-none absolute size-1 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ backgroundColor: neutral ? "var(--inova-color-text-muted)" : "var(--inova-color-chart-series1)", left: `${points[0].x}%`, top: `${(points[0].y + 4) / 108 * 100}%` }} />)}
          {activeX !== null && <span aria-hidden data-active-guide="" className="pointer-events-none absolute top-0 border-l border-border-neutral" style={{ left: `${activeX}%`, bottom: `${4 / 108 * 100}%` }} />}
          {activePoints.map(point => <span key={point.series} aria-hidden data-active-point={point.series} className="pointer-events-none absolute box-border -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface-card" style={{ backgroundColor: point.series === "projected" ? "var(--inova-color-text-muted)" : "var(--inova-color-chart-series1)", left: `${activeX}%`, top: `${(100 - (point.value - low) / (high - low) * 100 + 4) / 108 * 100}%`, width: point.radius * 2, height: point.radius * 2 }} />)}
          <div className="absolute inset-0 flex">
            {data.map((d, i) => <span key={i} {...bar(i)} onPointerDown={event => { if (event.pointerType !== "mouse") event.currentTarget.focus(); }} role="img" aria-label={`${d.label}: ${tooltipRows(i).map(r => `${r.label}${r.date ? ` ${r.date}` : ""}: ${r.valueText ?? (r.value === null ? missingValueLabel : formatValue(r.value))}`).join("; ")}`} className={cn("h-full min-w-0 flex-1 cursor-default", dim(i))} />)}
          </div>
          {active === null && extremes.map((p, i) => <ChartExtremeMarker key={p.index} label={`${i === 0 ? "Máx." : "Mín."} ${formatValue(p.value)}`} className="absolute max-w-[50%] truncate" style={{ left: `${p.x}%`, top: `${(p.y + 4) / 108 * 100}%`, transform: `translate(${p.x > 50 ? "-100%" : "0"}, ${p.y < 50 ? "0" : "-100%"})` }} />)}
          {active !== null && <ComparisonTooltip index={active} count={data.length} title={`${data[active].label}${data[active].projected ? ` (${projectedLabel})` : ""}`} rows={tooltipRows(active)} formatValue={formatValue} missingValueLabel={missingValueLabel} />}
        </div>
        <div aria-hidden className="relative mt-2 h-4 min-w-0 overflow-hidden text-chart-axis text-text-muted">{shown.map(i => <span key={i} className={cn("absolute top-0 max-w-full truncate", i !== 0 && i !== data.length - 1 && "-translate-x-1/2", data[i].projected && "italic")} style={{ ...(hasProjection ? { maxWidth: data.length > 1 ? "45%" : "100%" } : {}), ...(data.length === 1 ? { left: "50%", transform: "translateX(-50%)" } : i === 0 ? { left: 0 } : i === data.length - 1 ? { right: 0 } : { left: `${i / (data.length - 1) * 100}%` }) }}>{data[i].label}</span>)}</div>
      </div>
    </div>
    {showLegend && <div className="flex flex-wrap gap-x-4 gap-y-2"><ChartLineKey label={seriesLabel} />{hasProjection && <ChartLineKey label={projectedLabel} colorClass="text-text-muted" lineStyle="dashed" />}{hasRange && <span className="inline-flex items-center gap-2 text-xs text-text-muted"><span aria-hidden className="h-3 w-5 bg-text-muted/6" />{rangeLabel}</span>}{comparison && <ChartLineKey label={previousSeriesLabel} lineStyle="dashed" />}</div>}
  </>;
}


/** Conservative label widths protect the two endpoints on narrow forecast charts. */
function projectedAxisLabels(labels: string[], width: number, step: number | "auto") {
  if (labels.length <= 1) return labels.map((_, i) => i);
  const max = Math.max(0, width * 0.45);
  const size = (i: number) => Math.min(max, labels[i].length * 8);
  const out = [0];
  let right = size(0);
  const lastLeft = width - size(labels.length - 1);
  const stride = typeof step === "number" && step > 0 ? Math.ceil(step) : 1;
  for (let i = stride; i < labels.length - 1; i += stride) {
    const center = i / (labels.length - 1) * width;
    if (center - size(i) / 2 >= right + 8 && center + size(i) / 2 <= lastLeft - 8) {
      out.push(i);
      right = center + size(i) / 2;
    }
  }
  out.push(labels.length - 1);
  return out;
}
