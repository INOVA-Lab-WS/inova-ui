import * as React from "react";
import { cn } from "../lib/cn";
import { Divider } from "./divider";

/** Menu · Figma "menu". Rail (64px, desktop) or fullscreen (mobile), with logo, navigation and footer slots. */
export interface MenuProps extends React.HTMLAttributes<HTMLElement> {
  presentation?: "rail" | "fullscreen";
  logo?: React.ReactNode;
  navigation?: React.ReactNode;
  footer?: React.ReactNode;
  showFooter?: boolean;
  label?: string;
}

export const Menu = React.forwardRef<HTMLElement, MenuProps>(
  ({ presentation = "rail", logo, navigation, footer, showFooter = true, label = "Menu principal", className, ...props }, ref) => {
    const rail = presentation === "rail";
    return (
      <nav
        ref={ref}
        aria-label={label}
        className={cn(
          "flex flex-col bg-linear-to-t from-surface-canvas-bottom to-surface-canvas-top",
          rail ? "h-full w-16 items-center gap-3 border-r border-border-default py-4" : "fixed inset-0 z-40 w-full",
          className,
        )}
        {...props}
      >
        {logo && (
          <div className={cn("flex shrink-0 items-center", rail ? "justify-center" : "h-16 px-4 pt-[var(--inova-safe-area-top)]")}>
            {logo}
          </div>
        )}
        {rail && logo && <Divider className="w-8" />}
        <div className={cn("flex min-h-0 flex-1 flex-col overflow-y-auto", rail ? "items-center gap-3" : "gap-2 p-4")}>{navigation}</div>
        {showFooter && footer && (
          <div className={cn("shrink-0 font-sans text-xs text-text-muted", rail ? "text-center" : "px-4 py-4")}>{footer}</div>
        )}
      </nav>
    );
  },
);
Menu.displayName = "Menu";
