import * as React from "react";
import { cn } from "../lib/cn";
import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { Divider } from "./divider";
import { Button } from "./button";

/**
 * Menu · Figma "menu". The product's main navigation, with logo, navigation and footer slots.
 * presentation:
 * - sidebar (default): the responsive side menu. Hidden below tablet (768px), where the app shows the Header's
 *   menu button and opens presentation="fullscreen". Collapsed (64px) on tablet. From desktop (1024px) it opens
 *   at 240px or collapses to 64px through the panel button, controlled (expanded/onExpandedChange) or not.
 * - expanded / collapsed: one fixed state, without the responsive rule and without the toggle.
 * - fullscreen: the mobile menu over the page, with a 64px top bar like Figma's header "menu64": logo centred,
 *   close X on the right. Esc calls onClose, and the first navigation item takes focus when it opens.
 * - rail: the old name of collapsed, kept so apps on 0.6 keep working.
 * The logo area is 56px high with its bottom line, like the desktop Header, (the panel button is 32x32) in every state, so the divider and the items do not move when it opens or closes.
 * When collapsed on desktop, the logo itself is the expand button: on hover or focus it turns into the panel icon.
 * Open, the dividers run edge to edge and the side padding (12) lives inside each section.
 * account sits at the bottom, below a divider (collapsed shows only its first child, e.g. the Avatar; the rest stays for screen readers), in every presentation (fullscreen included).
 * navigation can be a function that receives { collapsed }, so the app renders ActionCard context="rail" when
 * collapsed and context="menu" when open.
 */
export type MenuPresentation = "sidebar" | "expanded" | "collapsed" | "fullscreen" | "rail";

export interface MenuProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  presentation?: MenuPresentation;
  /** A node, or a function of { collapsed } so the closed menu can show the mark and the open one the wordmark. */
  logo?: React.ReactNode | ((state: { collapsed: boolean }) => React.ReactNode);
  navigation?: React.ReactNode | ((state: { collapsed: boolean }) => React.ReactNode);
  footer?: React.ReactNode;
  /** The person's area at the bottom (e.g. Avatar, or Avatar and name when open), below a divider. */
  account?: React.ReactNode;
  showFooter?: boolean;
  label?: string;
  /** sidebar: open (240px) on desktop. Controlled when given. */
  expanded?: boolean;
  /** sidebar: initial state when not controlled. */
  defaultExpanded?: boolean;
  /**
   * sidebar, uncontrolled: where the open/closed choice is remembered in the browser (localStorage), so it survives
   * page changes and reloads. Default "inova-menu-expanded"; null turns it off. Ignored when expanded is controlled.
   */
  storageKey?: string | null;
  onExpandedChange?: (expanded: boolean) => void;
  expandLabel?: string;
  collapseLabel?: string;
  /** Fullscreen only: keep it mounted and toggle open, so it can animate out (motion.duration.base in, motion.duration.exit out). */
  open?: boolean;
  /** Fullscreen only: called once the exit animation has finished. */
  onExitComplete?: () => void;
  /** Fullscreen only: closes the menu (X button and Esc). The app returns focus to the button that opened it. */
  onClose?: () => void;
  closeLabel?: string;
}

