import * as React from "react";
import { cn } from "../lib/cn";

/** Native horizontal snap rail. Thumbnail size="compact" defines the card width. */
export const ThumbnailRail = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => (
  <div ref={ref} role="group" tabIndex={0} className={cn("scrollbar-none flex min-w-0 max-w-full outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth motion-reduce:scroll-auto [&>*]:shrink-0 [&>*]:snap-start", className)} {...props}>{children}</div>
));
ThumbnailRail.displayName = "ThumbnailRail";
