import * as React from "react";
import { cn } from "../lib/cn";

/**
 * AssistantMessage · Figma "assistant-message". No bubble: running text, then optional slots, then a signature.
 * Compose the slots with the exported parts: SummaryChips, HelpCard, and any Chip/Thumbnail row.
 */
export interface AssistantMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Slot under the text: chips, thumbnails, help card. */
  attachment?: React.ReactNode;
  /** Usually <MetaRow />. */
  meta?: React.ReactNode;
}

export function AssistantMessage({ attachment, meta, children, className, ...props }: AssistantMessageProps) {
  return (
    <div className={cn("flex max-w-full flex-col gap-2 font-sans text-sm text-text-primary", className)} {...props}>
      {children && <div>{children}</div>}
      {attachment}
      {meta}
    </div>
  );
}

export interface SummaryChipsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: { label: React.ReactNode; value: React.ReactNode }[];
}

/** Read-only "Label: value" pills summarising what was understood. */
export function SummaryChips({ items, className, ...props }: SummaryChipsProps) {
  return (
    <div className={cn("flex flex-wrap gap-1", className)} {...props}>
      {items.map((it, i) => (
        <span key={i} className="rounded-pill bg-surface-control px-2 py-1 text-xs text-text-muted">
          {it.label}: <span className="text-text-primary">{it.value}</span>
        </span>
      ))}
    </div>
  );
}

export interface HelpCardProps extends React.HTMLAttributes<HTMLDivElement> {
  items: { title: React.ReactNode; example?: React.ReactNode }[];
}

/** A card listing what the assistant can do, each with an example phrase. */
export function HelpCard({ items, className, ...props }: HelpCardProps) {
  return (
    <div className={cn("flex flex-col gap-3 rounded-16 border border-border-default bg-surface-card p-3", className)} {...props}>
      {items.map((it, i) => (
        <div key={i} className="flex flex-col">
          <span className="text-sm font-semibold text-text-primary">{it.title}</span>
          {it.example && <span className="text-xs text-text-muted">“{it.example}”</span>}
        </div>
      ))}
    </div>
  );
}
