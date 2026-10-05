import * as React from "react";
import { cn } from "../lib/cn";

/** Table row · Figma "table / row": header row or body row (body rows carry the divider). */
export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  type?: "header" | "body";
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(({ type = "body", className, ...props }, ref) => (
  <tr ref={ref} className={cn("border-b border-border-default", type === "body" && "last:border-b-0", className)} {...props} />
));
TableRow.displayName = "TableRow";
