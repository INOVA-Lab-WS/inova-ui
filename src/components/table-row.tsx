import * as React from "react";
import { cn } from "../lib/cn";

/** Table row · Figma "table / row": header or body row, 36px, each with the divider below. */
export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  type?: "header" | "body";
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(({ type = "body", className, ...props }, ref) => (
  <tr ref={ref} className={cn("border-b border-border-default", className)} {...props} />
));
TableRow.displayName = "TableRow";
