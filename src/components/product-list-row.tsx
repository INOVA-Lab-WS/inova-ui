import * as React from "react";
import { cn } from "../lib/cn";

/**
 * ProductListRow · Figma "product-list-row". Media 56x56 (image, color swatch or icon) + category, name, metadata.
 * kind="card" (default: environment, scene, photo, paint, zone) is a white card with a border; kind="catalog" is the
 * catalog list row, with no card (16px top and bottom), as in the library.
 */
export interface ProductListRowProps extends React.HTMLAttributes<HTMLElement> {
  src?: string;
  alt?: string;
  /** CSS color from data (e.g. a paint hex). */
  swatch?: string;
  /** Shown when there is no image and no swatch. */
  icon?: React.ReactNode;
  category?: React.ReactNode;
  name: React.ReactNode;
  metadata?: React.ReactNode;
  href?: string;
  /** Trailing slot (button, chevron). */
  action?: React.ReactNode;
  kind?: "card" | "catalog";
}

export function ProductListRow({ src, alt = "", swatch, icon, category, name, metadata, href, action, kind = "card", className, ...props }: ProductListRowProps) {
  const Comp = (href ? "a" : "div") as React.ElementType;
  return (
    <Comp
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-16 font-sans",
        kind === "catalog" ? "py-4" : "border border-border-default bg-surface-card p-2",
        href && "outline-none transition-colors hover:bg-surface-control-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
        className,
      )}
      {...props}
    >
      <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-8 bg-surface-muted text-text-muted [&_svg]:size-5" style={swatch ? { backgroundColor: swatch } : undefined}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="size-full object-cover" />
        ) : (
          !swatch && icon
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        {category && <span className="truncate text-xs font-semibold uppercase text-text-accent">{category}</span>}
        <span className="line-clamp-2 text-xs text-text-primary">{name}</span>
        {metadata && <span className="truncate text-xs text-text-muted">{metadata}</span>}
      </span>
      {action}
    </Comp>
  );
}
