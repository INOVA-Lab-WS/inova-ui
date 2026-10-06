import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

/**
 * Select · Figma "input" with the right chevron (the library merged select into input). Native <select>, the most
 * accessible on phones, with the Input look: 56px on mobile and 48px from lg, white, label, help and error.
 * Works in a plain form (name, defaultValue) or controlled (value, onChange).
 */
export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: React.ReactNode;
  help?: React.ReactNode;
  error?: React.ReactNode;
  /** Shown as the first, empty option when there is no value. */
  placeholder?: string;
  containerClassName?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, help, error, placeholder, id, className, containerClassName, disabled, children, ...props }, ref) => {
    const autoId = React.useId();
    const selectId = id ?? autoId;
    const helpId = help ? `${selectId}-help` : undefined;
    const errorId = error ? `${selectId}-error` : undefined;
    return (
      <div className={cn("flex w-full flex-col gap-1 font-sans", containerClassName)}>
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <div
          className={cn(
            "relative flex h-14 items-center rounded-12 border bg-surface-card lg:h-12",
            "border-border-default shadow-[0_1px_2px_rgb(0_0_0/0.05)] transition-colors",
            "hover:border-border-strong focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-text-primary",
            error && "border-status-error-fg",
            disabled && "bg-surface-disabled text-text-disabled shadow-none hover:border-border-default",
          )}
        >
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={[errorId, helpId].filter(Boolean).join(" ") || undefined}
            className={cn(
              "h-full w-full appearance-none truncate rounded-12 bg-transparent pr-10 pl-4 text-base text-text-primary outline-none lg:pl-3 lg:text-sm",
              "disabled:cursor-not-allowed",
              className,
            )}
            {...props}
          >
            {placeholder !== undefined && <option value="">{placeholder}</option>}
            {children}
          </select>
          <ChevronDown aria-hidden className="pointer-events-none absolute right-4 size-4 text-text-muted lg:right-3" />
        </div>
        {error && (
          <p id={errorId} className="text-xs text-status-error-fg">
            {error}
          </p>
        )}
        {help && (
          <p id={helpId} className="text-xs text-text-muted">
            {help}
          </p>
        )}
      </div>
    );
  },
);
Select.displayName = "Select";
