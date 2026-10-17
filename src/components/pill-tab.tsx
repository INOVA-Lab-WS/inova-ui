import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../lib/cn";

/**
 * PillTab · Figma "pill-tab". Segmented tab inside a muted rail; selected uses the card surface and raised shadow.
 * With asChild the child (e.g. a Link) carries the look; when each tab is a page, it is a link with aria-current="page", not role="tab".
 */
export const pillTabClassName = (selected?: boolean) =>
  cn(
    "inline-flex shrink-0 items-center justify-center gap-1 rounded-8 px-4 py-1.5 font-sans text-sm whitespace-nowrap no-underline transition-colors outline-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
    selected ? "bg-surface-card font-semibold text-text-primary shadow-raised" : "text-text-muted hover:bg-surface-control",
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
  /**
   * Figma pill-tabs width=full (#79): the group takes the whole width and each pill shares it equally, label centered
   * (e.g. the language choice in the profile menu). Default false: each pill hugs its label and the row scrolls sideways.
   */
  fullWidth?: boolean;
}

export function PillTabs({ className, navigation, fullWidth, ...props }: PillTabsProps) {
  const cls = cn("inline-flex max-w-full items-center gap-1 rounded-12 bg-surface-muted p-1", fullWidth ? "w-full [&>*]:min-w-0 [&>*]:flex-1 [&>*]:justify-center" : "overflow-x-auto", className);
  return navigation ? <nav className={cls} {...props} /> : <div role="tablist" className={cls} {...props} />;
}
