import * as React from "react";
import { cn } from "../lib/cn";

/**
 * ScrollArea · Figma "scroll-area". A scrolling region with a thin bar (6px, 8px on hover) that shows while
 * scrolling or hovering and fades after; on touch the system bar. orientation vertical, horizontal or both.
 * It takes focus (tabIndex 0) so the arrows scroll it when nothing inside is focusable; pass tabIndex={-1} to opt out.
 * For side-scrolling rails with no bar at all, use the scrollbar-none utility from the theme.
 */
export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal" | "both";
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(({ orientation = "vertical", className, tabIndex = 0, ...props }, ref) => {
  const [active, setActive] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);
  const wake = () => {
    setActive(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setActive(false), 800);
  };
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  return (
    <div
      ref={ref}
      tabIndex={tabIndex}
      data-scrolling={active || undefined}
      onScroll={wake}
      onPointerEnter={wake}
      onPointerMove={wake}
      className={cn(
        orientation === "vertical" && "overflow-y-auto overflow-x-hidden",
        orientation === "horizontal" && "overflow-x-auto overflow-y-hidden",
        orientation === "both" && "overflow-auto",
        "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
        // thin bar: transparent track, surface-selected thumb, border-strong on hover; hidden until active
        "[scrollbar-width:thin] [scrollbar-color:transparent_transparent] data-[scrolling]:[scrollbar-color:var(--color-surface-selected)_transparent]",
        "[&::-webkit-scrollbar]:size-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-pill [&::-webkit-scrollbar-thumb]:bg-transparent",
        "data-[scrolling]:[&::-webkit-scrollbar-thumb]:bg-surface-selected [&::-webkit-scrollbar-thumb:hover]:bg-border-strong hover:[&::-webkit-scrollbar]:size-2",
        className,
      )}
      {...props}
    />
  );
});
ScrollArea.displayName = "ScrollArea";
