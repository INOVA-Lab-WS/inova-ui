import * as React from "react";
import { cn } from "../lib/cn";

/**
 * Slider · Figma "slider". Picks a number in a range: min, max, step, value/defaultValue, onValueChange, name.
 * The value shows beside the track in tabular-nums and pt-BR format (formatValue for the unit: 45%, 0,70).
 * Track surface-muted, range surface-action, 20px thumb with a 48px target below 768px.
 * Keyboard: arrows move 1 step, Page Up/Down 10 steps, Home/End go to the limits. role="slider" with a readable
 * aria-valuetext (valueText, default "45 por cento" when the unit is %). Focus ring follows the package standard.
 */
export interface SliderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  /** Accessible name, e.g. "Progresso da meta". */
  label: string;
  name?: string;
  /** How the value reads on screen, e.g. v => `${v}%`. Default: pt-BR number. */
  formatValue?: (value: number) => string;
  /** How a screen reader hears it, e.g. v => `${v} por cento`. Default: formatValue, with % read as "por cento". */
  valueText?: (value: number) => string;
  /** Hide the value beside the track. */
  hideValue?: boolean;
}

const decimals = (n: number) => (String(n).split(".")[1] ?? "").length;

export const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ value: valueProp, defaultValue, onValueChange, min = 0, max = 100, step = 1, disabled, label, name, formatValue, valueText, hideValue, className, ...props }, ref) => {
    const [inner, setInner] = React.useState(defaultValue ?? min);
    const value = valueProp ?? inner;
    const trackRef = React.useRef<HTMLDivElement>(null);
    const dp = decimals(step);
    const fmt = formatValue ?? ((v: number) => new Intl.NumberFormat("pt-BR", { minimumFractionDigits: dp, maximumFractionDigits: dp }).format(v));
    const spoken = valueText ?? ((v: number) => fmt(v).replace(/%$/, " por cento"));
    const clamp = (v: number) => {
      const snapped = Math.round((v - min) / step) * step + min;
      return Number(Math.min(max, Math.max(min, snapped)).toFixed(dp));
    };
    const set = (v: number) => {
      if (disabled) return;
      const next = clamp(v);
      if (valueProp === undefined) setInner(next);
      if (next !== value) onValueChange?.(next);
    };
    const fromPointer = (clientX: number) => {
      const r = trackRef.current?.getBoundingClientRect();
      if (!r) return;
      set(min + ((clientX - r.left) / r.width) * (max - min));
    };
    const onKeyDown = (e: React.KeyboardEvent) => {
      const map: Record<string, number> = { ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step, PageUp: step * 10, PageDown: -step * 10 };
      if (e.key in map) set(value + map[e.key]);
      else if (e.key === "Home") set(min);
      else if (e.key === "End") set(max);
      else return;
      e.preventDefault();
    };
    const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;
    return (
      <div ref={ref} className={cn("flex items-center gap-3 font-sans", className)} {...props}>
        <div
          ref={trackRef}
          className={cn("relative flex h-12 min-w-0 flex-1 touch-none items-center tablet:h-6", disabled ? "cursor-not-allowed" : "cursor-pointer")}
          onPointerDown={(e) => {
            if (disabled) return;
            e.currentTarget.setPointerCapture(e.pointerId);
            fromPointer(e.clientX);
          }}
          onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && fromPointer(e.clientX)}
        >
          <span className="absolute inset-x-0 h-1 rounded-pill bg-surface-muted" />
          <span className={cn("absolute left-0 h-1 rounded-pill", disabled ? "bg-surface-disabled" : "bg-surface-action")} style={{ width: `${pct}%` }} />
          <span
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-label={label}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-valuetext={spoken(value)}
            aria-disabled={disabled || undefined}
            onKeyDown={onKeyDown}
            className={cn(
              "absolute size-5 -translate-x-1/2 rounded-pill border-[1.5px] bg-surface-card outline-none transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
              disabled ? "border-surface-disabled" : "border-border-strong shadow-control hover:border-2 hover:border-text-primary",
            )}
            style={{ left: `${pct}%` }}
          />
        </div>
        {!hideValue && <span className={cn("min-w-10 text-right text-sm font-medium tabular-nums", disabled ? "text-text-disabled" : "text-text-primary")}>{fmt(value)}</span>}
        {name && <input type="hidden" name={name} value={value} />}
      </div>
    );
  },
);
Slider.displayName = "Slider";
