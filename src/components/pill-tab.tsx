import * as React from "react";
import { cn } from "../lib/cn";

/** PillTab · Figma "pill-tab". Segmented tab pill (36px); selected uses the selected surface. */
export interface PillTabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export const PillTab = React.forwardRef<HTMLButtonElement, PillTabProps>(({ selected, className, type = "button", ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    role="tab"
    aria-selected={selected}
    className={cn(
      "inline-flex h-9 items-center rounded-pill px-3 font-sans text-sm whitespace-nowrap transition-colors outline-none",
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
      selected ? "bg-surface-selected font-semibold text-text-primary" : "font-medium text-text-muted hover:bg-surface-control",
      className,
    )}
    {...props}
  />
));
PillTab.displayName = "PillTab";

export function PillTabs({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div role="tablist" className={cn("flex items-center gap-1 overflow-x-auto", className)} {...props} />;
}
