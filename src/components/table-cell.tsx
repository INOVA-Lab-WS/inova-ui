import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

/** Table cell · Figma "table / cell": header (column), row-header (the row's name, <th scope="row">), body or numeric. */
const cellVariants = cva("px-3 py-3 text-sm", {
  variants: {
    type: {
      header: "text-xs font-semibold text-text-muted",
      body: "font-medium text-text-primary",
      "row-header": "text-left font-semibold text-text-primary",
      numeric: "font-semibold tabular-nums text-text-primary",
    },
    align: { start: "text-left", end: "text-right" },
  },
  defaultVariants: { type: "body", align: "start" },
});

export interface TableCellProps extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, "align">, VariantProps<typeof cellVariants> {
  /** Secondary column: hidden below md (the app shows its data under the row header on phones). */
  secondary?: boolean;
}

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(({ type, align, secondary, className, ...props }, ref) => {
  const Tag = type === "header" || type === "row-header" ? "th" : "td";
  const scope = type === "header" ? "col" : type === "row-header" ? "row" : undefined;
  return (
    <Tag
      ref={ref}
      scope={scope}
      className={cn(cellVariants({ type, align: align ?? (type === "numeric" ? "end" : "start") }), secondary && "hidden md:table-cell", className)}
      {...props}
    />
  );
});
TableCell.displayName = "TableCell";
