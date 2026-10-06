import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";


export const badgeVariants = cva(
  "inline-flex shrink-0 items-center gap-1 rounded-8 px-2 py-1 font-sans text-xs font-medium whitespace-nowrap [&_svg]:size-3",
  {
    variants: {
      color: { green: "", red: "", yellow: "", blue: "", beige: "", disabled: "" },
      tone: { dark: "", light: "" },
    },
    compoundVariants: [
      { color: "green", tone: "dark", className: "bg-surface-action text-text-on-action" },
      { color: "green", tone: "light", className: "bg-green-secondary text-green-secondary-foreground" },
      { color: "red", tone: "dark", className: "bg-surface-danger text-text-on-action" },
      { color: "red", tone: "light", className: "bg-status-error-bg text-status-error-fg" },
      { color: "yellow", tone: "dark", className: "bg-chart-category3 text-text-primary" },
      { color: "yellow", tone: "light", className: "bg-status-warning-bg text-status-warning-fg" },
      { color: "blue", tone: "dark", className: "bg-status-info-fg text-text-on-action" },
      { color: "blue", tone: "light", className: "bg-status-info-bg text-status-info-fg" },
      { color: "beige", tone: "dark", className: "bg-warm-700 text-text-on-ink" },
      { color: "beige", tone: "light", className: "bg-surface-control text-text-primary" },
      { color: "disabled", tone: "dark", className: "bg-warm-400 text-text-on-ink" },
      { color: "disabled", tone: "light", className: "bg-surface-disabled text-text-disabled" },
    ],
    defaultVariants: { color: "green", tone: "dark" },
  },
);

type BadgeColor = "green" | "red" | "yellow" | "blue" | "beige" | "disabled";
type BadgeTone = "dark" | "light";
/** @deprecated names from before the color x tone matrix; they map to the new pairs. */
type LegacyVariant = "default" | "secondary" | "outline" | "muted" | "warning" | "destructive" | "error" | "native-muted" | "native-outline" | "native-secondary" | "native-warning";
const legacy: Record<LegacyVariant, [BadgeColor, BadgeTone]> = {
  default: ["green", "dark"],
  secondary: ["green", "light"],
  outline: ["beige", "light"],
  muted: ["beige", "light"],
  warning: ["yellow", "light"],
  destructive: ["red", "dark"],
  error: ["red", "light"],
  "native-muted": ["beige", "light"],
  "native-outline": ["beige", "light"],
  "native-secondary": ["green", "light"],
  "native-warning": ["yellow", "light"],
};

/**
 * Badge · Figma "badge". Short label for status, category or role: color (green, red, yellow, blue, beige, disabled)
 * x tone (dark = solid, light = tinted), optional icon. The old variant names still work and map to the pairs.
 */
export interface BadgeProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> {
  color?: BadgeColor;
  tone?: BadgeTone;
  /** @deprecated use color + tone. */
  variant?: LegacyVariant;
  icon?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ className, color, tone, variant, icon, children, ...props }, ref) => {
  const [c, t] = variant ? legacy[variant] : [color ?? "green", tone ?? "dark"];
  return (
    <span ref={ref} className={cn(badgeVariants({ color: c, tone: t }), className)} {...props}>
      {icon}
      {children}
    </span>
  );
});
Badge.displayName = "Badge";
