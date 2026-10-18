import * as React from "react";
import { cn } from "../lib/cn";

export interface DetailLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebar: React.ReactNode;
  sidebarLabel?: string;
  /** CSS top inset, for example a sticky application header height. */
  stickyTop?: string | number;
}
/** Non-modal detail: primary content first, inline sidebar below mobile / sticky alongside desktop. */
export function DetailLayout({ children, sidebar, sidebarLabel = "Detalhes", stickyTop = "1rem", className, ...props }: DetailLayoutProps) {
  return <div className={cn("grid min-w-0 grid-cols-1 items-start gap-6 font-sans lg:grid-cols-[minmax(0,1fr)_minmax(16rem,24rem)]", className)} {...props}>
    <div className="min-w-0">{children}</div>
    <aside aria-label={sidebarLabel} className="min-w-0 lg:sticky lg:top-[var(--inova-detail-sticky-top)]" style={{ "--inova-detail-sticky-top": typeof stickyTop === "number" ? `${stickyTop}px` : stickyTop } as React.CSSProperties}>{sidebar}</aside>
  </div>;
}
