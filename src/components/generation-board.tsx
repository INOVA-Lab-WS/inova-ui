import * as React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "../lib/cn";
import { ProgressReadout } from "./progress-readout";

/**
 * GenerationBoard · Figma "generation-board". The stage that holds the generated image.
 * state: empty (badge + title + subtitle), loading and regenerating (the same blurred surface with the mirror sweep and
 * the white "phrase + percent + bar" readout; regenerating keeps the previous image under it), ready (image).
 * Actions (products, download…) are passed as `actions` and render over the image: chips `appearance="ink" size="medium"`.
 * Products, download and enlarge are icon-only (`iconOnly` + `aria-label`); "Registrar pedido" keeps its label.
 */
export interface GenerationBoardProps extends React.HTMLAttributes<HTMLDivElement> {
  state?: "empty" | "loading" | "ready" | "regenerating";
  src?: string;
  alt?: string;
  emptyTitle?: React.ReactNode;
  emptySubtitle?: React.ReactNode;
  loadingPhrase?: React.ReactNode;
  /** 0 to 100. */
  progress?: number;
  actions?: React.ReactNode;
}

export function GenerationBoard({
  state = "empty",
  src,
  alt = "",
  emptyTitle = "A mágica acontece aqui",
  emptySubtitle,
  loadingPhrase,
  progress,
  actions,
  className,
  ...props
}: GenerationBoardProps) {
  const busy = state === "loading" || state === "regenerating";
  return (
    <div
      aria-busy={busy || undefined}
      className={cn("relative flex w-full items-center justify-center overflow-hidden rounded-16 font-sans", className)}
      {...props}
    >
      {state === "empty" && (
        <div className="flex flex-col items-center px-4 text-center">
          <span className="flex size-14 items-center justify-center rounded-16 bg-green-secondary text-green-secondary-foreground [&_svg]:size-6">
            <Sparkles aria-hidden />
          </span>
          <p className="mt-3 text-base font-semibold text-text-primary">{emptyTitle}</p>
          {emptySubtitle && <p className="mt-1 text-sm text-text-muted">{emptySubtitle}</p>}
        </div>
      )}
      {(state === "ready" || state === "regenerating") && src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="size-full object-contain" />
      )}
      {busy && (
        // Same effect for the first generation and for a regeneration (Figma initial-loading = regenerating).
        <div className="absolute inset-0 flex items-center justify-center bg-surface-control/70 backdrop-blur-[var(--inova-blur-glass)]">
          <div className="pointer-events-none absolute inset-0 animate-pulse bg-linear-to-r from-transparent via-white/30 to-transparent motion-reduce:animate-none" aria-hidden />
          <div className="relative flex items-center gap-2 font-sans">
            {loadingPhrase && <p className="text-sm text-text-on-ink">{loadingPhrase}</p>}
            {progress !== undefined && <ProgressReadout label="Progresso da geração" percent={progress} />}
          </div>
        </div>
      )}
      {actions && state !== "empty" && <div className="absolute right-3 bottom-3 flex gap-2">{actions}</div>}
    </div>
  );
}
