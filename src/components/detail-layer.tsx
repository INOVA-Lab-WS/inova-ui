import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../lib/cn";
import { Button } from "./button";
import type { ImageViewerImage } from "./image-viewer";

export interface DetailLayerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  image?: ImageViewerImage;
  /** Replacement media, for example a loading skeleton. */
  media?: React.ReactNode;
  /** Optional zoom action; navigation and any viewer state remain caller-owned. */
  onImageClick?: () => void;
  imageActionLabel?: string;
  closeLabel?: string;
  /** Desktop panel width; mobile always uses the available width. */
  panelWidth?: number | string;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}

/** Modal photo/detail composition; DetailLayout remains the separate inline, non-modal layout. */
export function DetailLayer({ open, onOpenChange, title, image, media, onImageClick, imageActionLabel = "Ampliar imagem", closeLabel = "Fechar", panelWidth = 400, initialFocusRef, returnFocusRef, children, className, style, onClick, ...props }: DetailLayerProps) {
  const opener = React.useRef<HTMLElement | null>(null);
  const content = React.useRef<HTMLDivElement>(null);
  const closeBackground = (event: React.MouseEvent<HTMLElement>) => {
    if (event.target === event.currentTarget) onOpenChange(false);
  };
  const imageContent = image && <img src={image.src} alt={image.alt} draggable={false} className="aspect-square w-full rounded-16 object-contain lg:aspect-auto lg:max-h-full lg:w-auto lg:max-w-full" />;
  return <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-overlay bg-surface-ink-translucent backdrop-blur-[var(--inova-blur-ink)]" />
      <Dialog.Content ref={content} aria-describedby={undefined}
        onOpenAutoFocus={(event) => {
          const focused = document.activeElement;
          if (focused instanceof HTMLElement && !content.current?.contains(focused)) opener.current = focused;
          if (initialFocusRef?.current) { event.preventDefault(); initialFocusRef.current.focus({ preventScroll: true }); }
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          const target = returnFocusRef?.current ?? opener.current;
          if (target?.isConnected) target.focus({ preventScroll: true });
        }}
        onClick={(event) => { onClick?.(event); if (!event.defaultPrevented) closeBackground(event); }}
        className={cn("fixed inset-0 z-overlay overflow-y-auto overscroll-contain font-sans outline-none lg:overflow-hidden", className)}
        style={{ "--inova-detail-panel-width": typeof panelWidth === "number" ? `${panelWidth}px` : panelWidth, ...style } as React.CSSProperties}
        {...props}>
        <Dialog.Title className="sr-only">{title}</Dialog.Title>
        <div className="relative flex min-h-full flex-col lg:h-full lg:flex-row" onClick={closeBackground}>
          <div onClick={closeBackground} className="relative flex shrink-0 items-center justify-center px-4 pb-8 pt-[calc(var(--inova-safe-area-top)+4.5rem)] lg:h-full lg:min-w-0 lg:flex-1 lg:p-6">
            {media ?? (onImageClick && image ? <button type="button" onClick={onImageClick} aria-label={imageActionLabel} className="flex w-full items-center justify-center rounded-16 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:h-full">{imageContent}</button> : imageContent)}
          </div>
          <aside className="relative -mt-4 flex min-w-0 flex-1 flex-col gap-6 rounded-t-24 bg-surface-card px-4 pb-[calc(var(--inova-safe-area-bottom)+2rem)] pt-6 lg:my-4 lg:mr-4 lg:w-[var(--inova-detail-panel-width)] lg:flex-none lg:overflow-y-auto lg:overscroll-contain lg:rounded-16 lg:p-6 lg:pt-16">
            {children}
          </aside>
        </div>
        <Dialog.Close asChild>
          <Button variant="ink" size="compact" iconOnly aria-label={closeLabel} className="fixed right-4 top-[calc(var(--inova-safe-area-top)+1rem)] z-raised size-10 rounded-pill lg:right-7 lg:top-7 lg:size-10 lg:bg-surface-control lg:text-text-primary"><X aria-hidden /></Button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
