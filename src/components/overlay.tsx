import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Drawer as VaulDrawer } from "vaul";
import { X } from "lucide-react";
import { cn } from "../lib/cn";
import { useMinWidth } from "../lib/hooks";
import { BREAKPOINTS } from "../lib/breakpoints";
import { Button } from "./button";

/**
 * Overlay · Figma "overlay". presentation: dialog (centered, compact 448 / wide 480),
 * drawer (right side, 560, 16px inset) or bottom-sheet (mobile, floating 12px inset, radius 24, drag handle).
 * The bottom sheet sits above the on-screen keyboard when KeyboardInsetProvider is mounted (#49), below the top safe area
 * plus --inova-sheet-top-gap and above the bottom safe area (#65). With the keyboard open it shrinks to the visible area
 * and only its body scrolls to the focused field; the page and the sheet are not pushed up (#71).
 * responsive: bottom-sheet below lg (1024px) and drawer from lg, as the skill asks. Every presentation animates in and out
 * in motion.duration.base and out in motion.duration.exit, with the enter and exit easings (panel in its direction, scrim fades), respecting reduced motion; onExitComplete fires after the exit.
 * Scrim: bg-surface-scrim + 8px backdrop blur. Slots: title/description (header), children (body), footer.
 */
export type OverlayPresentation = "dialog" | "drawer" | "bottom-sheet" | "responsive";

export interface OverlayProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  presentation?: OverlayPresentation;
  size?: "compact" | "wide";
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  hideClose?: boolean;
  /** Keep the title for screen readers only (it still names the panel), e.g. a bottom sheet with its own header. */
  hideTitle?: boolean;
  children?: React.ReactNode;
  className?: string;
  /** dialog only: "alertdialog" for short destructive confirmations (announced as an alert). */
  role?: "dialog" | "alertdialog";
  /**
   * Where focus starts when it opens (e.g. the Cancel button, or the first field). All presentations. The bottom sheet
   * (#78) always moves focus inside on open: to this element when given (a field raises the phone keyboard), otherwise
   * to the sheet itself, with no field focused. Before 0.10.2 focus stayed on the trigger behind the sheet.
   */
  initialFocus?: React.RefObject<HTMLElement | null>;
  onOpenAutoFocus?: (event: Event) => void;
  /** Called once the exit animation has finished (e.g. to change the URL after the panel is gone). */
  onExitComplete?: () => void;
}

const anim = "duration-[var(--inova-motion-duration-base)] motion-reduce:animate-none";
const scrimAnim = "data-[state=open]:animate-[inova-fade-in_var(--inova-motion-duration-base)_var(--inova-motion-easing-enter)] data-[state=closed]:animate-[inova-fade-out_var(--inova-motion-duration-exit)_var(--inova-motion-easing-exit)] motion-reduce:animate-none";

const scrim = "fixed inset-0 z-overlay bg-surface-scrim backdrop-blur-[8px]";
const surface = "flex flex-col rounded-24 border border-border-default bg-surface-page font-sans text-text-primary shadow-overlay outline-none";

function Header({ title, description, hideClose, Close, handle, hiddenTitle }: { title?: React.ReactNode; description?: React.ReactNode; hideClose?: boolean; Close: React.ElementType; handle?: boolean; hiddenTitle?: React.ReactNode }) {
  if (!title && !description && hideClose && !handle) return hiddenTitle ? <>{hiddenTitle}</> : null;
  if (!title && !description && hideClose && handle) {
    return (
      <div className="flex flex-col px-4 pt-4">
        <div aria-hidden className="mx-auto mb-3 h-1 w-10 rounded-pill bg-border-neutral" />
        {hiddenTitle}
      </div>
    );
  }
  // Figma: header padding 16 on the bottom sheet, 24 on dialog and drawer; 4 below.
  return (
    <div className={cn("flex flex-col pb-1", handle ? "px-4 pt-4" : "px-6 pt-6")}>
      {handle && <div aria-hidden className="mx-auto mb-4 h-1 w-10 rounded-pill bg-border-neutral" />}
      {hiddenTitle}
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1 pt-2.5">
          {title}
          {description}
        </div>
        {!hideClose && (
          <Close asChild>
            <Button variant="ghost" iconOnly aria-label="Fechar">
              <X aria-hidden />
            </Button>
          </Close>
        )}
      </div>
    </div>
  );
}

