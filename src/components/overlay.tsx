import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Drawer as VaulDrawer } from "vaul";
import { X } from "lucide-react";
import { cn } from "../lib/cn";
import { Button } from "./button";

/**
 * Overlay · Figma "overlay". presentation: dialog (centered, compact 448 / wide 480),
 * drawer (right side, 560, 16px inset) or bottom-sheet (mobile, floating 12px inset, radius 24, drag handle).
 * Scrim: bg-surface-scrim + 8px backdrop blur. Slots: title/description (header), children (body), footer.
 */
export type OverlayPresentation = "dialog" | "drawer" | "bottom-sheet";

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
}

const scrim = "fixed inset-0 z-50 bg-surface-scrim backdrop-blur-[8px]";
const surface = "flex flex-col bg-surface-page font-sans text-text-primary shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-4px_rgb(0_0_0/0.1)] outline-none";

function Header({ title, description, hideClose, Close, handle }: { title?: React.ReactNode; description?: React.ReactNode; hideClose?: boolean; Close: React.ElementType; handle?: boolean }) {
  if (!title && !description && hideClose && !handle) return null;
  return (
    <div className="flex flex-col px-4 pt-4 pb-1">
      {handle && <div aria-hidden className="mx-auto mb-4 h-1 w-10 rounded-pill bg-border-neutral" />}
      <div className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1 pt-3">
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

export function Overlay({ open, onOpenChange, presentation = "dialog", size = "compact", title, description, footer, hideClose, children, className }: OverlayProps) {
  if (presentation === "bottom-sheet") {
    return (
      <VaulDrawer.Root open={open} onOpenChange={onOpenChange}>
        <VaulDrawer.Portal>
          <VaulDrawer.Overlay className={scrim} />
          <VaulDrawer.Content className={cn(surface, "fixed inset-x-3 bottom-3 z-50 max-h-[calc(100dvh-24px)] rounded-24", className)}>
            <Header
              handle
              hideClose={hideClose}
              Close={VaulDrawer.Close}
              title={title && <VaulDrawer.Title className="text-lg font-semibold">{title}</VaulDrawer.Title>}
              description={description && <VaulDrawer.Description className="text-xs text-text-muted">{description}</VaulDrawer.Description>}
            />
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-2 pb-4">{children}</div>
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
        <DialogPrimitive.Overlay className={scrim} />
        <DialogPrimitive.Content
          className={cn(
            surface,
            "fixed z-50",
            drawer
              ? cn("top-4 right-4 bottom-4 rounded-16", size === "wide" ? "w-[560px]" : "w-[360px]", "max-w-[calc(100vw-32px)]")
              : cn("top-1/2 left-1/2 max-h-[calc(100dvh-32px)] -translate-x-1/2 -translate-y-1/2 rounded-12", size === "wide" ? "w-[480px]" : "w-[448px]", "max-w-[calc(100vw-32px)]"),
            className,
          )}
        >
          <Header
            hideClose={hideClose}
            Close={DialogPrimitive.Close}
            title={title && <DialogPrimitive.Title className="text-lg font-semibold">{title}</DialogPrimitive.Title>}
            description={description && <DialogPrimitive.Description className="text-xs text-text-muted">{description}</DialogPrimitive.Description>}
          />
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-2 pb-4">{children}</div>
          {footer && <div className="flex justify-end gap-2 p-4">{footer}</div>}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
