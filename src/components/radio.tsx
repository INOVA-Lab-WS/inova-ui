import * as React from "react";
import { cn } from "../lib/cn";

/** Radio · Figma "radio". 20px circle, selected with action green dot; invalid and disabled states. */
export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  invalid?: boolean;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(({ label, invalid, className, disabled, id, ...props }, ref) => {
  const autoId = React.useId();
  const inputId = id ?? autoId;
  return (
    <label htmlFor={inputId} className={cn("inline-flex items-center gap-2 font-sans text-base text-text-primary", disabled && "text-text-disabled", className)}>
      <span className="relative inline-flex size-5 shrink-0">
        <input
          ref={ref}
          id={inputId}
          type="radio"
          disabled={disabled}
          aria-invalid={invalid || undefined}
          className={cn(
            "peer size-5 appearance-none rounded-pill border border-border-strong bg-surface-card transition-colors",
            "checked:border-surface-action",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
            invalid && "border-surface-danger",
            "disabled:border-border-strong disabled:bg-surface-disabled",
          )}
          {...props}
        />
        <span aria-hidden className="pointer-events-none absolute inset-0 m-auto size-2.5 rounded-pill bg-surface-action opacity-0 peer-checked:opacity-100" />
      </span>
      {label}
    </label>
  );
});
Radio.displayName = "Radio";
