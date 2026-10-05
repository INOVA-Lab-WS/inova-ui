import * as React from "react";
import { cn } from "../lib/cn";

/** Table · Figma "table": semantic table on a card, with an empty state. Compose with TableRow and TableCell. */
export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** Header row (a TableRow type="header"). */
  head?: React.ReactNode;
  /** When true, shows emptyMessage instead of the body. */
  empty?: boolean;
  emptyMessage?: string;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(({ head, empty, emptyMessage = "Nenhum registro no filtro atual.", className, children, ...props }, ref) => (
  <div className="w-full overflow-x-auto rounded-12 border border-border-default bg-surface-card">
    <table ref={ref} className={cn("w-full border-collapse font-sans", className)} {...props}>
      {head && <thead>{head}</thead>}
      <tbody>{empty ? <tr><td colSpan={999} className="px-3 py-8 text-center text-sm text-text-muted">{emptyMessage}</td></tr> : children}</tbody>
    </table>
  </div>
));
Table.displayName = "Table";
