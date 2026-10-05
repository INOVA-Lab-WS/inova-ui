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
            "min-h-32 w-full resize-y rounded-12 border border-border-default bg-surface-card px-4 py-3 text-base text-text-primary lg:min-h-28 lg:px-3 lg:text-sm",
            "shadow-[0_1px_2px_rgb(0_0_0/0.05)] outline-none transition-colors placeholder:text-text-muted",
            "hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
            error && "border-status-error-fg",
            "disabled:cursor-not-allowed disabled:bg-surface-disabled disabled:text-text-disabled disabled:shadow-none",
            className,
          )}
          {...props}
        />
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
Textarea.displayName = "Textarea";
