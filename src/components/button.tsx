import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/**
 * Button · Figma "button" (INOVA Lab Library).
 * Height 56px on mobile and 48px from the lg breakpoint (viewport=mobile/desktop in Figma).
 * Icon-only: pass `aria-label` and a single icon as children with `iconOnly`.
 */
export const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-12 font-sans font-medium text-base",
    "transition-colors outline-none select-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
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
        destructive: "bg-surface-danger text-text-on-action hover:opacity-90 active:opacity-90",
      },
      size: {
        responsive: "h-14 px-4 lg:h-12 lg:px-3",
        mobile: "h-14 px-4",
        desktop: "h-12 px-3",
      },
      iconOnly: { true: "px-0", false: "" },
    },
    compoundVariants: [
      { iconOnly: true, size: "responsive", className: "w-14 lg:w-12" },
      { iconOnly: true, size: "mobile", className: "w-14" },
      { iconOnly: true, size: "desktop", className: "w-12" },
    ],
    defaultVariants: { variant: "primary", size: "responsive", iconOnly: false },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, iconOnly, type = "button", ...props }, ref) => (
    <button ref={ref} type={type} className={cn(buttonVariants({ variant, size, iconOnly }), className)} {...props} />
  ),
);
Button.displayName = "Button";
