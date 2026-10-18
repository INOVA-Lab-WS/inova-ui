import * as React from "react";
import { cn } from "../lib/cn";
import { MetricTile, type MetricTileProps } from "./metric-tile";

export interface MetricChartMetric extends Omit<MetricTileProps, "context" | "onActivate" | "selected" | "id"> {
  id: string;
  /** Static metrics display information without changing the chart. */
  selectable?: boolean;
}
export type MetricChartMetrics = readonly [MetricChartMetric, MetricChartMetric]
  | readonly [MetricChartMetric, MetricChartMetric, MetricChartMetric, MetricChartMetric]
  | readonly [MetricChartMetric, MetricChartMetric, MetricChartMetric, MetricChartMetric, MetricChartMetric, MetricChartMetric];

export interface MetricChartCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "title"> {
  metrics: MetricChartMetrics;
  title?: React.ReactNode;
  description?: React.ReactNode;
  activeMetric?: string;
  defaultActiveMetric?: string;
  onActiveMetricChange?: (id: string) => void;
  metricsLabel?: string;
  chartLabel?: string;
  /** Use none for content such as a frameless Table that meets the card edges. */
  bodyPadding?: "default" | "none";
  /** Supply a real chart, or render its series from the selected metric id. */
  children: React.ReactNode | ((activeMetric: string | undefined) => React.ReactNode);
}

export const MetricChartCard = React.forwardRef<HTMLDivElement, MetricChartCardProps>(({ metrics, title, description, activeMetric, defaultActiveMetric, onActiveMetricChange, metricsLabel = "Indicadores", chartLabel, bodyPadding = "default", children, className, ...props }, ref) => {
  const canSelect = (metric: MetricChartMetric) => metric.selectable !== false && metric.state !== "static" && metric.state !== "disabled" && metric.state !== "loading" && !metric.disabled && !metric.loading;
  const [internalActive, setInternalActive] = React.useState(() => defaultActiveMetric ?? metrics.find(canSelect)?.id);
  const requested = activeMetric !== undefined ? activeMetric : internalActive;
  const current = metrics.find(metric => metric.id === requested && canSelect(metric))?.id ?? metrics.find(canSelect)?.id;
  const select = (id: string) => {
    if (activeMetric === undefined) setInternalActive(id);
    onActiveMetricChange?.(id);
  };
  const hasHeader = !!(title || description);
  return (
    <div ref={ref} className={cn("min-w-0 rounded-16 border border-border-default bg-surface-card font-sans", className)} {...props}>
      {(title || description) && <div className="space-y-1 p-5 pb-3">{title && <h3 className="text-base font-bold text-text-primary">{title}</h3>}{description && <p className="text-sm text-text-muted">{description}</p>}</div>}
      <div role="group" aria-label={metricsLabel} className={cn("scrollbar-none flex snap-x snap-mandatory overflow-x-auto border-b border-border-default desktop:grid desktop:overflow-visible", !hasHeader && "rounded-t-[15px]", metrics.length === 6 ? "desktop:grid-cols-6" : metrics.length === 2 ? "desktop:grid-cols-2" : "desktop:grid-cols-4")}>
        {metrics.map(({ id, selectable, className: metricClassName, ...metric }, index) => <MetricTile key={id} {...metric} context="embedded" selected={id === current && selectable !== false && metric.state !== "static"} onActivate={selectable === false || metric.state === "static" ? undefined : () => select(id)} className={cn("snap-start desktop:min-w-0 [&>button[aria-pressed]:focus-visible]:outline-offset-[-2px]", metric.state === "focus" && "outline-offset-[-2px]", !hasHeader && index === 0 && "desktop:rounded-tl-[15px]", !hasHeader && index === metrics.length - 1 && "desktop:rounded-tr-[15px]", metricClassName)} />)}
      </div>
      <div role={chartLabel ? "group" : undefined} aria-label={chartLabel} className={cn("min-w-0", bodyPadding === "default" && "p-4 desktop:p-5")}>{typeof children === "function" ? children(current) : children}</div>
    </div>
  );
});
MetricChartCard.displayName = "MetricChartCard";
