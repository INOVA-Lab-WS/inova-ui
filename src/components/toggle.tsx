import * as React from "react";
import { cn } from "../lib/cn";

/** Toggle · Figma "toggle". 44x24 track, action green when on, white thumb. */
export interface ToggleProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ checked, defaultChecked, onCheckedChange, label, disabled, className, ...props }, ref) => {
    const [inner, setInner] = React.useState(defaultChecked ?? false);
    const on = checked ?? inner;
    return (
      <label className={cn("inline-flex items-center gap-2 font-sans text-base text-text-primary", disabled && "text-text-disabled", className)}>
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={on}
          disabled={disabled}
          onClick={() => {
            const next = !on;
            if (checked === undefined) setInner(next);
            onCheckedChange?.(next);
          }}
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 items-center rounded-pill transition-colors",
            on ? "bg-surface-action" : "bg-surface-control",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
            "disabled:bg-surface-disabled",
          )}
          {...props}
        >
          <span className={cn("size-5 rounded-pill bg-surface-card shadow-sm transition-transform", on ? "translate-x-5" : "translate-x-1")} />
        </button>
        {label}
      </label>
    );
  },
);
Toggle.displayName = "Toggle";
