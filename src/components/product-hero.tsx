import * as React from "react";
import { cn } from "../lib/cn";

/**
 * ProductHero · Figma "product-hero" (#83). The top of a product detail sheet: a large square image (object-cover,
 * radius 16) or the paint color (`swatch`, with a border), then category (12 semibold, uppercase, text-accent), name
 * (20 semibold) and metadata such as brand and LM code (14, muted). Takes the width of its container. Not clickable:
 * to enlarge the photo, open the ImageViewer from the app. For lists, use Thumbnail (128) or ProductListRow (56).
 */
export interface ProductHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  /** CSS color for a paint swatch; comes from data, never a design value. */
  swatch?: string;
  /** Shown in the media when there is no image and no swatch. */
  fallback?: React.ReactNode;
  category?: React.ReactNode;
  name: React.ReactNode;
  /** e.g. "Portinari · LM 89234567". */
  metadata?: React.ReactNode;
  /** Element for the name (default "h2"); use what fits the sheet's heading order. */
  nameAs?: "h2" | "h3" | "p";
}

export const ProductHero = React.forwardRef<HTMLDivElement, ProductHeroProps>(
  ({ src, alt = "", swatch, fallback, category, name, metadata, nameAs: Name = "h2", className, ...props }, ref) => (
    <div ref={ref} className={cn("flex w-full flex-col gap-3 font-sans", className)} {...props}>
      <div
        className={cn(
          "flex aspect-square w-full items-center justify-center overflow-hidden rounded-16 bg-surface-muted text-text-muted [&_svg]:size-8",
          swatch && "border border-border-default",
        )}
        style={swatch ? { backgroundColor: swatch } : undefined}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="size-full object-cover" />
        ) : (
          !swatch && fallback
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        {category && <span className="text-xs font-semibold uppercase text-text-accent">{category}</span>}
        <Name className="text-lg font-semibold break-words text-text-primary">{name}</Name>
        {metadata && <span className="text-sm text-text-muted">{metadata}</span>}
      </div>
    </div>
  ),
);
ProductHero.displayName = "ProductHero";
