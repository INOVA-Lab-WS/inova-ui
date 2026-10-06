import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Drawer as VaulDrawer } from "vaul";
import { X } from "lucide-react";
import { cn } from "../lib/cn";
import { Button } from "./button";

/**
 * Overlay · Figma "overlay". presentation: dialog (centered, compact 448 / wide 480),
 * drawer (right side, 560, 16px inset) or bottom-sheet (mobile, floating 12px inset, radius 24, drag handle).
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
  children?: React.ReactNode;
  className?: string;
  /** dialog only: "alertdialog" for short destructive confirmations (announced as an alert). */
  role?: "dialog" | "alertdialog";
  /** dialog and drawer: where focus starts when it opens (e.g. the Cancel button). */
  initialFocus?: React.RefObject<HTMLElement | null>;
  onOpenAutoFocus?: (event: Event) => void;
  /** Called once the exit animation has finished (e.g. to change the URL after the panel is gone). */
  onExitComplete?: () => void;
}

function useIsDesktop() {
  const [desktop, setDesktop] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return desktop;
}

const anim = "duration-[var(--inova-motion-duration-base)] motion-reduce:animate-none";
const scrimAnim = "data-[state=open]:animate-[inova-fade-in_var(--inova-motion-duration-base)_var(--inova-motion-easing-enter)] data-[state=closed]:animate-[inova-fade-out_var(--inova-motion-duration-exit)_var(--inova-motion-easing-exit)] motion-reduce:animate-none";

const scrim = "fixed inset-0 z-50 bg-surface-scrim backdrop-blur-[8px]";
const surface = "flex flex-col rounded-24 border border-border-default bg-surface-page font-sans text-text-primary shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-4px_rgb(0_0_0/0.1)] outline-none";

function Header({ title, description, hideClose, Close, handle }: { title?: React.ReactNode; description?: React.ReactNode; hideClose?: boolean; Close: React.ElementType; handle?: boolean }) {
  if (!title && !description && hideClose && !handle) return null;
  // Figma: header padding 16 on the bottom sheet, 24 on dialog and drawer; 4 below.
  return (
    <div className={cn("flex flex-col pb-1", handle ? "px-4 pt-4" : "px-6 pt-6")}>
      {handle && <div aria-hidden className="mx-auto mb-4 h-1 w-10 rounded-pill bg-border-neutral" />}
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

export function Overlay({ open, onOpenChange, presentation: requested = "dialog", size = "compact", title, description, footer, hideClose, children, className, onExitComplete, role, initialFocus, onOpenAutoFocus }: OverlayProps) {
  const desktop = useIsDesktop();
  const presentation = requested === "responsive" ? (desktop ? "drawer" : "bottom-sheet") : requested;
  if (presentation === "bottom-sheet") {
    return (
      <VaulDrawer.Root open={open} onOpenChange={onOpenChange} repositionInputs={false} onAnimationEnd={(o) => !o && onExitComplete?.()}>
        <VaulDrawer.Portal>
          <VaulDrawer.Overlay className={scrim} />
          <VaulDrawer.Content className={cn(surface, "fixed inset-x-3 bottom-3 z-50 max-h-[calc(100dvh-24px)]", className)}>
            <Header
              handle
              hideClose={hideClose}
              Close={VaulDrawer.Close}
              title={title && <VaulDrawer.Title className="text-lg font-semibold">{title}</VaulDrawer.Title>}
              description={description && <VaulDrawer.Description className="text-xs text-text-muted">{description}</VaulDrawer.Description>}
            />
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 pt-2 pb-4">{children}</div>
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
            "fixed z-50",
            drawer
              ? cn("top-4 right-4 bottom-4", size === "wide" ? "w-[560px]" : "w-[358px]", "max-w-[calc(100vw-32px)]")
              : cn("top-1/2 left-1/2 max-h-[calc(100dvh-32px)] -translate-x-1/2 -translate-y-1/2", size === "wide" ? "w-[480px]" : "w-[448px]", "max-w-[calc(100vw-32px)]"),
            className,
          )}
        >
          <Header
            hideClose={hideClose}
            Close={DialogPrimitive.Close}
            title={title && <DialogPrimitive.Title className="text-lg font-semibold">{title}</DialogPrimitive.Title>}
            description={description && <DialogPrimitive.Description className="text-xs text-text-muted">{description}</DialogPrimitive.Description>}
          />
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-6 pt-2 pb-6">{children}</div>
          {footer && <div className="flex justify-end gap-2 px-6 pt-4 pb-6">{footer}</div>}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