function useMinWidth(px: number) {
  const [matches, setMatches] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${px}px)`);
    const on = () => setMatches(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [px]);
  return matches;
}

export const Menu = React.forwardRef<HTMLElement, MenuProps>(
  (
    {
      presentation = "sidebar",
      logo,
      navigation,
      footer,
      account,
      showFooter = true,
      label = "Menu principal",
      expanded: expandedProp,
      defaultExpanded = true,
      storageKey = "inova-menu-expanded",
      onExpandedChange,
      expandLabel = "Abrir menu",
      collapseLabel = "Recolher menu",
      open = true,
      onExitComplete,
      onClose,
      closeLabel = "Fechar menu",
      className,
      ...props
    },
    ref,
  ) => {
    const fullscreen = presentation === "fullscreen";
    const sidebar = presentation === "sidebar";
    const desktop = useMinWidth(1024);
    const [expandedState, setExpandedState] = React.useState(defaultExpanded);
    const expanded = expandedProp ?? expandedState;
    const remember = expandedProp === undefined && sidebar && !!storageKey;
    // Read the remembered choice after mount (the server cannot see localStorage), so a new page keeps it.
    React.useEffect(() => {
      if (!remember) return;
      try {
        const saved = window.localStorage.getItem(storageKey!);
        if (saved === "true" || saved === "false") setExpandedState(saved === "true");
      } catch {}
    }, [remember, storageKey]);
    const setExpanded = (next: boolean) => {
      if (expandedProp === undefined) setExpandedState(next);
      if (remember) {
        try {
          window.localStorage.setItem(storageKey!, String(next));
        } catch {}
      }
      onExpandedChange?.(next);
    };
    // sidebar is collapsed on tablet (and on the server render) and follows the toggle from desktop up.
    const collapsed = fullscreen ? false : presentation === "expanded" ? false : sidebar ? !(desktop && expanded) : true;
    const showToggle = sidebar && desktop;

    const navRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      if (!fullscreen) return;
      navRef.current?.querySelector<HTMLElement>("a, button, [tabindex]:not([tabindex='-1'])")?.focus();
      if (!onClose) return;
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [fullscreen, onClose]);

    const nav = typeof navigation === "function" ? navigation({ collapsed }) : navigation;
    const logoNode = typeof logo === "function" ? logo({ collapsed }) : logo;
    // Fullscreen stays rendered while it animates out after open turns false.
    const [rendered, setRendered] = React.useState(open);
    React.useEffect(() => {
      if (open) setRendered(true);
    }, [open]);
    const toggle = showToggle && (
      <Button
        variant="ghost"
        size="desktop"
        iconOnly
        className="size-8 min-h-0 p-2 [&_svg]:size-4"
        aria-label={collapsed ? expandLabel : collapseLabel}
        aria-expanded={!collapsed}
        onClick={() => setExpanded(collapsed)}
      >
        {collapsed ? <PanelLeftOpen aria-hidden /> : <PanelLeftClose aria-hidden />}
      </Button>
    );

    if (fullscreen) {
      if (!rendered) return null;
      return (
        <nav
          ref={ref}
          aria-label={label}
          data-state={open ? "open" : "closed"}
          onAnimationEnd={() => {
            if (!open) {
              setRendered(false);
              onExitComplete?.();
            }
          }}
          className={cn(
            "fixed inset-0 z-overlay flex w-full flex-col bg-linear-to-t from-surface-canvas-bottom to-surface-canvas-top motion-reduce:animate-none",
            open ? "animate-[inova-menu-in_var(--inova-motion-duration-base)_var(--inova-motion-easing-enter)]" : "animate-[inova-menu-out_var(--inova-motion-duration-exit)_var(--inova-motion-easing-exit)_forwards]",
            className,
          )}
          {...props}
        >
          <div className="grid h-16 shrink-0 grid-cols-[48px_1fr_48px] items-center px-2 pt-[var(--inova-safe-area-top)] box-content">
            <span />
            <div className="flex items-center justify-center">{logoNode}</div>
            {onClose && (
              <Button variant="ghost" size="desktop" iconOnly aria-label={closeLabel} onClick={onClose}>
                <X aria-hidden />
              </Button>
            )}
          </div>
          <Divider className="w-full shrink-0" />
          <div ref={navRef} className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-4">{nav}</div>
          {account && (
            <div className="flex shrink-0 flex-col gap-3 px-4 pb-6">
              <Divider className="w-full" />
              <div className="flex min-w-0 items-center gap-2">{account}</div>
            </div>
          )}
          {showFooter && footer && <div className="shrink-0 px-4 py-4 text-center font-sans text-xs font-semibold text-text-muted">{footer}</div>}
        </nav>
      );
    }

    return (
      <nav
        ref={ref}
        aria-label={label}
        className={cn(
          "flex h-full shrink-0 flex-col border-r border-border-default bg-linear-to-t from-surface-canvas-bottom to-surface-canvas-top pb-4 transition-[width] duration-[var(--inova-motion-duration-exit)] ease-standard motion-reduce:transition-none",
          collapsed ? "w-16 items-center" : "w-60",
          sidebar && "hidden tablet:flex",
          className,
        )}
        {...props}
      >
        {(logoNode || toggle) && (
          // 56px with its bottom line, the same height as the desktop Header, so both lines meet.
          <div
            className={cn(
              "flex h-14 w-full shrink-0 items-center border-b border-border-default",
              collapsed ? "justify-center" : "justify-between gap-2 pl-4 pr-3",
            )}
          >
            {collapsed ? (
              showToggle ? (
                <button
                  type="button"
                  aria-label={expandLabel}
                  aria-expanded={false}
                  onClick={() => setExpanded(true)}
                  className="group/logo relative flex size-8 shrink-0 items-center justify-center rounded-16 outline-none transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
                >
                  <span className="flex h-5 items-center justify-center group-hover/logo:invisible group-focus-visible/logo:invisible">{logoNode}</span>
                  <PanelLeftOpen aria-hidden className="absolute hidden size-4 group-hover/logo:block group-focus-visible/logo:block" />
                </button>
              ) : (
                logoNode
              )
            ) : (
              <>
                <div className="flex min-w-0 items-center">{logoNode}</div>
                {toggle}
              </>
            )}
          </div>
        )}
        <div ref={navRef} className={cn("flex min-h-0 flex-1 flex-col overflow-y-auto", collapsed ? "items-center gap-3 px-1 pt-4" : "gap-1 px-3 pt-4")}>
          {nav}
        </div>
        {account && (
          <div className={cn("flex w-full shrink-0 flex-col gap-3 pt-4", collapsed ? "items-center" : "")}>
            <Divider className={collapsed ? "w-8" : "w-full"} />
            <div className={cn("flex min-w-0 items-center gap-2", collapsed ? "justify-center [&>:not(:first-child)]:sr-only" : "px-3")}>{account}</div>
          </div>
        )}
        {showFooter && footer && (
          <div className={cn("mt-3 shrink-0 font-sans text-xs font-semibold text-text-muted", collapsed ? "text-center" : "px-4")}>{footer}</div>
        )}
      </nav>
    );
  },
);
Menu.displayName = "Menu";

/**
 * PageGrid · Foundations "grid e breakpoints". The content grid: 4 columns on mobile, 8 on tablet, 12 from desktop,
 * with the gutter and margin of each range, and content limited to 1280px on wide screens. It starts where the
 * menu ends: put it beside the Menu, never under it.
 */
export const PageGrid = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mx-auto grid w-full max-w-[calc(var(--inova-content-max-width)+2*var(--inova-grid-margin))] grid-cols-[repeat(var(--inova-grid-columns),minmax(0,1fr))] gap-x-[var(--inova-grid-gutter)] px-[var(--inova-grid-margin)]",
      className,
    )}
    {...props}
  />
));
PageGrid.displayName = "PageGrid";