/**
 * Keyboard in the bottom sheet (#71). When a field inside the sheet takes focus, iOS Safari pans the visual viewport and
 * `scrollIntoView` scrolls every ancestor, the window included, so the whole fixed sheet went up with the keyboard.
 * Instead: undo any pan of the page (back to where it was), wait for the keyboard to settle (visualViewport resize, or 350ms), then scroll only
 * the sheet's body (data-inova-sheet-body) so the field sits inside it. The sheet itself shrinks through
 * --inova-visual-viewport-height and stays 12px above the keyboard through --inova-kb-inset (KeyboardInsetProvider).
 */
function keepFieldInSheet(el: HTMLElement) {
  if (typeof window === "undefined" || !el.matches("input, textarea, select, [contenteditable]")) return;
  const body = el.closest<HTMLElement>("[data-inova-sheet-body]");
  const vv = window.visualViewport;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Where the page was before the focus: the pan is undone back to it, never to the top of a scrolled page.
  const x = window.scrollX;
  const y = window.scrollY;
  const unpan = () => {
    if (window.scrollY !== y || (vv && vv.offsetTop > 0)) window.scrollTo(x, y);
  };
  const reveal = () => {
    unpan();
    if (!body || document.activeElement !== el) return;
    const b = body.getBoundingClientRect();
    const f = el.getBoundingClientRect();
    const margin = 16;
    let delta = 0;
    if (f.bottom > b.bottom - margin) delta = f.bottom - (b.bottom - margin);
    else if (f.top < b.top + margin) delta = f.top - (b.top + margin);
    if (delta) body.scrollTo({ top: body.scrollTop + delta, behavior: reduced ? "auto" : "smooth" });
  };
  unpan();
  let done = false;
  const run = () => {
    if (done) return;
    done = true;
    vv?.removeEventListener("resize", run);
    window.requestAnimationFrame(reveal);
  };
  vv?.addEventListener("resize", run);
  vv?.addEventListener("scroll", unpan);
  window.setTimeout(run, 350);
  el.addEventListener("blur", () => vv?.removeEventListener("scroll", unpan), { once: true });
}

