import * as React from "react";
import { cn } from "../lib/cn";
import { Chip } from "./chip";

/** Navigation tab bar · Figma "navigation-tab-bar". 3 small chips; the active one filled, others ghost. */
export interface NavigationTab {
  value: string;
  label: string;
}

export const defaultNavigationTabs: NavigationTab[] = [
  { value: "chat", label: "Chat" },
  { value: "produtos", label: "Produtos" },
  { value: "catalogo", label: "Catálogo" },
];

export interface NavigationTabBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  tabs?: NavigationTab[];
  value: string;
  onValueChange?: (value: string) => void;
}

export const NavigationTabBar = React.forwardRef<HTMLDivElement, NavigationTabBarProps>(
  ({ tabs = defaultNavigationTabs, value, onValueChange, className, ...props }, ref) => (
    <div ref={ref} role="tablist" className={cn("flex items-center gap-1", className)} {...props}>
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <Chip
            key={tab.value}
            role="tab"
            aria-selected={active}
            size="small"
            appearance={active ? "filled" : "ghost"}
            onClick={() => onValueChange?.(tab.value)}
          >
            {tab.label}
          </Chip>
        );
      })}
    </div>
  ),
);
NavigationTabBar.displayName = "NavigationTabBar";
