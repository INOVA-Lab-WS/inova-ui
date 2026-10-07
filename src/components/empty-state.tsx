import * as React from "react";
import { cn } from "../lib/cn";

/**
 * EmptyState · Figma "empty-state". Icon in a surface-muted badge, title, supporting text (up to 256px) and an
 * optional action (a Button or Chip), centred in the space that holds it. size compact sits inside a card or panel;
 * page fills a whole area. The icon is aria-hidden. Pass announce after a search so screen readers hear it
 * (role="status"). EmptyMark is the dash for an empty table cell, with text for screen readers.
 */
export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  size?: "compact" | "page";
  /** Announce it (role="status"), e.g. when it appears after a search. */
  announce?: boolean;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, size = "compact", announce, className, ...props }, ref) => {
    const page = size === "page";
    return (
      <div
        ref={ref}
        role={announce ? "status" : undefined}
        className={cn("flex w-full flex-col items-center px-4 text-center font-sans", page ? "gap-3 py-12" : "gap-2 py-6", className)}
        {...props}
      >
        {icon && (
          <span aria-hidden className={cn("flex items-center justify-center rounded-16 bg-surface-muted text-text-primary", page ? "size-14 [&_svg]:size-6" : "size-10 [&_svg]:size-5")}>
            {icon}
          </span>
        )}
        <p className={cn("font-semibold text-text-primary", page ? "text-xl" : "text-base")}>{title}</p>
        {description && <p className="max-w-64 text-sm text-text-muted">{description}</p>}
        {action && <div className="mt-1">{action}</div>}
      </div>
    );
  },
);
EmptyState.displayName = "EmptyState";

/** A dash for a table cell with no value; screen readers hear label (default "sem valor"). */
export function EmptyMark({ label = "sem valor", className }: { label?: string; className?: string }) {
  return (
    <span className={cn("text-text-muted", className)}>
      <span aria-hidden>—</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
