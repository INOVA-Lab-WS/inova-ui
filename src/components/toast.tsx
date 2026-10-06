import * as React from "react";
import { CircleCheck, CircleX, Info } from "lucide-react";
import { cn } from "../lib/cn";

/**
 * Toast · Figma "toast". Same look as Alert plus a shadow.
 * Mobile: full width minus 12px each side, 12px below the notch safe area. Desktop: top center, 16px from the top.
 * Render it inside <ToastViewport/> so it gets the position.
 */
const KIND = {
  success: { Icon: CircleCheck, cls: "bg-status-success-bg [&_svg]:text-status-success-fg" },
  error: { Icon: CircleX, cls: "bg-status-error-bg [&_svg]:text-status-error-fg" },
  info: { Icon: Info, cls: "bg-status-info-bg [&_svg]:text-status-info-fg" },
} as const;

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  kind?: keyof typeof KIND;
}

export function Toast({ kind = "success", children, className, ...props }: ToastProps) {
  const { Icon, cls } = KIND[kind];
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className={cn(
        "pointer-events-auto flex items-center gap-3 rounded-16 p-3 font-sans text-sm font-medium text-text-primary",
        "shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1),0_4px_6px_-4px_rgb(0_0_0/0.1)]",
        cls,
        className,
      )}
      {...props}
    >
      <Icon className="size-5 shrink-0" aria-hidden />
      <span className="min-w-0 flex-1">{children}</span>
    </div>
  );
}

export function ToastViewport({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-3 top-[calc(var(--inova-safe-area-top)+12px)] z-[60] flex flex-col items-stretch gap-2",
        "lg:inset-x-0 lg:top-4 lg:items-center",
        className,
      )}
      {...props}
    />
  );
}
