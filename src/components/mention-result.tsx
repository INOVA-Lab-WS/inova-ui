import * as React from "react";
import { cn } from "../lib/cn";

/** MentionResult · Figma "mention-result". One row of the @-mention results list. */
export interface MentionResultProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "name"> {
  src?: string;
  alt?: string;
  name: React.ReactNode;
  description?: React.ReactNode;
  tag?: React.ReactNode;
}

export const MentionResult = React.forwardRef<HTMLButtonElement, MentionResultProps>(
  ({ src, alt = "", name, description, tag, className, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "flex w-full items-center gap-3 bg-surface-card p-2 text-left font-sans outline-none transition-colors hover:bg-surface-control-hover",
        "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-text-primary aria-selected:bg-surface-selected",
        className,
      )}
      {...props}
    >
      <span className="size-10 shrink-0 overflow-hidden rounded-8 bg-surface-control">
        {src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="size-full object-cover" />
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-xs text-text-primary">{name}</span>
        {description && <span className="truncate text-xs text-text-muted">{description}</span>}
      </span>
      {tag && <span className="shrink-0 rounded-pill bg-green-secondary px-2 py-1 text-xs text-green-secondary-foreground">{tag}</span>}
    </button>
  ),
);
MentionResult.displayName = "MentionResult";
