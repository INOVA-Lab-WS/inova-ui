import * as React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

/**
 * GenerationBoard · Figma "generation-board". The stage that holds the generated image.
 * state: empty (badge + title + subtitle), loading (phrase + progress), ready (image), regenerating (image + overlay).
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
      {state === "loading" && (
        <div className="flex w-full max-w-xs flex-col items-center gap-3 px-4 text-center">
          {loadingPhrase && <p className="text-sm text-text-muted">{loadingPhrase}</p>}
          {progress !== undefined && (
            <div className="h-1 w-full overflow-hidden rounded-pill bg-surface-control" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
              <div className="h-full rounded-pill bg-green-primary transition-[width]" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>
      )}
      {(state === "ready" || state === "regenerating") && src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className={cn("size-full object-contain", state === "regenerating" && "opacity-60")} />
      )}
      {actions && state !== "empty" && <div className="absolute right-3 bottom-3 flex gap-2">{actions}</div>}
    </div>
  );
}
