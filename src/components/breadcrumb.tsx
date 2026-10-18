import * as React from "react";
import { cn } from "../lib/cn";
import { ArrowLeft } from "lucide-react";
import { Button } from "./button";

export interface BreadcrumbItem { label: React.ReactNode; href?: string }
export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> { items: BreadcrumbItem[] }
/** The final item is the current page; ancestor items may be native links. */
export function Breadcrumb({ items, className, "aria-label": label = "Navegação estrutural", ...props }: BreadcrumbProps) {
  return <nav aria-label={label} className={cn("font-sans text-xs text-text-muted", className)} {...props}>
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
      {items.map((item, index) => <li key={index} className="inline-flex min-w-0 items-center gap-2">
        {index > 0 && <span aria-hidden>/</span>}
        {index === items.length - 1 ? <span aria-current="page" className="text-text-primary">{item.label}</span> : item.href ? <a href={item.href} className="rounded-4 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary">{item.label}</a> : <span>{item.label}</span>}
      </li>)}
    </ol>
  </nav>;
}

export interface BreadcrumbBackProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  href?: string;
  onBack?: () => void;
}
/** Inline panel navigation, with at most 8px between the back control and optional panel content. */
export function BreadcrumbBack({ label, href, onBack, children, className, ...props }: BreadcrumbBackProps) {
  return <div className={cn("flex min-w-0 flex-col gap-2", className)} {...props}>
    <Button asChild={!!href} size="compact" variant="ghost" className="self-start" onClick={onBack}>
      {href ? <a href={href}><ArrowLeft aria-hidden />{label}</a> : <><ArrowLeft aria-hidden />{label}</>}
    </Button>
    {children}
  </div>;
}
