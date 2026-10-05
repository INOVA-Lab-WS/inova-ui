import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";

/** Checkbox · Figma "checkbox". 20px box, checked in action green with Check icon; invalid and disabled states. */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  invalid?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, invalid, className, disabled, id, ...props }, ref) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;
    return (
      <label htmlFor={inputId} className={cn("inline-flex items-center gap-2 font-sans text-base text-text-primary", disabled && "text-text-disabled", className)}>
        <span className="relative inline-flex size-5 shrink-0">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            disabled={disabled}
            aria-invalid={invalid || undefined}
            className={cn(
              "peer size-5 appearance-none rounded-4 border border-border-strong bg-surface-card transition-colors",
              "checked:border-surface-action checked:bg-surface-action",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
              invalid && "border-status-error-fg",
              "disabled:border-border-neutral disabled:bg-surface-disabled",
            )}
            {...props}
          />
          <Check aria-hidden className="pointer-events-none absolute inset-0 m-auto size-4 text-text-on-action opacity-0 peer-checked:opacity-100" />
        </span>
        {label}
      </label>
    );
  },
);
Checkbox.displayName = "Checkbox";
