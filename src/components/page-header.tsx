import * as React from "react";
import { cn } from "../lib/cn";

/**
 * PageHeader · Figma "page-header". Top of a work page: title (24 mobile, 32 desktop), description,
 * optional main action (full width on mobile) and optional tabs, built with Chip (filled = active, ghost = others).
 */
export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  /** Section headers keep their action beside the heading on every viewport. */
  size?: "page" | "section";
  description?: React.ReactNode;
  action?: React.ReactNode;
  /** Usually a <nav> of Chip links. */
  tabs?: React.ReactNode;
}

export function PageHeader({ title, size = "page", description, action, tabs, className, ...props }: PageHeaderProps) {
  const Heading = size === "section" ? "h2" : "h1";
  return (
    <header className={cn("flex flex-col gap-4 font-sans", className)} {...props}>
      <div className={cn("flex gap-4", size === "section" ? "flex-row items-center" : "flex-col lg:flex-row lg:items-end")}>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Heading className={cn("font-bold text-text-primary", size === "section" ? "text-base lg:text-lg" : "text-xl lg:text-2xl")}>{title}</Heading>
          {description && <p className="text-sm text-text-muted">{description}</p>}
        </div>
        {action && <div className={cn("shrink-0", size === "page" && "[&>*]:w-full lg:[&>*]:w-auto")}>{action}</div>}
      </div>
      {tabs && <div className="flex flex-wrap gap-1">{tabs}</div>}
    </header>
  );
}
