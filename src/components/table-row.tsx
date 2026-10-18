import * as React from "react";
import { cn } from "../lib/cn";

/** Table row · semantic header/body row; optional activation preserves nested controls. */
export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  type?: "header" | "body";
  /** Defaults to true for body rows with onClick. Native nested controls remain independent. */
  interactive?: boolean;
}

function fromNestedControl(event: React.SyntheticEvent<HTMLTableRowElement>) {
  const target = event.target;
  if (!(target instanceof Element)) return false;
  const control = target.closest('a[href],button,input,select,textarea,summary,label,video[controls],audio[controls],[role="button"],[role="link"],[role="checkbox"],[role="switch"],[role="combobox"],[role="radio"],[role="tab"],[role="menuitem"],[role="slider"],[contenteditable]:not([contenteditable="false"]),[tabindex]');
  return !!control && control !== event.currentTarget && event.currentTarget.contains(control);
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(({ type = "body", interactive, onClick, onKeyDown, tabIndex, className, ...props }, ref) => {
  const actionable = type === "body" && (interactive ?? !!onClick);
  return (
    <tr
      ref={ref}
      tabIndex={tabIndex ?? (actionable ? 0 : undefined)}
      className={cn(
        "border-b border-border-default",
        actionable && "cursor-pointer outline-none [&>td]:transition-colors [&>th]:transition-colors [&>:first-child]:rounded-l-8 [&>:last-child]:rounded-r-8 hover:[&>td]:bg-warm-50 hover:[&>th]:bg-warm-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-text-primary",
        className,
      )}
      onClick={event => {
        if (actionable && fromNestedControl(event)) return;
        onClick?.(event);
      }}
      onKeyDown={event => {
        if (actionable && fromNestedControl(event)) return;
        onKeyDown?.(event);
        if (actionable && !event.defaultPrevented && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          if (!event.repeat) event.currentTarget.click();
        }
      }}
      {...props}
    />
  );
});
TableRow.displayName = "TableRow";
