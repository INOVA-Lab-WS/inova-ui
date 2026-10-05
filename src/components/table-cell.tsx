import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/** Table cell · Figma "table / cell": header, body or numeric (tabular, semibold); aligned start or end. */
const cellVariants = cva("px-3 py-3 text-sm", {
  variants: {
    type: {
      header: "text-xs font-semibold text-text-muted",
      body: "text-text-primary",
      numeric: "font-semibold tabular-nums text-text-primary",
    },
    align: { start: "text-left", end: "text-right" },
  },
  defaultVariants: { type: "body", align: "start" },
});

export interface TableCellProps extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, "align">, VariantProps<typeof cellVariants> {}

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(({ type, align, className, ...props }, ref) => {
  const Tag = type === "header" ? "th" : "td";
  return <Tag ref={ref} scope={type === "header" ? "col" : undefined} className={cn(cellVariants({ type, align: align ?? (type === "numeric" ? "end" : "start") }), className)} {...props} />;
});
TableCell.displayName = "TableCell";
