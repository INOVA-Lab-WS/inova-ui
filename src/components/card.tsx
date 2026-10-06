import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../lib/cn";

/**
 * Card · Figma "card". An empty white box with a 1px border, 12px radius and 16px padding that groups any content.
 * When it is clickable (interactive, or asChild with a Link), hover strengthens the border and adds the near-invisible
 * shadow, and focus shows the ring outside.
 */
export const cardClassName = (interactive?: boolean, className?: string) =>
  cn(
    "block rounded-12 border border-border-default bg-surface-card p-4 font-sans text-text-primary",
    interactive &&
      "cursor-pointer no-underline transition-[border-color,box-shadow] hover:border-border-neutral hover:shadow-[0_1px_2px_rgb(0_0_0/0.05)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
    className,
  );

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  /** Render the child (e.g. a Link or a button) as the card; implies interactive. */
  asChild?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ interactive, asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return <Comp ref={ref} className={cardClassName(interactive || asChild, className)} {...props} />;
});
Card.displayName = "Card";
