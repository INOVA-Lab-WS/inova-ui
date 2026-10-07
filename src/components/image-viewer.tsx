import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "../lib/cn";

/**
 * ImageViewer · Figma "image-viewer". Fullscreen gallery with the rules of AmbientAI's lightbox.
 * - Backdrop: the ink chips' surface (surface-ink-translucent + blur). Controls in glass (surface-glass + blur):
 *   close 40px in the corner, counter "2 / 5" top centre, 48px arrows on desktop; counter and arrows only with 2+
 *   images. Actions at the bottom share the width (ImageViewerAction), inside the safe area. Image contained, radius 8.
 * - Navigation loops. Touch: tap the right third = next, left third = previous; swipe 60px sideways = change;
 *   drag down closes (120px, or 60px in under 250ms) while the backdrop fades and the image shrinks; double tap
 *   toggles 2x; pinch up to 4x; drag pans when zoomed; zoom resets on change. Keyboard: Esc closes, arrows change.
 * - Dialog with focus trapped and returned on close; the change is announced ("imagem 2 de 5").
 * Saving the image (watermark, gallery path, counting only on success, abort is not an error) stays in the app:
 * pass it as an action.
 */
export interface ImageViewerImage {
  src: string;
  alt: string;
}

export interface ImageViewerProps {
  images: ImageViewerImage[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Bottom actions, e.g. <ImageViewerAction icon={<Download />}>Baixar</ImageViewerAction>. */
  actions?: React.ReactNode;
  closeLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
}

const glass = "bg-surface-glass backdrop-blur-[var(--inova-blur-glass)] text-text-on-ink transition-colors hover:bg-surface-glass/60";

export function ImageViewerAction({ icon, className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { icon?: React.ReactNode }) {
  return (
    <button
      type="button"
      className={cn(
        "flex flex-1 items-center justify-center gap-2 rounded-pill px-4 py-3 font-sans text-sm font-medium outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white [&_svg]:size-5",
        glass,
        className,
      )}
      {...props}
    >
      {icon && <span aria-hidden className="flex">{icon}</span>}
      {children}
    </button>
  );
}

export function ImageViewer({
  images,
  open,
  onOpenChange,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  actions,
  closeLabel = "Fechar",
  previousLabel = "Imagem anterior",
  nextLabel = "Próxima imagem",
}: ImageViewerProps) {
  const [inner, setInner] = React.useState(defaultIndex);
  const index = indexProp ?? inner;
  const many = images.length > 1;
  const [scale, setScale] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [dismissY, setDismissY] = React.useState(0);
  const [closing, setClosing] = React.useState(false);
  const pointers = React.useRef(new Map<number, { x: number; y: number }>());
  const start = React.useRef<{ x: number; y: number; time: number } | null>(null);
  const pinch = React.useRef<{ dist: number; scale: number } | null>(null);
  const panStart = React.useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const dismissing = React.useRef(false);
  const lastTap = React.useRef(0);
  const tapTimer = React.useRef<number | undefined>(undefined);
  const zoomed = scale > 1.01;

  const goTo = (next: number) => {
    if (!images.length) return;
    const wrapped = ((next % images.length) + images.length) % images.length;
    if (indexProp === undefined) setInner(wrapped);
    onIndexChange?.(wrapped);
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  React.useEffect(() => {
    if (!open) {
      setClosing(false);
      setDismissY(0);
      setScale(1);
      setPan({ x: 0, y: 0 });
    }
  }, [open]);
  React.useEffect(() => () => window.clearTimeout(tapTimer.current), []);

  const dist = () => {
    const [a, b] = [...pointers.current.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  };
  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      pinch.current = { dist: dist(), scale };
      start.current = null;
    } else {
      start.current = { x: e.clientX, y: e.clientY, time: Date.now() };
      if (zoomed) panStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pinch.current && pointers.current.size === 2) {
      setScale(Math.min(4, Math.max(1, pinch.current.scale * (dist() / pinch.current.dist))));
      return;
    }
    if (zoomed && panStart.current) {
      setPan({ x: panStart.current.px + e.clientX - panStart.current.x, y: panStart.current.py + e.clientY - panStart.current.y });
      return;
    }
    if (start.current && !zoomed) {
      const dx = e.clientX - start.current.x;
      const dy = e.clientY - start.current.y;
      if (dismissing.current || (dy > 14 && dy > Math.abs(dx))) {
        dismissing.current = true;
        setDismissY(Math.max(0, dy));
      }
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    panStart.current = null;
    if (scale < 1.05 && scale !== 1) {
      setScale(1);
      setPan({ x: 0, y: 0 });
    }
    const s = start.current;
    start.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    const dt = Date.now() - s.time;
    if (dismissing.current) {
      dismissing.current = false;
      if (dy > 120 || (dy > 60 && dt < 250)) {
        setClosing(true);
        setDismissY(dy + 600);
        window.setTimeout(() => onOpenChange(false), 220);
      } else setDismissY(0);
      return;
    }
    if (zoomed) return;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) && dt < 600) {
      goTo(index + (dx < 0 ? 1 : -1));
      return;
    }
    if (Math.abs(dx) < 6 && Math.abs(dy) < 6 && dt < 250) {
      const now = Date.now();
      if (now - lastTap.current < 300) {
        window.clearTimeout(tapTimer.current);
        lastTap.current = 0;
        if (zoomed) {
          setScale(1);
          setPan({ x: 0, y: 0 });
        } else setScale(2);
        return;
      }
      lastTap.current = now;
      if (e.pointerType === "touch" && many) {
        const w = window.innerWidth;
        const x = e.clientX;
        window.clearTimeout(tapTimer.current);
        tapTimer.current = window.setTimeout(() => {
          if (x > (w * 2) / 3) goTo(index + 1);
          else if (x < w / 3) goTo(index - 1);
        }, 280);
      }
    }
  };

  const chrome = closing ? 0 : 1 - Math.min(dismissY / 300, 0.9);
  const shrink = 1 - Math.min(dismissY, 400) / 1600;
  const dragging = pointers.current.size > 0;
  const image = images[index];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Content
          aria-describedby={undefined}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft" && many) goTo(index - 1);
            else if (e.key === "ArrowRight" && many) goTo(index + 1);
          }}
          className="fixed inset-0 z-overlay flex items-center justify-center font-sans outline-none motion-safe:data-[state=open]:animate-[inova-fade-in_var(--inova-motion-duration-base)_var(--inova-motion-easing-enter)]"
        >
          <Dialog.Title className="sr-only">{image?.alt}</Dialog.Title>
          <div
            aria-hidden
            className="absolute inset-0 bg-surface-ink-translucent backdrop-blur-[var(--inova-blur-ink)] transition-opacity duration-[var(--inova-motion-duration-exit)]"
            style={{ opacity: chrome }}
            onClick={() => onOpenChange(false)}
          />
          <p aria-live="polite" className="sr-only">{many ? `imagem ${index + 1} de ${images.length}` : ""}</p>
          {many && (
            <div
              aria-hidden
              className={cn("absolute left-1/2 top-[calc(var(--inova-safe-area-top)+1rem)] z-raised -translate-x-1/2 rounded-pill px-3 py-1 text-sm font-medium tabular-nums", glass)}
              style={{ opacity: chrome }}
            >
              {index + 1} / {images.length}
            </div>
          )}
          <Dialog.Close
            aria-label={closeLabel}
            className={cn("absolute right-4 top-[calc(var(--inova-safe-area-top)+1rem)] z-raised flex size-10 items-center justify-center rounded-pill outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white [&_svg]:size-5", glass)}
            style={{ opacity: chrome }}
          >
            <X aria-hidden />
          </Dialog.Close>
          {many && (
            <>
              <button type="button" aria-label={previousLabel} onClick={() => goTo(index - 1)} className={cn("absolute left-4 top-1/2 z-raised hidden size-12 -translate-y-1/2 items-center justify-center rounded-pill outline-none focus-visible:outline-2 focus-visible:outline-white tablet:flex [&_svg]:size-6", glass)}>
                <ChevronLeft aria-hidden />
              </button>
              <button type="button" aria-label={nextLabel} onClick={() => goTo(index + 1)} className={cn("absolute right-4 top-1/2 z-raised hidden size-12 -translate-y-1/2 items-center justify-center rounded-pill outline-none focus-visible:outline-2 focus-visible:outline-white tablet:flex [&_svg]:size-6", glass)}>
                <ChevronRight aria-hidden />
              </button>
            </>
          )}
          <div
            className="relative flex size-full touch-none select-none items-center justify-center overflow-hidden px-3 tablet:px-0"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{ cursor: zoomed ? "grab" : "default" }}
          >
            {image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image.src}
                alt={image.alt}
                draggable={false}
                className="max-h-full max-w-full rounded-8 object-contain motion-reduce:!transition-none"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y + dismissY}px) scale(${scale * shrink})`,
                  opacity: closing ? 0 : 1,
                  transition: dragging ? "none" : "transform 220ms var(--inova-motion-easing-exit), opacity 220ms var(--inova-motion-easing-exit)",
                }}
              />
            )}
          </div>
          {actions && (
            <div className="absolute inset-x-4 bottom-[calc(env(safe-area-inset-bottom)+1rem)] z-raised mx-auto flex max-w-120 gap-2" style={{ opacity: chrome }}>
              {actions}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
