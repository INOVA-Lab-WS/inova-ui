import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { useMinWidth } from "../lib/hooks";
import { BREAKPOINTS } from "../lib/breakpoints";
import { Overlay } from "./overlay";

export type SelectionPresentation = "popover" | "sheet" | "responsive";

/** Shared transport only: panels remain portal-free so FilterBar can host them in its own sheet. */
export function SelectionSurface({ presentation = "popover", open, onOpenChange, title, trigger, children, className }: {
  presentation?: SelectionPresentation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  trigger: React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>;
  children: React.ReactNode;
  className?: string;
}) {
  const tablet = useMinWidth(BREAKPOINTS.tablet);
  const sheet = presentation === "sheet" || (presentation === "responsive" && !tablet);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  if (sheet) return <>
    {React.cloneElement(trigger, { ref: triggerRef, onClick: () => onOpenChange(true), "aria-haspopup": "dialog", "aria-expanded": open } as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    <Overlay open={open} onOpenChange={onOpenChange} presentation="bottom-sheet" title={title}
      onExitComplete={() => triggerRef.current?.focus({ preventScroll: true })}>
      {open && children}
    </Overlay>
  </>;
  return <Popover.Root open={open} onOpenChange={onOpenChange}>
    <Popover.Trigger asChild>{trigger}</Popover.Trigger>
    <Popover.Portal>
      <Popover.Content align="start" sideOffset={4} collisionPadding={8} className={className}>
        {children}
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>;
}
