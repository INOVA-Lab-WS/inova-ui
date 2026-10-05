import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../lib/cn";

/**
 * PillTab · Figma "pill-tab". Segmented tab pill (36px); selected uses the selected surface.
 * With asChild the child (e.g. a Link) carries the look; when each tab is a page, it is a link with aria-current="page", not role="tab".
 */
export const pillTabClassName = (selected?: boolean) =>
  cn(
    "inline-flex h-9 items-center rounded-pill px-3 font-sans text-sm whitespace-nowrap no-underline transition-colors outline-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
    selected ? "bg-surface-selected font-semibold text-text-primary" : "font-medium text-text-muted hover:bg-surface-control",
  );

export interface PillTabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  asChild?: boolean;
}

export const PillTab = React.forwardRef<HTMLButtonElement, PillTabProps>(({ selected, asChild, className, type = "button", ...props }, ref) =>
  asChild ? (
    <Slot ref={ref} aria-current={selected ? "page" : undefined} className={cn(pillTabClassName(selected), className)} {...props} />
  ) : (
  <button
    ref={ref}
    type={type}
    role="tab"
    aria-selected={selected}
    className={cn(pillTabClassName(selected), className)}
    {...props}
  />
  ),
);
PillTab.displayName = "PillTab";

export interface PillTabsProps extends React.HTMLAttributes<HTMLElement> {
  /** Tabs that are pages (PillTab asChild with links): renders a <nav> instead of a tablist. Give it an aria-label. */
  navigation?: boolean;
}

export function PillTabs({ className, navigation, ...props }: PillTabsProps) {
  const cls = cn("flex items-center gap-1 overflow-x-auto", className);
  return navigation ? <nav className={cls} {...props} /> : <div role="tablist" className={cls} {...props} />;
}
