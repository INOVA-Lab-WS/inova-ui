import * as React from "react";
import { cn } from "../lib/cn";

/**
 * ProductListRow · Figma "product-list-row". Media 56x56 (image, color swatch or icon) + category, name, metadata.
 * kind="card" (default: environment, scene, photo, paint, zone) is a white card with a border; kind="catalog" is the
 * catalog list row, with no card (16px top and bottom), as in the library.
 * Clickable (#82): with `href` it is a link; with `onClick` it is a native `<button type="button">` (pointer, hover,
 * focus ring, Enter and Space). With `onClick` and an `action`, the row area and the action are 2 controls side by side,
 * never one inside the other. Without either it is a plain, informative row.
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
  const clickable = !href && !!props.onClick;
  const frame = cn("flex items-center gap-3 rounded-16 font-sans", kind === "catalog" ? "py-4" : "border border-border-default bg-surface-card p-2");
  const interactive = "cursor-pointer text-left outline-none transition-colors hover:bg-surface-control-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary";
  const body = (
    <>
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
    </>
  );
  if (clickable && action) {
    // The row area is the button; the app's action sits beside it (no button inside a button).
    const { onClick, ...rest } = props;
    return (
      <div className={cn(frame, "has-[>button:first-child:hover]:bg-surface-control-hover", className)} {...(rest as React.HTMLAttributes<HTMLDivElement>)}>
        <button type="button" onClick={onClick as React.MouseEventHandler<HTMLButtonElement>} className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-8 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary">
          {body}
        </button>
        {action}
      </div>
    );
  }
  const Comp = (href ? "a" : clickable ? "button" : "div") as React.ElementType;
  return (
    <Comp href={href} {...(clickable ? { type: "button" } : {})} className={cn(frame, (href || clickable) && interactive, clickable && "w-full", className)} {...props}>
      {body}
      {action}
    </Comp>
  );
}
