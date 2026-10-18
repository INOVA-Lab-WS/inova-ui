import * as React from "react";
import { cn } from "../lib/cn";
import { Card, type CardProps } from "./card";
import { Badge, type BadgeColor } from "./badge";
import { nf } from "./chart-shared";

/** Numbers are formatted without interpreting currency, source, target rules or arithmetic. */
export type ForecastValue = number | string | null;
export interface ForecastBreakdownItem { label: string; value: ForecastValue; color?: BadgeColor }
export interface ForecastBreakdownGroup { label: string; total: ForecastValue; items: readonly ForecastBreakdownItem[] }
export interface ForecastCardProps extends Omit<CardProps, "children" | "title"> {
  period: React.ReactNode;
  value: ForecastValue;
  description?: React.ReactNode;
  range?: { low: ForecastValue; high: ForecastValue };
  target?: ForecastValue;
  /** Caller-owned evaluation, separate from the numeric sign of the forecast. */
  targetStatus?: { label: string; status: "met" | "below" | "neutral" };
  valueTone?: "neutral" | "negative";
  formatValue?: (value: number) => string;
  breakdown?: readonly [ForecastBreakdownGroup, ForecastBreakdownGroup];
  missingValueLabel?: string;
}

/** One period forecast composed from Card, origin Badges and caller-provided presentation data. */
export const ForecastCard = React.forwardRef<HTMLDivElement, ForecastCardProps>(({ period, value, description = "Resultado previsto", range, target, targetStatus, valueTone, formatValue = nf.format, breakdown, missingValueLabel = "Não medido", className, ...props }, ref) => {
  const display = (v: ForecastValue) => v === null || (typeof v === "number" && !Number.isFinite(v)) ? missingValueLabel : typeof v === "number" ? formatValue(v) : v;
  const negative = valueTone === "negative" || (valueTone === undefined && typeof value === "number" && value < 0);
  const headingId = React.useId();
  return <Card ref={ref} aria-labelledby={headingId} className={cn("flex min-w-0 flex-col gap-4", className)} {...props}>
    <div className="flex min-w-0 flex-col gap-1">
      <h3 id={headingId} className="text-base font-bold text-text-primary">{period}</h3>
      {description && <p className="text-xs text-text-muted">{description}</p>}
      <p className={cn("break-words text-2xl font-bold tabular-nums", negative ? "text-status-error-fg" : "text-text-primary")}>{display(value)}</p>
      <div className="flex flex-wrap items-start justify-between gap-2">
        {(range || target !== undefined) && <p className="min-w-0 flex-1 text-xs text-text-muted">{range && <>entre {display(range.low)} e {display(range.high)}</>}{range && target !== undefined && " · "}{target !== undefined && <>meta {display(target)}</>}</p>}
        {targetStatus && <Badge tone="light" color={targetStatus.status === "met" ? "green" : targetStatus.status === "below" ? "red" : "beige"} className="max-w-full whitespace-normal">{targetStatus.label}</Badge>}
      </div>
    </div>
    {breakdown && <div className="flex flex-col gap-4 border-t border-border-default pt-4">
      {breakdown.map((group, groupIndex) => <section key={groupIndex} aria-label={group.label} className="min-w-0 space-y-2">
        <div className="flex min-w-0 items-baseline justify-between gap-3 text-sm font-bold"><h4 className="min-w-0 break-words">{group.label}</h4><span className="min-w-0 break-words text-right tabular-nums">{display(group.total)}</span></div>
        <ul className="space-y-2">{group.items.map((item, index) => <li key={index} className="flex min-w-0 items-center justify-between gap-3 text-xs"><Badge color={item.color ?? `category${index % 5 + 1}` as BadgeColor} tone="light" className="min-w-0 max-w-[65%] shrink whitespace-normal break-words">{item.label}</Badge><span className="min-w-0 break-words text-right tabular-nums">{display(item.value)}</span></li>)}</ul>
      </section>)}
    </div>}
  </Card>;
});
ForecastCard.displayName = "ForecastCard";

export interface ForecastCardGroupProps extends React.HTMLAttributes<HTMLDivElement> { columns?: 2 | 3 | 4 }
const COLUMNS = { 2: "desktop:grid-cols-2", 3: "desktop:grid-cols-3", 4: "desktop:grid-cols-4" } as const;
/** Horizontal mobile scroll and snap; the same cards become equal columns on desktop. */
export function ForecastCardGroup({ children, columns = 3, className, ...props }: ForecastCardGroupProps) {
  return <div role="list" className={cn("scrollbar-none flex min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto desktop:grid desktop:overflow-visible", COLUMNS[columns], className)} {...props}>
    {React.Children.map(children, child => <div role="listitem" className="flex w-[min(85vw,20rem)] shrink-0 snap-start desktop:w-auto [&>*]:min-w-0 [&>*]:flex-1">{child}</div>)}
  </div>;
}
