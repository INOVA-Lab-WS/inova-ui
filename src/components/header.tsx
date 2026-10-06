import * as React from "react";
import { cn } from "../lib/cn";
import { Avatar } from "./avatar";
import { LogoPlaceholder } from "./logos";

/** The library's "chocolate-menu" icon (3x3 dots), used by the header to open the apps menu. */
export function ChocolateMenuIcon(props: React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden {...props}>
      {[2.5, 10, 17.5].flatMap((y) => [2.5, 10, 17.5].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r={2.5} />))}
    </svg>
  );
}

/**
 * Header · Figma "header". 56px bar: apps-menu button on the left, product logo centred, optional right slot.
 * The logo is a slot (Figma property "logo"): each product passes its own brand, scaled by height to 12px
 * so it never distorts; the default is the agnostic LogoPlaceholder.
 * sticky: fixed to the top with the page surface at 95% and a blur, so content scrolls under it.
 * The iPhone top safe area (--inova-safe-area-top) is added above the 56px bar, like the fullscreen Menu.
 */
export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  viewport?: "mobile" | "tablet" | "desktop";
  /** Product logo, centred and 12px high (an svg is scaled by height). Defaults to LogoPlaceholder. */
  logo?: React.ReactNode;
  leadingAction?: React.ReactNode;
  onMenuClick?: () => void;
  menuLabel?: string;
  /** Whether the menu the button opens is open; becomes aria-expanded. */
  menuExpanded?: boolean;
  /** Ref to the menu button, so the app can return focus to it when the menu closes. */
  menuButtonRef?: React.Ref<HTMLButtonElement>;
  /** Right slot; defaults to the user avatar. Pass null to hide. */
  rightSlot?: React.ReactNode;
  userName?: string;
  sticky?: boolean;
}

export const Header = React.forwardRef<HTMLElement, HeaderProps>(
  (
    {
      viewport = "mobile",
      logo,
      leadingAction,
      onMenuClick,
      menuLabel = "Abrir menu de aplicativos",
      menuExpanded,
      menuButtonRef,
      rightSlot,
      userName,
      sticky,
      className,
      ...props
    },
    ref,
  ) => {
    const right = rightSlot === undefined ? <Avatar size={viewport === "mobile" ? "medium" : "small"} name={userName} /> : rightSlot;
    return (
      <header
        ref={ref}
        className={cn(
          "relative flex h-[calc(3.5rem+var(--inova-safe-area-top))] w-full items-center gap-3 border-b border-border-default px-4 pt-[var(--inova-safe-area-top)]",
          sticky && "sticky top-0 z-30 bg-surface-page/95 backdrop-blur-[8px]",
          className,
        )}
        {...props}
      >
        {leadingAction ?? (
          <button
            ref={menuButtonRef}
            type="button"
            aria-label={menuLabel}
            aria-expanded={menuExpanded}
            onClick={onMenuClick}
            className={cn("inline-flex size-8 items-center justify-center rounded-8 text-text-primary outline-none hover:bg-surface-control-hover focus-visible:outline-2 focus-visible:outline-text-primary [&_svg]:size-5", viewport === "desktop" && "hidden")}
          >
            <ChocolateMenuIcon />
          </button>
        )}
        <div className="pointer-events-none absolute bottom-0 left-1/2 flex h-14 -translate-x-1/2 items-center [&>*]:pointer-events-auto [&>svg]:h-3 [&>svg]:w-auto">
          {logo ?? <LogoPlaceholder />}
        </div>
        <div className="ml-auto flex items-center">{right}</div>
      </header>
    );
  },
);
Header.displayName = "Header";
