import * as React from "react";
import { cn } from "../lib/cn";

/**
 * Table · Figma "table": semantic table on a card, with an empty state. Compose with TableRow and TableCell.
 * caption names it for screen readers; the 1st column of each row is TableCell type="row-header" (<th scope="row">).
 */
export interface TableProps extends Omit<React.TableHTMLAttributes<HTMLTableElement>, "title" | "summary"> {
  /** Header row (a TableRow type="header"). */
  head?: React.ReactNode;
  /** When true, shows emptyMessage instead of the body. */
  empty?: boolean;
  emptyMessage?: string;
  /** Names the table for screen readers; hidden on screen (sr-only). */
  caption?: React.ReactNode;
  /** While loading: becomes aria-busy. */
  busy?: boolean;
  /** Optional header above the table, as in Figma: title (14 semibold, muted) and a summary beside it. */
  title?: React.ReactNode;
  summary?: React.ReactNode;
  /** Optional footer note (12, muted) under a divider. */
  note?: React.ReactNode;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(({ head, empty, emptyMessage = "Nenhum registro no filtro atual.", caption, busy, title, summary, note, className, children, ...props }, ref) => (
  <div className="flex w-full flex-col gap-4 overflow-x-auto rounded-16 border border-border-default bg-surface-card p-5 font-sans">
    {(title || summary) && (
      <div className="flex items-baseline gap-3 text-sm">
        {title && <span className="font-semibold text-text-muted">{title}</span>}
        {summary && <span className="text-text-primary">{summary}</span>}
      </div>
    )}
    <table ref={ref} aria-busy={busy || undefined} className={cn("w-full border-collapse font-sans", className)} {...props}>
      {caption && <caption className="sr-only">{caption}</caption>}
      {head && <thead>{head}</thead>}
      <tbody>{empty ? <tr><td colSpan={999} className="text-left text-sm text-text-muted">{emptyMessage}</td></tr> : children}</tbody>
    </table>
    {note && <p className="border-t border-border-default pt-3 text-xs text-text-muted">{note}</p>}
  </div>
));
Table.displayName = "Table";
