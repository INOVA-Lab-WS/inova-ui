import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "../lib/cn";

/**
 * Rating · Figma "rating" (stars from "rating-star"). Whole score from 1 to 5; 0 means no score yet.
 * Click a star to set it; click the current score again to clear it. Hover previews up to the star under the pointer.
 * previousValue shows last cycle's score in neutral gray: the current score sits on top and the previous one shows
 * where it goes beyond it. Screen readers hear both ("3 de 5, ciclo anterior 2 de 5"). Without it, nothing changes.
 * Keyboard: radiogroup with roving tabindex; arrows change the score, Home and End jump to 1 and 5.
 * readOnly shows a whole score without interaction. An average (e.g. 3,7) is shown as a number only, outside it.
 * size 20 (evaluation row, 32px cell, 48px touch target below 768px) or 16 (tables and legends).
 */
export interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Last cycle's score (1 to max), in neutral gray behind the current one. */
  previousValue?: number;
  max?: number;
  size?: 20 | 16;
  disabled?: boolean;
  readOnly?: boolean;
  /** Accessible name of the group, e.g. the skill being rated. */
  label: string;
  /** Form field name: a hidden input with the score (0 when empty). */
  name?: string;
}

export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  ({ value: valueProp, defaultValue = 0, onValueChange, previousValue, max = 5, size = 20, disabled, readOnly, label, name, className, ...props }, ref) => {
    const [inner, setInner] = React.useState(defaultValue);
    const value = valueProp ?? inner;
    const [hover, setHover] = React.useState(0);
    const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
    const interactive = !disabled && !readOnly;
    const set = (next: number) => {
      if (!interactive) return;
      if (valueProp === undefined) setInner(next);
      onValueChange?.(next);
    };
    const move = (next: number) => {
      const n = Math.min(max, Math.max(1, next));
      set(n);
      refs.current[n - 1]?.focus();
    };
    const onKeyDown = (e: React.KeyboardEvent) => {
      const keys: Record<string, number> = { ArrowRight: value + 1, ArrowUp: value + 1, ArrowLeft: value - 1, ArrowDown: value - 1, Home: 1, End: max };
      if (e.key in keys) {
        e.preventDefault();
        move(keys[e.key]);
      }
    };
    const shown = hover || value;
    const prev = previousValue && previousValue > 0 ? Math.min(max, previousValue) : 0;
    const prevText = prev ? `, ciclo anterior ${prev} de ${max}` : "";
    return (
      <div
        ref={ref}
        role={readOnly ? "img" : "radiogroup"}
        aria-label={readOnly ? `${label}: ${value} de ${max}${prevText}` : prev ? `${label}${prevText}` : label}
        aria-disabled={disabled || undefined}
        onMouseLeave={() => setHover(0)}
        className={cn("inline-flex items-center", className)}
        {...props}
      >
        {Array.from({ length: max }, (_, i) => {
          const n = i + 1;
          const filled = n <= shown;
          const previous = !filled && n <= prev;
          const tone = disabled
            ? filled
              ? "fill-text-disabled text-text-disabled"
              : "text-border-strong"
            : filled
              ? "fill-rating-filled text-rating-filled"
              : previous
                ? "fill-border-strong text-border-strong"
                : "text-border-strong";
          const star = <Star aria-hidden strokeWidth={1.5} className={cn(size === 20 ? "size-5" : "size-4", tone)} />;
          if (readOnly) return <span key={n} className={cn("flex items-center justify-center", size === 20 ? "size-8" : "size-5")}>{star}</span>;
          const checked = n === value;
          return (
            <button
              key={n}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={`${n} de ${max}`}
              tabIndex={checked || (value === 0 && n === 1) ? 0 : -1}
              disabled={disabled}
              onClick={() => set(checked ? 0 : n)}
              onMouseEnter={() => interactive && setHover(n)}
              onKeyDown={onKeyDown}
              className={cn(
                "flex items-center justify-center rounded-8 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary disabled:cursor-not-allowed",
                size === 20 ? "size-12 tablet:size-8" : "size-5",
              )}
            >
              {star}
            </button>
          );
        })}
        {name && <input type="hidden" name={name} value={value} />}
      </div>
    );
  },
);
Rating.displayName = "Rating";
