import * as React from "react";
import { Check, ClipboardCopy } from "lucide-react";
import { cn } from "../lib/cn";
import { Button } from "./button";

/** CopyField · Figma "copy-field". Mono value with a copy button; after copying the icon turns into a check and screen readers hear "Copiado". */
export interface CopyFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  copyLabel?: string;
  copiedLabel?: string;
}

export function CopyField({ value, copyLabel = "Copiar", copiedLabel = "Copiado", className, ...props }: CopyFieldProps) {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);
  return (
    <div className={cn("flex items-center gap-2 rounded-12 border border-border-default bg-surface-page py-1 pr-2 pl-3", className)} {...props}>
      <code className="min-w-0 flex-1 font-mono text-xs leading-5 break-all whitespace-pre-wrap text-text-primary">{value}</code>
      <Button
        variant="ghost"
        size="desktop"
        iconOnly
        aria-label={copied ? copiedLabel : copyLabel}
        onClick={async () => {
          await navigator.clipboard.writeText(value);
          setCopied(true);
        }}
      >
        {copied ? <Check aria-hidden /> : <ClipboardCopy aria-hidden />}
      </Button>
      <span className="sr-only" role="status">
        {copied ? copiedLabel : ""}
      </span>
    </div>
  );
}
