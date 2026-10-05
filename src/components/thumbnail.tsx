import * as React from "react";
import { cn } from "../lib/cn";

/**
 * Thumbnail · Figma "thumbnail". Product card 128x160: media (image or color swatch) + caption + metadata.
 * `unavailable` dims it; with no src and no swatch the media shows `fallback`.
 */
export interface ThumbnailProps extends React.HTMLAttributes<HTMLElement> {
  src?: string;
  alt?: string;
  /** CSS color for a swatch; comes from data, never a design value. */
  swatch?: string;
  caption?: React.ReactNode;
  metadata?: React.ReactNode;
  fallback?: React.ReactNode;
  unavailable?: boolean;
  href?: string;
}

export function Thumbnail({ src, alt = "", swatch, caption, metadata, fallback, unavailable, href, className, ...props }: ThumbnailProps) {
  const Comp = (href ? "a" : "div") as React.ElementType;
  return (
    <Comp
      href={href}
      aria-disabled={unavailable || undefined}
      className={cn(
        "flex w-32 shrink-0 flex-col rounded-16 border border-border-default bg-surface-card p-1 font-sans",
        href && "outline-none transition-colors hover:bg-surface-control-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
        unavailable && "opacity-60",
        className,
      )}
      {...props}
    >
      <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-12 bg-surface-muted text-text-muted [&_svg]:size-5" style={swatch ? { backgroundColor: swatch } : undefined}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="size-full object-cover" />
        ) : (
          !swatch && fallback
        )}
      </div>
      {(caption || metadata) && (
        <div className="flex flex-col p-2">
          {caption && <span className="line-clamp-3 text-xs text-text-primary">{caption}</span>}
          {metadata && <span className="truncate text-xs text-text-muted">{metadata}</span>}
        </div>
      )}
    </Comp>
  );
}
