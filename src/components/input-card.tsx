import * as React from "react";
import { ArrowUp, AudioLines, Camera, X } from "lucide-react";
import { cn } from "../lib/cn";
import { Button } from "./button";

/**
 * InputCard · Figma "input-card". White card: optional photo slots, the textarea, and the controls row.
 * The right action is "speak" while empty and "send" once there is text or a photo.
 * Speak is the green action pill (Button variant="action" size="compact"), as in the library (#67).
 */
export interface InputCardPhoto {
  src: string;
  alt?: string;
}

export interface InputCardProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "value" | "onChange"> {
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
    { value, onValueChange, photos, onRemovePhoto, onCamera, onSend, speakProps, speakLabel = "Falar", placeholder = "Fale segurando o botão, ou digite…", containerClassName, className, ...props },
    ref,
  ) => {
    const canSend = value.trim().length > 0 || (photos?.length ?? 0) > 0;
    return (
      <div className={cn("flex flex-col gap-6 rounded-24 bg-surface-card p-5 font-sans lg:gap-4 lg:p-4", containerClassName)}>
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
          ref={ref}
          rows={1}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onValueChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && canSend) {
              e.preventDefault();
              onSend?.();
            }
          }}
          className={cn("w-full resize-none bg-transparent text-base text-text-primary lg:py-2 lg:text-xs outline-none placeholder:text-text-muted", className)}
          {...props}
        />
        <div className="flex items-center justify-between gap-2">
          {onCamera ? (
            <Button variant="ghost" aria-label="Adicionar foto" onClick={onCamera} iconOnly>
              <Camera aria-hidden />
            </Button>
          ) : (
            <span />
          )}
          {canSend ? (
            <Button aria-label="Enviar" onClick={onSend} iconOnly>
              <ArrowUp aria-hidden />
            </Button>
          ) : (
            <Button variant="action" size="compact" {...speakProps}>
              <AudioLines aria-hidden />
              {speakLabel}
            </Button>
          )}
        </div>
      </div>
    );
  },
);
InputCard.displayName = "InputCard";
