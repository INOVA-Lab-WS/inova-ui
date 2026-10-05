import * as React from "react";
import { cn } from "../lib/cn";
import { Header, type HeaderProps } from "./header";
import { NavigationTabBar, type NavigationTab } from "./navigation-tab-bar";

/** Top area · Figma "top-area". Header, then a 54px tab row with the navigation tab bar. */
export interface TopAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  panel: string;
  onPanelChange?: (panel: string) => void;
  tabs?: NavigationTab[];
  headerProps?: HeaderProps;
}

export const TopArea = React.forwardRef<HTMLDivElement, TopAreaProps>(
  ({ panel, onPanelChange, tabs, headerProps, className, ...props }, ref) => (
    <div ref={ref} className={cn("flex w-full flex-col pt-[var(--inova-safe-area-top)]", className)} {...props}>
      <Header {...headerProps} />
      <div className="flex h-14 items-center px-4">
        <NavigationTabBar tabs={tabs} value={panel} onValueChange={onPanelChange} />
      </div>
    </div>
  ),
);
TopArea.displayName = "TopArea";
