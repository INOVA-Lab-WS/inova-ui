import * as React from "react";
import { MessageCircleHeart, X } from "lucide-react";
import { cn } from "../lib/cn";

/** FeedbackPrompt · Figma "feedback-prompt". A dismissible card that invites feedback. */
export interface FeedbackPromptProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  prompt: React.ReactNode;
  icon?: React.ReactNode;
  onOpen?: () => void;
  onDismiss?: () => void;
  dismissLabel?: string;
}

const FOCUS = "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary";

export function FeedbackPrompt({ prompt, icon, onOpen, onDismiss, dismissLabel = "Dispensar", className, ...props }: FeedbackPromptProps) {
  return (
    <div className={cn("flex h-10 items-center gap-1 rounded-16 bg-surface-card pl-1 pr-1 font-sans", className)} {...props}>
      <button type="button" onClick={onOpen} className={cn("flex min-w-0 flex-1 items-center gap-3 rounded-16 px-3 py-2 text-left text-sm text-text-primary hover:bg-surface-muted [&_svg]:size-4 [&_svg]:shrink-0", FOCUS)}>
        {icon ?? <MessageCircleHeart aria-hidden />}
        <span className="truncate">{prompt}</span>
      </button>
      {onDismiss && (
        <button type="button" aria-label={dismissLabel} onClick={onDismiss} className={cn("flex size-8 shrink-0 items-center justify-center rounded-pill text-text-muted hover:bg-surface-muted [&_svg]:size-4", FOCUS)}>
          <X aria-hidden />
        </button>
      )}
    </div>
  );
}
