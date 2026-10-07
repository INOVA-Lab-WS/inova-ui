import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/**
 * ActionCard · Figma "action-card". One tappable row with an icon and a label.
 * context: suggestion (white card, 16px radius), rail (vertical rail item: icon over a short label),
 * menu (menu list item: icon beside the label, in the open menu and the fullscreen menu). With asChild the app's Link becomes the item.
 */
export const actionCardVariants = cva(
  [
    "inline-flex w-full items-center gap-3 text-left font-sans text-sm text-text-primary transition-colors outline-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
    "disabled:pointer-events-none disabled:text-text-disabled [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      context: {
        suggestion: "h-10 rounded-16 bg-surface-card px-4 hover:bg-surface-accent lg:h-9 lg:text-xs [&_svg]:text-green-primary",
        // rail: the background (hover, selected) lives on the 40x40 icon box only; the label sits below it, 12/600.
        rail: "group/rail w-14 flex-col justify-center gap-1 rounded-16 text-xs font-semibold text-text-inactive [&_svg]:size-5",
        // menu: 56px high on mobile (fullscreen menu) and 48px from desktop (open side menu), 12px sides, as in Figma.
        menu: "h-14 gap-2 rounded-16 px-3 text-base font-semibold text-text-inactive hover:bg-surface-muted desktop:h-12 [&_svg]:size-5",
      },
      selected: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      { context: "rail", selected: true, className: "text-text-primary" },
      { context: "menu", selected: true, className: "bg-surface-selected text-text-primary" },
    ],
    defaultVariants: { context: "suggestion", selected: false },
  },
);

export interface ActionCardProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof actionCardVariants> {
  icon?: React.ReactNode;
  /** Render the child element (e.g. a framework Link) as the item; the icon goes inside it. */
  asChild?: boolean;
}

export const ActionCard = React.forwardRef<HTMLButtonElement, ActionCardProps>(
  ({ className, context, selected, icon, asChild, children, type = "button", ...props }, ref) => {
    const cls = cn(actionCardVariants({ context, selected }), className);
    const iconNode =
      context === "rail" ? (
        <span
          className={cn(
            "flex size-10 items-center justify-center rounded-16 transition-colors",
            selected ? "bg-surface-selected" : "group-hover/rail:bg-surface-muted",
          )}
        >
          {icon}
        </span>
      ) : (
        icon
      );
    if (asChild) {
      return (
        <Slot ref={ref} aria-current={selected ? "page" : undefined} className={cls} {...props}>
          {iconNode}
          <Slottable>{children}</Slottable>
        </Slot>
      );
    }
    return (
      <button ref={ref} type={type} aria-current={selected ? "page" : undefined} className={cls} {...props}>
        {iconNode}
        <span className={cn("min-w-0 truncate", context === "rail" ? "max-w-full text-center leading-4" : "flex-1")}>{children}</span>
      </button>
    );
  },
);
ActionCard.displayName = "ActionCard";
