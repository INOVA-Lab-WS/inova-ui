import * as React from "react";
import { cn } from "../lib/cn";
import { Check, ClipboardCopy } from "lucide-react";
import { Button } from "./button";

/**
 * ProductListRow · Figma "product-list-row". Media 56x56 (image, color swatch or icon) + category, name, metadata.
 * kind="card" (default: environment, scene, photo, paint, zone) is a white card with a border; kind="catalog" is the
 * catalog list row, with no card (16px top and bottom), as in the library.
 * Clickable (#82): with `href` it is a link; with `onClick` it is a native `<button type="button">` (pointer, hover,
 * focus ring, Enter and Space). With `onClick` and an `action`, the row area and the action are 2 controls side by side,
 * never one inside the other. Without either it is a plain, informative row.
 */
export interface ProductListRowProps extends React.HTMLAttributes<HTMLElement> {
  src?: string;
  alt?: string;
  /** CSS color from data (e.g. a paint hex). */
  swatch?: string;
  /** Shown when there is no image and no swatch. */
  icon?: React.ReactNode;
  category?: React.ReactNode;
  name: React.ReactNode;
  metadata?: React.ReactNode;
  href?: string;
  /** Trailing slot (button, chevron). */
  action?: React.ReactNode;
  kind?: "card" | "catalog";
  /** Opt-in compact copy control for a product code. */
  copySku?: string;
  onCopySuccess?: (sku: string) => void;
  onCopyError?: (error: unknown) => void;
}

export function ProductListRow({ src, alt = "", swatch, icon, category, name, metadata, href, action, copySku, onCopySuccess, onCopyError, kind = "card", className, ...props }: ProductListRowProps) {
  const clickable = !href && !!props.onClick;
  const frame = cn("flex items-center gap-3 rounded-16 font-sans", kind === "catalog" ? "py-4" : "border border-border-default bg-surface-card p-2");
  const interactive = "cursor-pointer text-left outline-none transition-colors hover:bg-surface-control-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary";
  const body = (
    <>
      <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-8 bg-surface-muted text-text-muted [&_svg]:size-5" style={swatch ? { backgroundColor: swatch } : undefined}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="size-full object-cover" />
        ) : (
          !swatch && icon
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        {category && <span className="truncate text-xs font-semibold uppercase text-text-accent">{category}</span>}
        <span className="line-clamp-2 text-xs text-text-primary">{name}</span>
        {metadata && <span className="truncate text-xs text-text-muted">{metadata}</span>}
      </span>
    </>
  );
  const controls = <>{copySku !== undefined && <ProductSkuCopy sku={copySku} onSuccess={onCopySuccess} onError={onCopyError} />}{action}</>;
  if ((clickable || href) && (action || copySku !== undefined)) {
    // The row area is the button; the app's action sits beside it (no button inside a button).
    const { onClick, ...rest } = props;
    return (
      <div className={cn(frame, "has-[>button:first-child:hover]:bg-surface-control-hover", className)} {...(rest as React.HTMLAttributes<HTMLDivElement>)}>
        {href ? <a href={href} onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>} className={cn("flex min-w-0 flex-1 items-center gap-3 rounded-8", interactive)}>{body}</a> : <button type="button" onClick={onClick as React.MouseEventHandler<HTMLButtonElement>} className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-8 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary">
          {body}
        </button>}
        <div className="flex shrink-0 items-center gap-1" onClick={event => event.stopPropagation()}>{controls}</div>
      </div>
    );
  }
  const Comp = (href ? "a" : clickable ? "button" : "div") as React.ElementType;
  return (
    <Comp href={href} {...(clickable ? { type: "button" } : {})} className={cn(frame, (href || clickable) && interactive, clickable && "w-full", className)} {...props}>
      {body}
      {controls}
    </Comp>
  );
}


function ProductSkuCopy({ sku, onSuccess, onError }: { sku: string; onSuccess?: (sku: string) => void; onError?: (error: unknown) => void }) {
  const [status, setStatus] = React.useState<"idle" | "copying" | "copied" | "error">("idle");
  const busy = React.useRef(false);
  const currentSku = React.useRef(sku);
  currentSku.current = sku;
  const mounted = React.useRef(true);
  React.useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  React.useEffect(() => {
    setStatus("idle");
  }, [sku]);
  React.useEffect(() => {
    if (status !== "copied") return;
    const timeout = setTimeout(() => setStatus("idle"), 2000);
    return () => clearTimeout(timeout);
  }, [status]);
  const copy = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (busy.current) return;
    busy.current = true;
    setStatus("copying");
    try {
      if (!globalThis.navigator?.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(sku);
    } catch (error) {
      busy.current = false;
      if (mounted.current && currentSku.current === sku) setStatus("error");
      onError?.(error);
      return;
    }
    busy.current = false;
    if (mounted.current && currentSku.current === sku) setStatus("copied");
    onSuccess?.(sku);
  };
  return <>
    <Button variant="ghost" size="compact" iconOnly disabled={status === "copying"} aria-label={status === "copied" ? `Código ${sku} copiado` : `Copiar código ${sku}`} onClick={copy}>{status === "copied" ? <Check aria-hidden /> : <ClipboardCopy aria-hidden />}</Button>
    <span className="sr-only" role="status">{status === "copied" ? `Código ${sku} copiado` : status === "error" ? "Não foi possível copiar o código. Tente novamente." : status === "copying" ? "Copiando código…" : ""}</span>
  </>;
}
