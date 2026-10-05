import * as React from "react";
import { LayoutGrid } from "lucide-react";
import { cn } from "../lib/cn";
import { Avatar } from "./avatar";
import { LogoAmbientAI } from "./logos";

/** Header · Figma "header". 56px bar: apps-menu action, product wordmark, optional right slot. */
export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  viewport?: "mobile" | "tablet" | "desktop";
  /** Product logo; defaults to the AmbientAI wordmark. */
  logo?: React.ReactNode;
  leadingAction?: React.ReactNode;
  onMenuClick?: () => void;
  menuLabel?: string;
  /** Right slot; defaults to the user avatar. Pass null to hide. */
  rightSlot?: React.ReactNode;
  userName?: string;
}

export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  (
    { viewport = "mobile", logo, leadingAction, onMenuClick, menuLabel = "Abrir menu de aplicativos", rightSlot, userName, className, ...props },
    ref,
  ) => {
    const right = rightSlot === undefined ? <Avatar size={viewport === "mobile" ? "medium" : "small"} name={userName} /> : rightSlot;
    return (
      <header
        ref={ref}
        className={cn("flex h-14 w-full items-center gap-3 border-b border-border-default px-4", className)}
        {...props}
      >
        {leadingAction ?? (
          <button
            type="button"
            aria-label={menuLabel}
            onClick={onMenuClick}
            className="inline-flex size-8 items-center justify-center rounded-8 text-text-primary outline-none hover:bg-surface-control-hover focus-visible:outline-2 focus-visible:outline-text-primary [&_svg]:size-5"
          >
            <LayoutGrid aria-hidden />
          </button>
        )}
        <div className="flex min-w-0 flex-1 items-center">{logo ?? <LogoAmbientAI type="wordmark" title="AmbientAI" className="h-4 w-auto" />}</div>
        {right}
      </header>
    );
  },
);
Header.displayName = "Header";
