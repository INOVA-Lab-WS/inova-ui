import * as React from "react";
import { cn } from "../lib/cn";

/** Divider · Figma "divider". 1px line in border/default. */
export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ orientation = "horizontal", className, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      aria-orientation={orientation}
      className={cn("shrink-0 bg-border-default", orientation === "horizontal" ? "h-px w-full" : "h-full w-px", className)}
      {...props}
    />
  ),
);
Divider.displayName = "Divider";
