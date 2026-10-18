import * as React from "react";
import { Avatar } from "./avatar";
import { cn } from "../lib/cn";

export interface AuthorLineProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  store?: string;
  src?: string;
}

/** Small avatar and a single truncated line identifying the author and their store. */
export const AuthorLine = React.forwardRef<HTMLSpanElement, AuthorLineProps>(({ name, store, src, className, ...props }, ref) => (
  <span ref={ref} className={cn("inline-flex min-w-0 max-w-full items-center gap-1.5 font-sans text-xs text-text-muted", className)} {...props}>
    <Avatar size="small" name={name} src={src} aria-hidden="true" />
    <span className="min-w-0 truncate" title={store ? `${name} · ${store}` : name}><span className="font-medium text-text-primary">{name}</span>{store && <> · {store}</>}</span>
  </span>
));
AuthorLine.displayName = "AuthorLine";
