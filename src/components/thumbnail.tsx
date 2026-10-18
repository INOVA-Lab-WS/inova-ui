import * as React from "react";
import { cn } from "../lib/cn";

/** Image/swatch card with optional media overlays and non-nested sibling controls. */
export interface ThumbnailProps extends React.HTMLAttributes<HTMLElement> {
  src?: string;
  alt?: string;
  swatch?: string;
  caption?: React.ReactNode;
  metadata?: React.ReactNode;
  fallback?: React.ReactNode;
  unavailable?: boolean;
  href?: string;
  /** Informational overlay in the upper-left corner of the media. */
  badge?: React.ReactNode;
  /** Independent control in the lower-right media corner. */
  overlayAction?: React.ReactNode;
  author?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Thumbnail({ src, alt = "", swatch, caption, metadata, fallback, unavailable, href, badge, overlayAction, author, footer, className, ...props }: ThumbnailProps) {
  const { onClick, "aria-label": ariaLabel, ...rest } = props;
  const isButton = !href && !!onClick;
  const interactive = !!href || isButton;
  const split = interactive && !!(overlayAction || author || footer);
  const Comp = (split ? "div" : href ? "a" : isButton ? "button" : "div") as React.ElementType;
  const control = cn("cursor-pointer text-left outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary", !unavailable && "hover:border-green-primary");
  const cardClick: React.MouseEventHandler<HTMLElement> = event => {
    if (unavailable) { event.preventDefault(); return; }
    onClick?.(event);
  };
  return <Comp {...rest} aria-label={!split ? ariaLabel : undefined} href={!split ? href : undefined} onClick={!split && interactive ? cardClick : undefined}
    {...(!split && isButton ? { type: "button", disabled: unavailable || undefined } : { "aria-disabled": unavailable || undefined })}
    className={cn("relative isolate flex w-32 shrink-0 flex-col rounded-16 border border-border-default bg-surface-card p-1 font-sans", interactive && !split && control, split && "has-[>a:hover]:border-green-primary has-[>button:hover]:border-green-primary", unavailable && "opacity-60", className)}>
    {split && (href ? <a href={href} onClick={cardClick} aria-label={ariaLabel ?? (typeof caption === "string" ? caption : alt || "Abrir imagem")} aria-disabled={unavailable || undefined} tabIndex={unavailable ? -1 : undefined} className={cn(control, "absolute inset-0 z-raised rounded-[inherit]")} /> : <button type="button" onClick={cardClick as React.MouseEventHandler<HTMLButtonElement>} disabled={unavailable} aria-label={ariaLabel ?? (typeof caption === "string" ? caption : alt || "Abrir imagem")} className={cn(control, "absolute inset-0 z-raised rounded-[inherit] disabled:cursor-default")} />)}
    <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-12 bg-surface-muted text-text-muted [&_svg]:size-5" style={swatch ? { backgroundColor: swatch } : undefined}>
      {src ? <img src={src} alt={alt} className="size-full object-cover" /> : !swatch && fallback}
      {badge && <div className="pointer-events-none absolute left-2 top-2">{badge}</div>}
      {overlayAction && <div className="absolute bottom-2 right-2 z-header" onClick={event => event.stopPropagation()}>{overlayAction}</div>}
    </div>
    {(caption || metadata || author || footer) && <div className={cn("flex min-w-0 flex-col p-2", (author || footer) && "gap-1")}>
      {caption && <span className="line-clamp-3 text-xs text-text-primary">{caption}</span>}
      {metadata && <span className="truncate text-xs text-text-muted">{metadata}</span>}
      {author && <div className="relative z-header min-w-0" onClick={event => event.stopPropagation()}>{author}</div>}
      {footer && <div className="relative z-header min-w-0" onClick={event => event.stopPropagation()}>{footer}</div>}
    </div>}
  </Comp>;
}
