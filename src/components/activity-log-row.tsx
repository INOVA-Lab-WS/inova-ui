import * as React from "react";
import { Shield } from "lucide-react";
import { cn } from "../lib/cn";

/**
 * Activity log row · Figma "activity-log / row": time (14, muted), then who acted (24px disc with a 16px glyph and the
 * name in 14 semibold), then the action (14) with an optional note (12, muted). On phones the action goes under the
 * author; from md the author takes a 180px column beside it. Padding 12, gap 12.
 */
export interface ActivityLogRowProps extends React.HTMLAttributes<HTMLLIElement> {
  time: string;
  author: string;
  action: string;
  note?: string;
  /** Glyph for who acted (person, admin, service logo). Default: Shield. */
  icon?: React.ReactNode;
}

export const ActivityLogRow = React.forwardRef<HTMLLIElement, ActivityLogRowProps>(({ time, author, action, note, icon, className, ...props }, ref) => (
  <li ref={ref} className={cn("flex gap-3 p-3 font-sans", className)} {...props}>
    <span className="w-12 shrink-0 text-sm tabular-nums text-text-muted md:w-13">{time}</span>
    <span className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:gap-3">
      <span className="flex items-center gap-2 md:w-45 md:shrink-0">
        <span aria-hidden className="flex size-6 shrink-0 items-center justify-center rounded-pill border border-border-default bg-surface-card text-text-muted [&_svg]:size-4">
          {icon ?? <Shield />}
        </span>
        <span className="truncate text-sm font-semibold text-text-primary">{author}</span>
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-sm text-text-primary">{action}</span>
        {note && <span className="text-xs text-text-muted">{note}</span>}
      </span>
    </span>
  </li>
));
ActivityLogRow.displayName = "ActivityLogRow";
