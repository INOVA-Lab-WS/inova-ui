import * as React from "react";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { Skeleton } from "./skeleton";

export interface PageGridProps extends React.HTMLAttributes<HTMLDivElement> {
  loadState?: "idle" | "loading" | "error" | "end";
  onLoadMore?: () => void | Promise<void>;
  onRetry?: () => void | Promise<void>;
  /** Change after each consumed page, including pages with the same item count. Defaults to child count. */
  loadKey?: string | number;
  loadingContent?: React.ReactNode;
  errorMessage?: React.ReactNode;
  endMessage?: React.ReactNode;
}

/** Responsive foundation grid. Data fetching and pagination belong to the caller. */
export const PageGrid = React.forwardRef<HTMLDivElement, PageGridProps>(({ children, loadState = "idle", onLoadMore, onRetry, loadKey, loadingContent, errorMessage = "Não foi possível carregar mais itens.", endMessage = "Todos os itens foram carregados.", className, ...props }, ref) => {
  const sentinel = React.useRef<HTMLDivElement>(null);
  const inFlight = React.useRef(false);
  const lastRequest = React.useRef<string | number | undefined>(undefined);
  const [pending, setPending] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const key = loadKey ?? React.Children.count(children);
  const generation = React.useRef(0);
  const committedKey = React.useRef(key);
  const mounted = React.useRef(true);
  // Each pagination key is a new request generation. A previous page/filter promise
  // may still settle, but it must never own the next generation's status or lock.
  React.useLayoutEffect(() => {
    generation.current += 1;
    committedKey.current = key;
    inFlight.current = false;
    lastRequest.current = undefined;
    setPending(false);
    setFailed(false);
  }, [key]);
  React.useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const request = React.useCallback((retry = false, manual = false) => {
    if (!Object.is(committedKey.current, key) || inFlight.current || loadState === "loading" || loadState === "end" || (!retry && (loadState === "error" || failed || (!manual && lastRequest.current === key)))) return;
    const callback = retry ? onRetry ?? onLoadMore : onLoadMore;
    if (!callback) return;
    const requestGeneration = generation.current;
    lastRequest.current = key;
    inFlight.current = true;
    setPending(true);
    setFailed(false);
    const isCurrent = () => mounted.current && generation.current === requestGeneration;
    Promise.resolve().then(() => { if (isCurrent()) return callback(); }).catch(() => {
      if (isCurrent()) setFailed(true);
    }).finally(() => {
      if (!isCurrent()) return;
      inFlight.current = false;
      setPending(false);
    });
  }, [loadState, failed, key, onLoadMore, onRetry]);
  React.useEffect(() => {
    const el = sentinel.current;
    if (!el || !onLoadMore || loadState !== "idle" || pending || failed || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) request();
    }, { rootMargin: "200px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, [key, loadState, onLoadMore, request, failed, pending]);
  const loading = loadState === "loading" || pending;
  const error = loadState === "error" || failed;
  const hasFooter = !!onLoadMore || loadState !== "idle";
  return <div ref={ref} className={cn("mx-auto grid w-full max-w-[calc(var(--inova-content-max-width)+2*var(--inova-grid-margin))] grid-cols-[repeat(var(--inova-grid-columns),minmax(0,1fr))] gap-x-[var(--inova-grid-gutter)] px-[var(--inova-grid-margin)]", className)} {...props}>
    {children}
    {hasFooter && <div ref={sentinel} className="col-span-full flex flex-col items-center gap-3 py-4" aria-busy={loading || undefined}>
      {loading ? <><span role="status" className="sr-only">Carregando mais itens…</span>{loadingContent ?? <div aria-hidden className="grid w-full grid-cols-2 gap-4 lg:grid-cols-3">{[0, 1, 2].map(i => <Skeleton key={i} className="aspect-square w-full" />)}</div>}</> : error ? <><p role="status" className="text-sm text-text-muted">{errorMessage}</p>{(onRetry || onLoadMore) && <Button size="compact" variant="outline" onClick={() => request(true)}>Tentar de novo</Button>}</> : loadState === "end" ? <p role="status" className="text-sm text-text-muted">{endMessage}</p> : onLoadMore && <Button size="compact" variant="outline" onClick={() => request(false, true)}>Carregar mais</Button>}
    </div>}
  </div>;
});
PageGrid.displayName = "PageGrid";
