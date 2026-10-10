import * as React from "react";
import { ArrowUp, Camera, X } from "lucide-react";
import { cn } from "../lib/cn";
import { Chip } from "./chip";
import { GraphicEqIcon } from "./graphic-eq-icon";

/**
 * InputCard · Figma "input-card". White card: optional photo slots, the textarea, and the controls row.
 * The right action is "speak" while empty and "send" once there is text or a photo.
 * Both actions use the library's black action Chip surface. The textarea grows with its content.
 */
export interface InputCardPhoto {
  src: string;
  alt?: string;
}

export interface InputCardProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value"> {
  value: string;
  onValueChange: (value: string) => void;
  photos?: InputCardPhoto[];
  onRemovePhoto?: (index: number) => void;
  onCamera?: () => void;
  onSend?: () => void;
  /** Press-and-hold handlers for voice. */
  speakProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  speakLabel?: string;
  containerClassName?: string;
}

export const InputCard = React.forwardRef<HTMLTextAreaElement, InputCardProps>(
  (
    { value, onValueChange, photos, onRemovePhoto, onCamera, onSend, speakProps, speakLabel = "Falar", placeholder = "Fale segurando o botão, ou digite…", containerClassName, className, onChange, onKeyDown, ...props },
    ref,
  ) => {
    const canSend = value.trim().length > 0 || (photos?.length ?? 0) > 0;
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    React.useImperativeHandle(ref, () => textareaRef.current!, []);

    const resizeTextarea = React.useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea || textarea.clientWidth === 0) return;
      textarea.style.height = "auto";
      const style = getComputedStyle(textarea);
      const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
      const border = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
      textarea.style.height = `${textarea.scrollHeight + (style.boxSizing === "border-box" ? border : -padding)}px`;
    }, []);

    React.useLayoutEffect(resizeTextarea);
    React.useLayoutEffect(() => {
      const textarea = textareaRef.current;
      if (!textarea || typeof ResizeObserver === "undefined") return;
      let previousWidth = -1;
      const observer = new ResizeObserver(([entry]) => {
        if (entry.contentRect.width !== previousWidth) {
          previousWidth = entry.contentRect.width;
          resizeTextarea();
        }
      });
      observer.observe(textarea);
      return () => observer.disconnect();
    }, [resizeTextarea]);
    return (
      <div className={cn("flex flex-col gap-4 rounded-24 bg-surface-card p-4 font-sans", containerClassName)}>
        {photos && photos.length > 0 && (
          <div className="flex gap-2">
            {photos.map((p, i) => (
              <span key={i} className="relative size-12 shrink-0 rounded-8 bg-surface-control">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.src} alt={p.alt ?? ""} className="size-full rounded-8 object-cover" />
                {onRemovePhoto && (
                  <button
                    type="button"
                    aria-label="Remover foto"
                    onClick={() => onRemovePhoto(i)}
                    className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-pill bg-surface-ink text-text-on-ink outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary [&_svg]:size-3"
                  >
                    <X aria-hidden />
                  </button>
                )}
              </span>
            ))}
          </div>
        )}
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            onValueChange(e.target.value);
            onChange?.(e);
          }}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            if (!e.defaultPrevented && !e.nativeEvent.isComposing && e.key === "Enter" && !e.shiftKey && canSend) {
              e.preventDefault();
              onSend?.();
            }
          }}
          className={cn("w-full resize-none overflow-y-hidden bg-transparent text-base text-text-primary lg:py-2 lg:text-xs outline-none placeholder:text-text-muted", className)}
          {...props}
        />
        <div className="flex items-center justify-between gap-2">
          {onCamera ? (
            <Chip appearance="filled" size="medium" className="lg:size-8 lg:[&_svg]:size-4" aria-label="Adicionar foto" onClick={onCamera} iconOnly icon={<Camera aria-hidden />} />
          ) : (
            <span />
          )}
          {canSend ? (
            <Chip appearance="action" size="medium" className="lg:size-8 lg:[&_svg]:size-4" aria-label="Enviar" onClick={onSend} iconOnly icon={<ArrowUp aria-hidden />} />
          ) : (
            <Chip appearance="action" size="medium" icon={<GraphicEqIcon />} {...speakProps} className={cn("lg:h-8 lg:gap-1 lg:text-xs lg:leading-5 lg:[&_svg]:size-4", speakProps?.className)}>
              {speakLabel}
            </Chip>
          )}
        </div>
      </div>
    );
  },
);
InputCard.displayName = "InputCard";
