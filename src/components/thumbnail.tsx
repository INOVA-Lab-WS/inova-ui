import * as React from "react";
import { cn } from "../lib/cn";

/**
 * Thumbnail · Figma "thumbnail". Product card 128x160: media (image or color swatch) + caption + metadata.
 * `unavailable` dims it; with no src and no swatch the media shows `fallback`.
 * Clickable (#62): with `href` it is a link; with `onClick` it is a native `<button type="button">` (pointer cursor, green
 * border on hover, focus ring, keyboard), disabled while `unavailable`. Without either it is a plain, read-only card.
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
  const isButton = !href && !!props.onClick;
  const Comp = (href ? "a" : isButton ? "button" : "div") as React.ElementType;
  const interactive = !!href || isButton;
  return (
    <Comp
      href={href}
      {...(isButton ? { type: "button", disabled: unavailable || undefined } : { "aria-disabled": unavailable || undefined })}
      className={cn(
        "flex w-32 shrink-0 flex-col rounded-16 border border-border-default bg-surface-card p-1 font-sans",
        interactive && "cursor-pointer text-left outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
        interactive && !unavailable && "hover:border-green-primary",
        isButton && "disabled:cursor-default",
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
