import * as React from "react";
import { cn } from "../lib/cn";

/** Textarea · Figma "textarea". Same structure as Input; min height 128px mobile, 112px desktop. */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  help?: React.ReactNode;
  error?: React.ReactNode;
  containerClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, help, error, id, className, containerClassName, disabled, ...props }, ref) => {
    const autoId = React.useId();
    const fieldId = id ?? autoId;
    const helpId = help ? `${fieldId}-help` : undefined;
    const errorId = error ? `${fieldId}-error` : undefined;
    return (
      <div className={cn("flex w-full flex-col gap-1 font-sans", containerClassName)}>
        {label && (
          <label htmlFor={fieldId} className="text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={fieldId}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={[errorId, helpId].filter(Boolean).join(" ") || undefined}
          className={cn(
            "min-h-32 w-full resize-y rounded-12 border border-border-default bg-surface-card p-3 text-base text-text-primary lg:min-h-28 lg:text-sm",
            "shadow-control outline-none transition-colors placeholder:text-text-muted",
            "hover:border-border-strong focus-visible:border-border-focus focus-visible:outline-3 focus-visible:outline-border-focus/50",
            error && "border-surface-danger outline-3 outline-surface-danger/20",
            "disabled:cursor-not-allowed disabled:bg-surface-disabled disabled:text-text-disabled disabled:shadow-none",
            className,
          )}
          {...props}
        />
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
Textarea.displayName = "Textarea";
