import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../lib/cn";

export type ThumbnailAppearance = "default" | "frameless";
export type ThumbnailSize = "default" | "compact";
export type ThumbnailAspectRatio = "1:1" | "4:3";

/** Shared card geometry, also used by ThumbnailSkeleton through Thumbnail itself. */
export function thumbnailFrameClassName(appearance: ThumbnailAppearance = "default", size: ThumbnailSize = "default") {
  return cn(
    "relative isolate flex shrink-0 flex-col rounded-16 font-sans",
    size === "compact" ? "w-[42vw] max-w-[180px] snap-start" : "w-32",
    appearance === "frameless" ? "border-0 bg-transparent p-0 transition-colors hover:bg-surface-muted" : "border border-border-default bg-surface-card p-1",
  );
}

/** Image/swatch card with optional media overlays and non-nested sibling controls. */
export interface ThumbnailProps extends React.HTMLAttributes<HTMLElement> {
  src?: string;
  alt?: string;
  swatch?: string;
  caption?: React.ReactNode;
  metadata?: React.ReactNode;
  fallback?: React.ReactNode;
  /** Tried once after the primary image fails; failed images fall back to the fallback slot. */
  fallbackSrc?: string;
  unavailable?: boolean;
  href?: string;
  appearance?: ThumbnailAppearance;
  size?: ThumbnailSize;
  aspectRatio?: ThumbnailAspectRatio;
  /** A single router Link child supplies full-card navigation. Action slots stay its siblings. */
  asChild?: boolean;
  /** Informational overlay in the upper-left corner of the media. */
  badge?: React.ReactNode;
  /** Independent control in the lower-right media corner. */
  overlayAction?: React.ReactNode;
  author?: React.ReactNode;
  footer?: React.ReactNode;
}

export function Thumbnail({ src, alt = "", swatch, caption, metadata, fallback, fallbackSrc, unavailable, href, appearance = "default", size = "default", aspectRatio = "1:1", asChild, children, badge, overlayAction, author, footer, className, ...props }: ThumbnailProps) {
  const { onClick, "aria-label": ariaLabel, ...rest } = props;
  const [failure, setFailure] = React.useState<{ src?: string; fallbackSrc?: string; failed: string[] }>({ src, fallbackSrc, failed: [] });
  React.useEffect(() => setFailure({ src, fallbackSrc, failed: [] }), [src, fallbackSrc]);
  const failed = failure.src === src && failure.fallbackSrc === fallbackSrc ? failure.failed : [];
  const imageSrc = src && !failed.includes(src) ? src : fallbackSrc && !failed.includes(fallbackSrc) ? fallbackSrc : undefined;
  const failImage = () => {
    if (!imageSrc) return;
    setFailure(previous => ({ src, fallbackSrc, failed: [...new Set([...(previous.src === src && previous.fallbackSrc === fallbackSrc ? previous.failed : []), imageSrc])] }));
  };
  const routerChild = asChild ? React.Children.only(children) : undefined;
  if (asChild && !React.isValidElement(routerChild)) throw new Error("Thumbnail asChild requires one router Link element.");
  const isButton = !href && !asChild && !!onClick;
  const interactive = !!href || !!asChild || isButton;
  const split = interactive && !!(asChild || overlayAction || author || footer);
  const Comp = (split ? "div" : href ? "a" : isButton ? "button" : "div") as React.ElementType;
  const control = cn("cursor-pointer text-left outline-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary", appearance === "default" && !unavailable && "hover:border-green-primary");
  const navigationLabel = ariaLabel ?? (typeof caption === "string" ? caption : alt || "Abrir imagem");
  const cardClick: React.MouseEventHandler<HTMLElement> = event => {
    if (unavailable) { event.preventDefault(); return; }
    onClick?.(event);
  };
  const navigationProps = {
    onClick: cardClick,
    "aria-label": navigationLabel,
    "aria-disabled": unavailable || undefined,
    tabIndex: unavailable ? -1 : undefined,
    className: cn(control, "absolute inset-0 z-raised rounded-[inherit]"),
  };
  return <Comp {...rest} aria-label={!split ? ariaLabel : undefined} href={!split ? href : undefined} onClick={!split && interactive ? cardClick : undefined}
    {...(!split && isButton ? { type: "button", disabled: unavailable || undefined } : { "aria-disabled": unavailable || undefined })}
    className={cn(thumbnailFrameClassName(appearance, size), interactive && !split && control, split && appearance === "default" && "has-[>a:hover]:border-green-primary has-[>button:hover]:border-green-primary", unavailable && "opacity-60", className)}>
    {split && (asChild ? <Slot {...navigationProps}>{React.cloneElement(routerChild as React.ReactElement, undefined, <span className="sr-only">{navigationLabel}</span>)}</Slot> : href ? <a href={href} {...navigationProps} /> : <button type="button" {...navigationProps} onClick={cardClick as React.MouseEventHandler<HTMLButtonElement>} disabled={unavailable} />)}
    <div className={cn("relative flex w-full items-center justify-center overflow-hidden rounded-12 bg-surface-muted text-text-muted [&_svg]:size-5", aspectRatio === "4:3" ? "aspect-[4/3]" : "aspect-square")} style={swatch ? { backgroundColor: swatch } : undefined}>
      {imageSrc ? <img key={imageSrc} src={imageSrc} alt={alt} onError={failImage} className="size-full object-cover" /> : !swatch && fallback}
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
