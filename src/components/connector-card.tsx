import * as React from "react";
import { cn } from "../lib/cn";

/** ConnectorCard · Figma "connector-card". Clickable catalogue card: avatar, title, description, optional metadata. */
export interface ConnectorCardProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "title"> {
  avatar?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  metadata?: React.ReactNode;
  /** Render a different element (e.g. a framework Link) with the same styling. */
  asChild?: boolean;
}

export const connectorCardClassName =
  "flex flex-col gap-3 rounded-16 border border-border-default bg-surface-card p-4 font-sans text-left no-underline transition-[border-color,box-shadow] " +
  "hover:border-border-neutral hover:shadow-[0_1px_2px_rgb(0_0_0/0.05)] outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-border-focus";

export const ConnectorCard = React.forwardRef<HTMLAnchorElement, ConnectorCardProps>(
  ({ className, avatar, title, description, metadata, ...props }, ref) => (
    <a ref={ref} className={cn(connectorCardClassName, className)} {...props}>
      <span className="flex items-center gap-3">
        {avatar}
        <span className="min-w-0 flex-1 text-sm font-semibold text-text-primary">{title}</span>
      </span>
      {description && <span className="text-sm text-text-muted">{description}</span>}
      {metadata && <span className="text-xs text-text-muted">{metadata}</span>}
    </a>
  ),
);
ConnectorCard.displayName = "ConnectorCard";
