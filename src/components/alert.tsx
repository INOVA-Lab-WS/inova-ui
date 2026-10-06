import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleAlert, CircleCheck, CircleX, Info } from "lucide-react";
import { cn } from "../lib/cn";

/** Alert · Figma "alert". Inline notice aligned with Gate's Notice: no outline, tinted background. */
const alertVariants = cva("flex items-start gap-3 rounded-16 p-3 font-sans", {
  variants: {
    tone: {
      information: "bg-status-info-bg text-status-info-fg",
      success: "bg-status-success-bg text-status-success-fg",
      warning: "bg-status-warning-bg text-status-warning-fg",
      error: "bg-status-error-bg text-status-error-fg",
    },
  },
  defaultVariants: { tone: "information" },
});

const ICON = { information: Info, success: CircleCheck, warning: CircleAlert, error: CircleX } as const;

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">, VariantProps<typeof alertVariants> {
  title?: React.ReactNode;
  action?: React.ReactNode;
}

export function Alert({ tone = "information", title, action, children, className, ...props }: AlertProps) {
  const Icon = ICON[tone ?? "information"];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn(alertVariants({ tone }), className)} {...props}>
      <Icon className="mt-0.5 size-5 shrink-0" aria-hidden />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {title && (
          <p className={cn("text-sm font-semibold", tone === "warning" ? "text-status-warning-fg" : "text-text-primary")}>{title}</p>
        )}
        {children && <div className="text-sm">{children}</div>}
      </div>
      {action && <div className="shrink-0 self-center">{action}</div>}
    </div>
  );
}
