import * as React from "react";
import { cn } from "../lib/cn";

/**
 * Input · Figma "input" (context=field). White control, 56px on mobile and 48px from lg.
 * Label, help text, error and left/right icons are optional; help and error can show together.
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: React.ReactNode;
  help?: React.ReactNode;
  error?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, help, error, leftIcon, rightIcon, id, className, containerClassName, disabled, ...props }, ref) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;
    const helpId = help ? `${inputId}-help` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    return (
      <div className={cn("flex w-full flex-col gap-1 font-sans", containerClassName)}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <div
          className={cn(
            "flex h-14 items-center gap-2 rounded-12 border bg-surface-card px-3 lg:h-12",
            "border-border-default shadow-control transition-colors",
            "hover:border-border-strong focus-within:border-border-focus focus-within:outline-3 focus-within:outline-border-focus/50",
            error && "border-surface-danger outline-3 outline-surface-danger/20 focus-within:border-surface-danger focus-within:outline-surface-danger/20",
            disabled && "bg-surface-disabled text-text-disabled shadow-none hover:border-border-default",
            "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-text-muted",
          )}
        >
          {leftIcon}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={[errorId, helpId].filter(Boolean).join(" ") || undefined}
            className={cn(
              "min-w-0 flex-1 truncate bg-transparent text-base text-text-primary outline-none lg:text-sm",
              "placeholder:text-text-muted disabled:cursor-not-allowed",
              className,
            )}
            {...props}
          />
          {rightIcon}
        </div>
        {error && (
          <p id={errorId} className="text-xs text-surface-danger">
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
Input.displayName = "Input";
