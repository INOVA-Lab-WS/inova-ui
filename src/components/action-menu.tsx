import * as React from "react";
import * as Primitive from "@radix-ui/react-dropdown-menu";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cn } from "../lib/cn";

/**
 * ActionMenu · Figma "action-menu" (+ "action-menu / item").
 * A list of actions opened from an icon button. Items are 40px with the chip states
 * (default, hover, pressed, disabled, focus); the destructive action goes last, after a divider.
 */
export const ActionMenu = Primitive.Root;
export const ActionMenuTrigger = Primitive.Trigger;

export const ActionMenuContent = React.forwardRef<
  React.ElementRef<typeof Primitive.Content>,
  React.ComponentPropsWithoutRef<typeof Primitive.Content>
>(({ className, align = "end", sideOffset = 4, ...props }, ref) => (
  <Primitive.Portal>
    <Primitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-popover flex min-w-50 flex-col rounded-12 border border-border-default bg-surface-card p-1 font-sans shadow-raised",
        className,
      )}
      {...props}
    />
  </Primitive.Portal>
));
ActionMenuContent.displayName = "ActionMenuContent";

export interface ActionMenuItemProps extends React.ComponentPropsWithoutRef<typeof Primitive.Item> {
  icon?: React.ReactNode;
  tone?: "default" | "danger";
}

export const ActionMenuItem = React.forwardRef<React.ElementRef<typeof Primitive.Item>, ActionMenuItemProps>(
  ({ className, icon, tone = "default", asChild, children, ...props }, ref) => (
    <Primitive.Item
      ref={ref}
      asChild={asChild}
      className={cn(
        "flex h-10 cursor-default items-center gap-2 rounded-8 px-3 text-sm outline-none transition-colors select-none [&_svg]:size-4",
        "data-[highlighted]:bg-surface-control-hover active:bg-chip-pressed",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
        "data-[disabled]:pointer-events-none data-[disabled]:text-text-disabled",
        tone === "danger" ? "text-status-error-fg data-[highlighted]:bg-status-error-bg active:bg-status-error-bg" : "text-text-primary",
        className,
      )}
      {...props}
    >
      {asChild ? (
        // With asChild the app's Link becomes the item; the icon goes inside it.
        <Slot>
          {icon}
          <Slottable>{children}</Slottable>
        </Slot>
      ) : (
        <>
          {icon}
          <span className="min-w-0 flex-1 truncate">{children}</span>
        </>
      )}
    </Primitive.Item>
  ),
);
ActionMenuItem.displayName = "ActionMenuItem";

export const ActionMenuSeparator = React.forwardRef<
  React.ElementRef<typeof Primitive.Separator>,
  React.ComponentPropsWithoutRef<typeof Primitive.Separator>
>(({ className, ...props }, ref) => <Primitive.Separator ref={ref} className={cn("h-px bg-border-default", className)} {...props} />);
ActionMenuSeparator.displayName = "ActionMenuSeparator";
