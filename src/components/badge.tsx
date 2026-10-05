import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/** Badge · Figma "badge". 10 variants; native-* add a 1px stroke. */
export const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-1 rounded-8 px-2 py-1 font-sans text-xs font-medium whitespace-nowrap [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-surface-action text-text-on-action",
        secondary: "bg-surface-accent text-text-accent",
        outline: "bg-surface-control text-text-primary",
        muted: "bg-surface-control text-text-muted",
        warning: "bg-status-warning-bg text-status-warning-fg",
        destructive: "bg-surface-danger text-text-on-action",
        "native-muted": "border border-border-neutral bg-surface-control text-text-muted",
        "native-outline": "border border-border-neutral bg-surface-card text-text-primary",
        "native-secondary": "border border-text-accent/20 bg-surface-accent text-text-accent",
        "native-warning": "border border-status-warning-border bg-status-warning-bg text-status-warning-fg",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ className, variant, icon, children, ...props }, ref) => (
  <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props}>
    {icon}
    {children}
  </span>
));
Badge.displayName = "Badge";
