import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/**
 * Skeleton · Figma "skeleton". Holds the place of content while data loads, so the page does not jump.
 * shape: rect (blocks, charts, images; radius 8), text (a line of text, 12px high, radius 4), circle (avatar).
 * Size it with width/height classes. Pulses only when motion is allowed; hidden from screen readers:
 * put aria-busy on the container that is loading (MetricTile loading and Table busy already do).
 */
export const skeletonVariants = cva("block shrink-0 bg-surface-muted motion-safe:animate-pulse", {
  variants: {
    shape: {
      rect: "rounded-8",
      text: "h-3 rounded-4",
      circle: "rounded-pill",
    },
  },
  defaultVariants: { shape: "rect" },
});

export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof skeletonVariants> {}

export const Skeleton = React.forwardRef<HTMLSpanElement, SkeletonProps>(({ shape, className, ...props }, ref) => (
  <span ref={ref} aria-hidden className={cn(skeletonVariants({ shape }), className)} {...props} />
));
Skeleton.displayName = "Skeleton";