export function Overlay({ open, onOpenChange, presentation: requested = "dialog", size = "compact", title, description, footer, hideClose, hideTitle, children, className, onExitComplete, role, initialFocus, onOpenAutoFocus }: OverlayProps) {
  const desktop = useMinWidth(BREAKPOINTS.desktop);
  const presentation = requested === "responsive" ? (desktop ? "drawer" : "bottom-sheet") : requested;
  const sheetRef = React.useRef<HTMLDivElement>(null);
  if (presentation === "bottom-sheet") {
    return (
      <VaulDrawer.Root open={open} onOpenChange={onOpenChange} repositionInputs={false} autoFocus onAnimationEnd={(o) => !o && onExitComplete?.()}>
        <VaulDrawer.Portal>
          <VaulDrawer.Overlay className={scrim} />
          <VaulDrawer.Content
            className={cn(
              surface,
              // Bottom: 12px above the larger of the on-screen keyboard (KeyboardInsetProvider measures it) and the
              // bottom safe area (home bar). Top (#65): never above the top safe area plus --inova-sheet-top-gap (72, the
              // app header + 16). Without the provider, the keyboard inset is 0 and the height is 100dvh.
              // vaul paints a block of the sheet's color below a bottom drawer ([data-vaul-drawer]::after), made for
              // drawers glued to the edge. This sheet floats 12px above it, so the block showed as a beige band (#69).
              "after:hidden",
              "fixed inset-x-3 bottom-[calc(max(var(--inova-kb-inset,0px),var(--inova-safe-area-bottom,0px))+12px)] z-overlay",
              "max-h-[calc(var(--inova-visual-viewport-height,100dvh)-var(--inova-safe-area-top)-var(--inova-sheet-top-gap,72px)-12px-max(0px,var(--inova-safe-area-bottom,0px)-var(--inova-kb-inset,0px)))]",
              className,
            )}
            ref={sheetRef}
            onOpenAutoFocus={(e) => {
              // Focus always moves inside the sheet (#78): to initialFocus when given, otherwise to the sheet itself, so
              // no field is focused and the keyboard stays down until the person taps a field.
              onOpenAutoFocus?.(e);
              if (e.defaultPrevented) return;
              e.preventDefault();
              (initialFocus?.current ?? sheetRef.current)?.focus({ preventScroll: true });
            }}
            onFocus={(e) => keepFieldInSheet(e.target as HTMLElement)}
          >
            <Header
              handle
              hideClose={hideClose}
              Close={VaulDrawer.Close}
              title={title && !hideTitle && <VaulDrawer.Title className="text-lg font-semibold">{title}</VaulDrawer.Title>}
              hiddenTitle={title && hideTitle && <VaulDrawer.Title className="sr-only">{title}</VaulDrawer.Title>}
              description={description && <VaulDrawer.Description className="text-xs text-text-muted">{description}</VaulDrawer.Description>}
            />
            <div data-inova-sheet-body="" className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain px-4 pt-2 pb-4">{children}</div>
            {footer && <div className="flex flex-col gap-2 p-4">{footer}</div>}
          </VaulDrawer.Content>
        </VaulDrawer.Portal>
      </VaulDrawer.Root>
    );
  }
  const drawer = presentation === "drawer";
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={cn(scrim, scrimAnim)} />
        <DialogPrimitive.Content
          role={!drawer && role ? role : undefined}
          onOpenAutoFocus={(e) => {
            onOpenAutoFocus?.(e);
            if (!e.defaultPrevented && initialFocus?.current) {
              e.preventDefault();
              initialFocus.current.focus();
            }
          }}
          onAnimationEnd={(e) => {
            if (e.currentTarget.dataset.state === "closed") onExitComplete?.();
          }}
          className={cn(
            anim,
            drawer
              ? "data-[state=open]:animate-[inova-drawer-in_var(--inova-motion-duration-base)_var(--inova-motion-easing-enter)] data-[state=closed]:animate-[inova-drawer-out_var(--inova-motion-duration-exit)_var(--inova-motion-easing-exit)]"
              : "data-[state=open]:animate-[inova-dialog-in_var(--inova-motion-duration-base)_var(--inova-motion-easing-enter)] data-[state=closed]:animate-[inova-dialog-out_var(--inova-motion-duration-exit)_var(--inova-motion-easing-exit)]",
            surface,
            "fixed z-overlay",
            drawer
              ? cn("top-4 right-4 bottom-4", size === "wide" ? "w-[560px]" : "w-[358px]", "max-w-[calc(100vw-32px)]")
              : cn("top-1/2 left-1/2 max-h-[calc(100dvh-32px)] -translate-x-1/2 -translate-y-1/2", size === "wide" ? "w-[480px]" : "w-[448px]", "max-w-[calc(100vw-32px)]"),
            className,
          )}
        >
          <Header
            hideClose={hideClose}
            Close={DialogPrimitive.Close}
            title={title && !hideTitle && <DialogPrimitive.Title className="text-lg font-semibold">{title}</DialogPrimitive.Title>}
            hiddenTitle={title && hideTitle && <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>}
            description={description && <DialogPrimitive.Description className="text-xs text-text-muted">{description}</DialogPrimitive.Description>}
          />
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-6 pt-2 pb-6">{children}</div>
          {footer && <div className="flex justify-end gap-2 px-6 pt-4 pb-6">{footer}</div>}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
