import * as React from "react";
import { cn } from "../lib/cn";
import { X } from "lucide-react";
import { Divider } from "./divider";
import { Button } from "./button";

/**
 * Menu · Figma "menu". Rail (64px, desktop) or fullscreen (mobile), with logo, navigation and footer slots.
 * Fullscreen has a 64px top bar like Figma's header "menu64": logo centred, close X on the right. Esc calls onClose,
 * and the first navigation item takes focus when it opens. Items are ActionCard context="rail" or "menu".
 */
export interface MenuProps extends React.HTMLAttributes<HTMLElement> {
  presentation?: "rail" | "fullscreen";
  logo?: React.ReactNode;
  navigation?: React.ReactNode;
  footer?: React.ReactNode;
  showFooter?: boolean;
  label?: string;
  /** Fullscreen only: closes the menu (X button and Esc). The app returns focus to the button that opened it. */
  onClose?: () => void;
  closeLabel?: string;
}

export const Menu = React.forwardRef<HTMLElement, MenuProps>(
  ({ presentation = "rail", logo, navigation, footer, showFooter = true, label = "Menu principal", onClose, closeLabel = "Fechar menu", className, ...props }, ref) => {
    const rail = presentation === "rail";
    const navRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      if (rail) return;
      navRef.current?.querySelector<HTMLElement>("a, button, [tabindex]:not([tabindex='-1'])")?.focus();
      if (!onClose) return;
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [rail, onClose]);
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
        {rail ? (
          logo && <div className="flex h-5 shrink-0 items-center justify-center">{logo}</div>
        ) : (
          <div className="grid h-16 shrink-0 grid-cols-[48px_1fr_48px] items-center px-2 pt-[var(--inova-safe-area-top)] box-content">
            <span />
            <div className="flex items-center justify-center">{logo}</div>
            {onClose && (
              <Button variant="ghost" size="desktop" iconOnly aria-label={closeLabel} onClick={onClose}>
                <X aria-hidden />
              </Button>
            )}
          </div>
        )}
        {rail && logo && <Divider className="w-8" />}
        <div ref={navRef} className={cn("flex min-h-0 flex-1 flex-col overflow-y-auto", rail ? "items-center gap-3" : "gap-2 p-4")}>{navigation}</div>
        {showFooter && footer && (
          <div className={cn("shrink-0 font-sans text-xs text-text-muted", rail ? "text-center" : "px-4 py-4")}>{footer}</div>
        )}
      </nav>
    );
  },
);
Menu.displayName = "Menu";
