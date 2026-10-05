import * as React from "react";
import { cn } from "../lib/cn";

/** Activity log row · Figma "activity-log / row": time, author glyph, author, action and an optional note. */
export interface ActivityLogRowProps extends React.HTMLAttributes<HTMLLIElement> {
  time: string;
  author: string;
  action: string;
  note?: string;
}

export const ActivityLogRow = React.forwardRef<HTMLLIElement, ActivityLogRowProps>(({ time, author, action, note, className, ...props }, ref) => (
  <li ref={ref} className={cn("flex gap-3 py-2 font-sans", className)} {...props}>
    <span className="w-12 shrink-0 text-sm tabular-nums text-text-muted">{time}</span>
    <span aria-hidden className="flex size-6 shrink-0 items-center justify-center rounded-pill bg-surface-control text-xs font-semibold text-text-neutral">
      {author.trim().charAt(0).toUpperCase()}
    </span>
    <span className="flex min-w-0 flex-col gap-1">
      <span className="text-sm text-text-primary"><span className="font-semibold">{author}</span> {action}</span>
      {note && <span className="text-xs text-text-muted">{note}</span>}
    </span>
  </li>
));
ActivityLogRow.displayName = "ActivityLogRow";
