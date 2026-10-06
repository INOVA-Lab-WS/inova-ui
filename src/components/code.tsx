import * as React from "react";
import { cn } from "../lib/cn";

/** Inline code style · Figma "code": mono 12, muted surface, radius 4, 4px on the sides, same line height as text. */
export const codeClassName = (className?: string) =>
  cn("rounded-4 bg-surface-muted px-1 font-mono text-xs leading-5 text-text-primary", className);

/** Code · Figma "code". Code inside running text: an address, a command prefix, an HTTP header name. */
export const Code = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(({ className, ...props }, ref) => (
  <code ref={ref} className={codeClassName(className)} {...props} />
));
Code.displayName = "Code";
