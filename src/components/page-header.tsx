import * as React from "react";
import { cn } from "../lib/cn";

/**
 * PageHeader · Figma "page-header". Top of a work page: title (24 mobile, 32 desktop), description,
 * optional main action (full width on mobile) and optional tabs, built with Chip (filled = active, ghost = others).
 */
export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  /** Usually a <nav> of Chip links. */
  tabs?: React.ReactNode;
}

export function PageHeader({ title, description, action, tabs, className, ...props }: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-4 font-sans", className)} {...props}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h1 className="text-xl font-bold text-text-primary lg:text-2xl">{title}</h1>
          {description && <p className="text-sm text-text-muted">{description}</p>}
        </div>
        {action && <div className="shrink-0 [&>*]:w-full lg:[&>*]:w-auto">{action}</div>}
      </div>
      {tabs && <div className="flex flex-wrap gap-1">{tabs}</div>}
    </header>
  );
}
