import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "../lib/cn";

/** Tooltip · Figma "tooltip". Ink bubble, 224px, with arrow; placement maps the Figma arrow variants. */
export type TooltipPlacement = "top-start" | "top-center" | "top-end" | "bottom-start" | "bottom-center" | "bottom-end";

export interface TooltipProps {
  text: React.ReactNode;
  children: React.ReactNode;
  /** Where the bubble sits relative to the trigger. */
  placement?: TooltipPlacement;
  delayDuration?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export const TooltipProvider = TooltipPrimitive.Provider;

export function Tooltip({ text, children, placement = "top-center", delayDuration = 300, open, onOpenChange, className }: TooltipProps) {
  const [side, align] = placement.split("-") as ["top" | "bottom", "start" | "center" | "end"];
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root open={open} onOpenChange={onOpenChange}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={4}
            className={cn(
              "z-popover w-56 rounded-8 bg-surface-ink px-3 py-2 font-sans text-xs text-text-on-ink shadow-raised",
              className,
            )}
          >
            {text}
            <TooltipPrimitive.Arrow className="fill-surface-ink" width={12} height={6} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
