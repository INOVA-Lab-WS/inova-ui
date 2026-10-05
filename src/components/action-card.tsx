import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/**
 * ActionCard · Figma "action-card". One tappable row with an icon and a label.
 * context: suggestion (white card, 16px radius), refined, rail (vertical rail item), menu (menu list item).
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
        rail: "flex-col justify-center gap-1 rounded-12 px-2 py-2 text-xs font-medium text-text-inactive hover:bg-surface-control-hover [&_svg]:size-5",
        menu: "rounded-12 px-3 py-3 font-medium hover:bg-surface-control-hover [&_svg]:size-5",
      },
      selected: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      { context: "refined", selected: true, className: "bg-surface-selected" },
      { context: "rail", selected: true, className: "bg-surface-selected text-text-primary" },
      { context: "menu", selected: true, className: "bg-surface-selected" },
    ],
    defaultVariants: { context: "suggestion", selected: false },
  },
);

export interface ActionCardProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof actionCardVariants> {
  icon?: React.ReactNode;
}

export const ActionCard = React.forwardRef<HTMLButtonElement, ActionCardProps>(
  ({ className, context, selected, icon, children, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      aria-current={selected ? "page" : undefined}
      className={cn(actionCardVariants({ context, selected }), className)}
      {...props}
    >
      {icon}
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </button>
  ),
);
ActionCard.displayName = "ActionCard";
