import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";

/**
 * ConnectorCard · Figma "connector-card". Clickable catalogue card: avatar, title, trailing arrow,
 * description, optional metadata. The arrow says the card opens something (also on touch, where there is no hover).
 * With asChild, pass the app's Link as the only child: it receives the look and the card content.
 */
export interface ConnectorCardProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "title"> {
  avatar?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  metadata?: React.ReactNode;
  /** Trailing arrow next to the title. Default true. */
  arrow?: boolean;
  /** Render the single child element (e.g. a framework Link) as the card. */
  asChild?: boolean;
}

export const connectorCardClassName =
  "flex h-full flex-col gap-3 rounded-16 border border-border-default bg-surface-card p-4 font-sans text-left no-underline transition-[border-color,box-shadow] " +
  "hover:border-border-neutral hover:shadow-control outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-border-focus";

export const ConnectorCard = React.forwardRef<HTMLAnchorElement, ConnectorCardProps>(
  ({ className, avatar, title, description, metadata, arrow = true, asChild, children, ...props }, ref) => {
    const content = (
      <>
        <span className="flex items-center gap-3">
          {avatar}
          <span className="min-w-0 flex-1 text-sm font-semibold text-text-primary">{title}</span>
          {arrow && <ChevronRight aria-hidden className="size-4 shrink-0 text-text-muted" />}
        </span>
        {description && <span className="text-sm text-text-muted">{description}</span>}
        {metadata && <span className="mt-auto text-xs text-text-muted">{metadata}</span>}
      </>
    );
    if (asChild && React.isValidElement<{ className?: string; children?: React.ReactNode }>(children)) {
      return React.cloneElement(children, {
        ...props,
        ref,
        className: cn(connectorCardClassName, className, children.props.className),
        children: content,
      } as React.Attributes & { className: string; children: React.ReactNode });
    }
    return (
      <a ref={ref} className={cn(connectorCardClassName, className)} {...props}>
        {content}
      </a>
    );
  },
);
ConnectorCard.displayName = "ConnectorCard";
