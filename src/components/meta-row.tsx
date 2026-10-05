import * as React from "react";
import { cn } from "../lib/cn";

/** MetaRow · Figma "meta-row". The assistant's signature under a message: avatar + optional time. */
export interface MetaRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Avatar node, usually <BotAvatar />. */
  avatar?: React.ReactNode;
  time?: React.ReactNode;
}

export function MetaRow({ avatar, time, className, ...props }: MetaRowProps) {
  return (
    <div className={cn("flex items-center gap-2 font-sans", className)} {...props}>
      {avatar}
      {time !== undefined && <span className="text-xs tabular-nums text-text-muted">{time}</span>}
    </div>
  );
}
