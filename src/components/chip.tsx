import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "../lib/cn";

/** Chip · Figma "chip". Appearance filled/outline/ghost/ink/action, size small (32px) or medium (40px). */
export const chipVariants = cva(
  [
    "inline-flex shrink-0 items-center gap-2 rounded-pill font-sans font-medium whitespace-nowrap transition-colors outline-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
    "disabled:pointer-events-none disabled:bg-surface-disabled disabled:text-text-disabled disabled:border-transparent",
  ],
  {
    variants: {
      appearance: {
        filled: "bg-surface-control text-text-primary hover:bg-surface-control-hover active:bg-chip-pressed",
        outline: "border border-chip-outline text-text-primary hover:bg-surface-control-hover active:bg-chip-pressed",
        ghost: "text-text-primary hover:bg-surface-control-hover active:bg-chip-pressed",
        ink: "bg-surface-ink-translucent text-text-on-ink backdrop-blur-[8px] hover:bg-surface-ink-translucent-hover active:bg-surface-ink-translucent-hover",
        action: "bg-surface-ink text-text-on-ink hover:bg-surface-ink-hover active:bg-surface-ink-hover",
      },
      size: {
        small: "h-8 px-3 text-xs [&_svg]:size-4",
        medium: "h-10 px-2 text-sm [&_svg]:size-5",
      },
    },
    defaultVariants: { appearance: "filled", size: "small" },
  },
);

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipVariants> {
  icon?: React.ReactNode;
  count?: number;
  onRemove?: () => void;
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, appearance, size, icon, count, onRemove, children, type = "button", ...props }, ref) => (
    <button ref={ref} type={type} className={cn(chipVariants({ appearance, size }), className)} {...props}>
      {icon}
      {children}
      {count !== undefined && <span className="tabular-nums">{count}</span>}
      {onRemove && (
        <span
          role="button"
          tabIndex={-1}
          aria-label="Remover"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="-mr-1 inline-flex"
        >
          <X aria-hidden />
        </span>
      )}
    </button>
  ),
);
Chip.displayName = "Chip";
