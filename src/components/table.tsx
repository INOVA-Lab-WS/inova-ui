import * as React from "react";
import { cn } from "../lib/cn";
import { Skeleton } from "./skeleton";

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
  /** While loading: becomes aria-busy and, without rows, shows skeletonRows skeleton lines. */
  busy?: boolean;
  /** Number of skeleton lines while busy and empty of rows (default 4). */
  skeletonRows?: number;
  /**
   * Shape of each skeleton line (#66). "avatar" (default): a circle and 3 bars, for rows that open with a person.
   * "text": one text bar per column, no circle (tables such as store or seller), with `skeletonColumns` bars.
   */
  skeletonRow?: "avatar" | "text";
  /** Bars per line when skeletonRow="text" (default 4; use the number of columns). */
  skeletonColumns?: number;
  /** Optional header above the table, as in Figma: title (14 semibold, muted) and a summary beside it. */
  title?: React.ReactNode;
  summary?: React.ReactNode;
  /** Optional footer note (12, muted) under a divider. */
  note?: React.ReactNode;
}

function SkeletonLine({ row, columns }: { row: "avatar" | "text"; columns: number }) {
  if (row === "text") {
    return (
      <tr aria-hidden>
        {Array.from({ length: columns }, (_, c) => (
          <td key={c} className="border-b border-border-default py-3 pr-3 last:pr-0">
            <Skeleton shape="text" className={c === 0 ? "w-3/4" : "w-1/2"} />
          </td>
        ))}
      </tr>
    );
  }
  return (
    <tr aria-hidden>
      <td colSpan={999} className="py-3">
        <div className="flex items-center gap-4">
          <Skeleton shape="circle" className="size-8" />
          <Skeleton shape="text" className="w-1/3" />
          <Skeleton shape="text" className="w-1/6" />
          <Skeleton shape="text" className="w-1/8" />
        </div>
      </td>
    </tr>
  );
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(({ head, empty, emptyMessage = "Nenhum registro no filtro atual.", caption, busy, skeletonRows = 4, skeletonRow = "avatar", skeletonColumns = 4, title, summary, note, className, children, ...props }, ref) => (
  <div className="flex w-full flex-col gap-4 relative overflow-x-auto rounded-16 border border-border-default bg-surface-card p-5 font-sans">
    {(title || summary) && (
      <div className="flex items-baseline gap-3 text-sm">
        {title && <span className="font-semibold text-text-muted">{title}</span>}
        {summary && <span className="text-text-primary">{summary}</span>}
      </div>
    )}
    <table ref={ref} aria-busy={busy || undefined} className={cn("w-full border-collapse font-sans", className)} {...props}>
      {caption && <caption className="sr-only">{caption}</caption>}
      {head && <thead>{head}</thead>}
      <tbody>{busy && !React.Children.count(children) ? Array.from({ length: skeletonRows }, (_, i) => (
        <SkeletonLine key={i} row={skeletonRow} columns={skeletonColumns} />
      )) : empty ? <tr><td colSpan={999} className="text-left text-sm text-text-muted">{emptyMessage}</td></tr> : children}</tbody>
    </table>
    {note && <p className="border-t border-border-default pt-3 text-xs text-text-muted">{note}</p>}
  </div>
));
Table.displayName = "Table";
