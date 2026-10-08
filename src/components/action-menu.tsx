import * as React from "react";
import * as Primitive from "@radix-ui/react-dropdown-menu";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cn } from "../lib/cn";

/**
 * ActionMenu · Figma "action-menu" (+ "action-menu / item").
 * A list of actions opened from an icon button. Items are 40px with the chip states
 * (default, hover, pressed, disabled, focus); the destructive action goes last, after a divider.
 * Inside an ActionMenuSheet (e.g. ProfileMenu as a bottom sheet, #70), items and separators render as plain buttons and
 * dividers with the same look, since there is no dropdown around them; `onSelect` runs on click and then the sheet closes,
 * unless the handler calls `event.preventDefault()` (as in the dropdown).
 */
/** Set by a sheet that lists ActionMenuItems outside a dropdown; `close` runs after an item is selected. */
export const ActionMenuSheetContext = React.createContext<{ close: () => void } | null>(null);

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

const itemBase = "flex h-10 cursor-default items-center gap-2 rounded-8 px-3 text-sm outline-none transition-colors select-none [&_svg]:size-4";

export const ActionMenuItem = React.forwardRef<React.ElementRef<typeof Primitive.Item>, ActionMenuItemProps>(
  ({ className, icon, tone = "default", asChild, children, ...props }, ref) => {
    const sheet = React.useContext(ActionMenuSheetContext);
    if (sheet) {
      const { onSelect, disabled, textValue: _t, ...rest } = props;
      const Comp = (asChild ? Slot : "button") as React.ElementType;
      return (
        <Comp
          ref={ref}
          {...(asChild ? {} : { type: "button", disabled })}
          aria-disabled={asChild && disabled ? true : undefined}
          data-disabled={disabled ? "" : undefined}
          className={cn(
            itemBase,
            "w-full cursor-pointer text-left hover:bg-surface-control-hover active:bg-chip-pressed",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
            "disabled:pointer-events-none disabled:text-text-disabled data-[disabled]:pointer-events-none data-[disabled]:text-text-disabled",
            tone === "danger" ? "text-status-error-fg hover:bg-status-error-bg active:bg-status-error-bg" : "text-text-primary",
            className,
          )}
          {...(rest as React.HTMLAttributes<HTMLElement>)}
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            (rest as React.HTMLAttributes<HTMLElement>).onClick?.(e);
            if (disabled || e.defaultPrevented) return;
            const event = new Event("select", { cancelable: true });
            onSelect?.(event);
            if (!event.defaultPrevented) sheet.close();
          }}
        >
          {asChild ? (
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
        </Comp>
      );
    }
    return (
    <Primitive.Item
      ref={ref}
      asChild={asChild}
      className={cn(
        itemBase,
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
    );
  },
);
ActionMenuItem.displayName = "ActionMenuItem";

export const ActionMenuSeparator = React.forwardRef<
  React.ElementRef<typeof Primitive.Separator>,
  React.ComponentPropsWithoutRef<typeof Primitive.Separator>
>(({ className, ...props }, ref) => {
  const sheet = React.useContext(ActionMenuSheetContext);
  if (sheet) return <div ref={ref} role="separator" className={cn("h-px shrink-0 bg-border-default", className)} {...props} />;
  return <Primitive.Separator ref={ref} className={cn("h-px bg-border-default", className)} {...props} />;
});
ActionMenuSeparator.displayName = "ActionMenuSeparator";
