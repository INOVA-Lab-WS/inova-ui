import * as React from "react";
import { cn } from "../lib/cn";

export interface TrendBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  direction?: "up" | "down" | "equal";
  /** Evaluation is independent of direction: rising costs can be unfavorable. */
  evaluation?: "neutral" | "favorable" | "unfavorable";
  value?: React.ReactNode;
  /** Localized description of the complete change, e.g. "Custo subiu 12%". */
  label?: string;
}

export function TrendBadge({ direction = "equal", evaluation = "neutral", value, label, children, className, ...props }: TrendBadgeProps) {
  return (
    <span role={label ? "img" : undefined} aria-label={label} data-direction={direction} data-evaluation={evaluation} className={cn(
      "inline-flex w-fit items-center gap-1 font-sans text-xs font-medium tabular-nums",
      evaluation === "favorable" ? "text-status-success-fg" : evaluation === "unfavorable" ? "text-status-error-fg" : "text-text-muted",
      className,
    )} {...props}>
      <span aria-hidden>{direction === "up" ? "▲" : direction === "down" ? "▼" : "="}</span>
      {!label && <span className="sr-only">{direction === "up" ? "Aumento" : direction === "down" ? "Queda" : "Sem variação"}: </span>}
      {value ?? children}
      {!label && evaluation !== "neutral" && <span className="sr-only"> ({evaluation === "favorable" ? "favorável" : "desfavorável"})</span>}
    </span>
  );
}
