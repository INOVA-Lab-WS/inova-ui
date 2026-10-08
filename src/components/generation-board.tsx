import * as React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "../lib/cn";
import { ProgressReadout } from "./progress-readout";
import { Spinner } from "./spinner";

/**
 * GenerationBoard · Figma "generation-board". The stage that holds the generated image.
 * state: empty (badge + title + subtitle), loading and regenerating (the same blurred surface with the mirror sweep and
 * the "phrase + percent + bar" readout; regenerating keeps the previous image under it), ready (image).
 * With no image under the loading layer (first generation), the readout is dark (text/primary, tone="on-surface") with the
 * spinning loader, so it reads on the light surface (#63). Over a previous image it stays white.
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
  /**
   * How the image sits in the stage (#64). "cover" (default, as the Figma): fills the stage in every direction, keeping the
   * proportion, cropping what overflows. "contain": the whole image, with empty bands (the behaviour up to 0.9.0).
   */
  fit?: "cover" | "contain";
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
  fit = "cover",
  actions,
  className,
  ...props
}: GenerationBoardProps) {
  const busy = state === "loading" || state === "regenerating";
  // Nothing under the loading layer: dark readout on the light surface, plus the spinner (Figma initial-loading).
  const bare = state === "loading" || !src;
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
        <img src={src} alt={alt} className={cn("size-full", fit === "contain" ? "object-contain" : "object-cover")} />
      )}
      {busy && (
        // Same effect for the first generation and for a regeneration (Figma initial-loading = regenerating).
        <div className="absolute inset-0 flex items-center justify-center bg-surface-control/70 backdrop-blur-[var(--inova-blur-glass)]">
          <div className="pointer-events-none absolute inset-0 animate-pulse bg-linear-to-r from-transparent via-white/30 to-transparent motion-reduce:animate-none" aria-hidden />
          <div className="relative flex items-center gap-2 font-sans">
            {bare && <Spinner size="small" role="presentation" aria-hidden aria-label={undefined} />}
            {loadingPhrase && <p className={cn("text-sm", bare ? "text-text-primary" : "text-text-on-ink")}>{loadingPhrase}</p>}
            {progress !== undefined && <ProgressReadout label="Progresso da geração" percent={progress} tone={bare ? "on-surface" : "on-image"} />}
          </div>
        </div>
      )}
      {actions && state !== "empty" && <div className="absolute right-3 bottom-3 flex gap-2">{actions}</div>}
    </div>
  );
}
