import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/**
 * ActionCard · Figma "action-card". One tappable row with an icon and a label.
 * context: suggestion (white card, 16px radius), refined, rail (vertical rail item: icon over a short label),
 * menu (mobile menu list item: icon beside the label). With asChild the app's Link becomes the item.
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
        suggestion: "rounded-16 bg-surface-card px-4 py-3 hover:bg-surface-control-hover [&_svg]:text-green-primary",
        refined: "rounded-16 bg-surface-card px-4 py-3 hover:bg-surface-control-hover",
        // rail: the background (hover, selected) lives on the 56x40 icon box only; the label sits below it, 12/600.
        rail: "group/rail w-14 flex-col justify-center gap-1 rounded-16 text-xs font-semibold text-text-inactive [&_svg]:size-5",
        menu: "rounded-12 px-3 py-3 font-medium hover:bg-surface-control-hover [&_svg]:size-5",
      },
      selected: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      { context: "refined", selected: true, className: "bg-surface-selected" },
      { context: "rail", selected: true, className: "text-text-primary" },
      { context: "menu", selected: true, className: "bg-surface-selected" },
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
            "flex h-10 w-14 items-center justify-center rounded-16 transition-colors",
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
