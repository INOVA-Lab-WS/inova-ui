import * as React from "react";
import { Loader2, Pause, Play } from "lucide-react";
import { cn } from "../lib/cn";

/** UserMessage · Figma "user-message". The user's light-green bubble: text, photos and/or a voice note. */
export interface UserMessagePhoto {
  src: string;
  alt?: string;
}

export interface UserMessageAudio {
  duration: string;
  playing?: boolean;
  transcribing?: boolean;
  onToggle?: () => void;
  label?: string;
}

export interface UserMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  photos?: UserMessagePhoto[];
  audio?: UserMessageAudio;
}

export function UserMessage({ photos, audio, children, className, ...props }: UserMessageProps) {
  return (
    <div className={cn("ml-auto flex max-w-[85%] flex-col gap-2 rounded-24 bg-green-secondary px-4 py-3 font-sans text-sm text-green-secondary-foreground", className)} {...props}>
      {photos && photos.length > 0 && (
        <div className="flex gap-1 overflow-x-auto">
          {photos.map((p, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={p.src} alt={p.alt ?? ""} className="h-40 shrink-0 rounded-16 object-cover" />
          ))}
        </div>
      )}
      {audio && (
        <div className="flex items-center gap-2">
          {audio.transcribing ? (
            <Loader2 aria-hidden className="size-4 animate-spin" />
          ) : (
            <button
              type="button"
              onClick={audio.onToggle}
              aria-label={audio.playing ? "Pausar" : "Ouvir"}
              className="flex size-8 items-center justify-center rounded-pill outline-none hover:bg-surface-glass focus-visible:outline-2 focus-visible:outline-text-primary [&_svg]:size-4"
            >
              {audio.playing ? <Pause aria-hidden /> : <Play aria-hidden />}
            </button>
          )}
          <span className="text-xs font-bold">{audio.label ?? "Áudio"}</span>
          <span className="text-xs tabular-nums">{audio.duration}</span>
        </div>
      )}
      {children && <div>{children}</div>}
    </div>
  );
}
