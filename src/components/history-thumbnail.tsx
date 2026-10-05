import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../lib/cn";

/**
 * HistoryThumbnail · Figma "history-thumbnail". 128x96 on mobile, 112x84 from lg.
 * Image slot: image + caption on a translucent ink band; `selected` draws a 2px green ring; `pending` shows a spinner.
 * Generate slot (`kind="generate"`): no image, an icon over a label, muted card with a 2px border that turns green on hover.
 */
export const historyThumbnailVariants = cva(
  [
    "group relative flex h-24 w-32 shrink-0 overflow-hidden rounded-8 font-sans transition-colors outline-none lg:h-[84px] lg:w-28",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
  ],
  {
    variants: {
      kind: {
        image: "bg-surface-muted",
        generate: [
          "flex-col items-center justify-center gap-2 bg-surface-muted/40 p-6 text-xs text-text-muted lg:gap-1 lg:px-4",
          "border-2 border-border-default hover:border-green-primary hover:text-green-primary [&_svg]:size-5",
        ],
      },
      selected: { true: "", false: "" },
    },
    compoundVariants: [
      { kind: "image", selected: true, className: "ring-2 ring-inset ring-green-primary" },
    ],
    defaultVariants: { kind: "image", selected: false },
  },
);

export interface HistoryThumbnailProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof historyThumbnailVariants> {
  src?: string;
  alt?: string;
  label?: React.ReactNode;
  /** Image slot only: generation in progress. */
  pending?: boolean;
  /** Generate slot only: e.g. <Square />, <Sun />, <Snowflake />. */
  icon?: React.ReactNode;
}

export const HistoryThumbnail = React.forwardRef<HTMLButtonElement, HistoryThumbnailProps>(
  ({ className, kind, selected, src, alt = "", label, pending, icon, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      aria-pressed={kind === "generate" ? undefined : !!selected}
      aria-busy={pending || undefined}
      className={cn(historyThumbnailVariants({ kind, selected }), className)}
      {...props}
    >
      {kind === "generate" ? (
        <>
          {icon}
          {label && <span>{label}</span>}
        </>
      ) : pending ? (
        <span className="flex size-full items-center justify-center text-text-muted">
          <Loader2 aria-hidden className="size-5 animate-spin" />
        </span>
      ) : (
        <>
          {src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt} className="size-full object-cover transition-opacity group-hover:opacity-90" />
          )}
          {label && (
            <span className="absolute inset-x-0 bottom-0 bg-surface-ink-translucent-hover py-1 text-center text-xs text-text-on-ink">
              {label}
            </span>
          )}
        </>
      )}
    </button>
  ),
);
HistoryThumbnail.displayName = "HistoryThumbnail";
