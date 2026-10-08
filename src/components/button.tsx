import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/**
 * Button · Figma "button" (INOVA Lab Library).
 * Height 56px on mobile and 48px from the lg breakpoint (viewport=mobile/desktop in Figma).
 * Icon-only: pass `aria-label` and a single icon as children with `iconOnly`.
 * `variant="action"` + `size="compact"`: the green action pill (surface/action, 40px on mobile and 32px from lg, 16px icon),
 * as the Falar button of the input-card (Figma variant=action, size=compact).
 */
export const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-12 font-sans font-medium text-base",
    "transition-colors outline-none select-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary focus-visible:ring-3 focus-visible:ring-border-focus/50",
    "disabled:pointer-events-none disabled:bg-surface-disabled disabled:text-text-disabled",
    "[&_svg]:size-5 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-surface-ink text-text-on-ink hover:bg-surface-ink-hover active:bg-surface-ink-hover",
        outline: "bg-surface-control text-text-primary hover:bg-surface-control-hover active:bg-surface-control-hover",
        ghost: "bg-transparent text-text-primary hover:bg-surface-control active:bg-surface-control disabled:bg-transparent",
        ink: "bg-surface-ink-translucent text-text-on-ink backdrop-blur-[8px] hover:bg-surface-ink-translucent-hover active:bg-surface-ink-translucent-hover",
        destructive: "bg-surface-danger text-text-on-action",
        /** Secondary removal next to the main action: red text, no background, light red on hover. */
        "destructive-ghost": "bg-transparent text-surface-danger hover:bg-status-error-bg active:bg-status-error-bg disabled:bg-transparent",
        /** Green action pill (Figma variant=action): the voice "Falar" button. Hover and pressed add the action glow. */
        action: "rounded-pill bg-surface-action text-text-on-action hover:shadow-action-glow active:shadow-action-glow",
      },
      size: {
        responsive: "h-14 px-4 lg:h-12 lg:px-3",
        mobile: "h-14 px-4",
        desktop: "h-12 px-3",
        /** Figma size=compact: 40px on mobile, 32px from lg, padding 12, 16px icon. */
        compact: "h-10 px-3 lg:h-8 [&_svg]:size-4",
      },
      iconOnly: { true: "px-0", false: "" },
    },
    compoundVariants: [
      { iconOnly: true, size: "responsive", className: "w-14 lg:w-12" },
      { iconOnly: true, size: "mobile", className: "w-14" },
      { iconOnly: true, size: "desktop", className: "w-12" },
      { iconOnly: true, size: "compact", className: "w-10 lg:w-8" },
    ],
    defaultVariants: { variant: "primary", size: "responsive", iconOnly: false },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render the child element (e.g. a framework Link) with the button look, instead of a <button>. */
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, iconOnly, asChild, type = "button", ...props }, ref) =>
    asChild ? (
      <Slot ref={ref} className={cn(buttonVariants({ variant, size, iconOnly }), className)} {...props} />
    ) : (
      <button ref={ref} type={type} className={cn(buttonVariants({ variant, size, iconOnly }), className)} {...props} />
    ),
);
Button.displayName = "Button";
