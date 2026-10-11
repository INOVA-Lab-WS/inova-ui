import * as React from "react";
import { Pause, Play } from "lucide-react";
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
  const audioContent = audio && (
    <>
      {audio.playing && !audio.transcribing ? <Pause aria-hidden className="size-[10px] shrink-0 fill-text-primary text-green-secondary-foreground" /> : <Play aria-hidden className="size-[10px] shrink-0 fill-current text-green-secondary-foreground" />}
      <span className="min-w-0 break-words font-bold">{audio.label ?? "Áudio"}</span>
      <span className="shrink-0 tabular-nums">{audio.duration}</span>
    </>
  );
  const audioClassName = "flex w-fit max-w-full items-center gap-1 rounded-pill bg-white p-2 text-xs leading-4 text-text-primary shadow-control";

  return (
    <div className={cn("ml-auto flex max-w-[85%] flex-col gap-2 rounded-24 bg-green-secondary font-sans text-sm text-green-secondary-foreground", audio ? "w-fit p-2" : photos && photos.length > 0 ? "p-2" : "px-4 py-3", className)} {...props}>
      {photos && photos.length > 0 && (
        <div className="flex gap-1 overflow-x-auto">
          {photos.map((p, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={p.src} alt={p.alt ?? ""} className="h-40 shrink-0 rounded-16 object-cover" />
          ))}
        </div>
      )}
      {audio && (
        <>
          {audio.transcribing ? (
            <div className={audioClassName}>{audioContent}</div>
          ) : (
            <button
              type="button"
              onClick={audio.onToggle}
              aria-label={audio.playing ? "Pausar" : "Ouvir"}
              className={cn(audioClassName, "outline-none hover:bg-surface-control-hover focus-visible:outline-2 focus-visible:outline-text-primary")}
            >
              {audioContent}
            </button>
          )}
          {audio.transcribing && <div className="px-2 text-base leading-6 lg:text-sm lg:leading-5">Ouvindo…</div>}
        </>
      )}
      {children && <div className={audio ? "px-2 text-base leading-6 lg:text-sm lg:leading-5" : undefined}>{children}</div>}
    </div>
  );
}
