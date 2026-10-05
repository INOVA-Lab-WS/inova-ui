import * as React from "react";
import { cn } from "../lib/cn";
import { LogoAmbientAI } from "./logos";

/** Bot avatar · Figma "bot-avatar". Black circle with the AmbientAI symbol; signature 24, welcome 64. */
export interface BotAvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "signature" | "welcome";
  label?: string;
}

export const BotAvatar = React.forwardRef<HTMLSpanElement, BotAvatarProps>(
  ({ size = "signature", label = "AmbientAI", className, ...props }, ref) => (
    <span
      ref={ref}
      role="img"
      aria-label={label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-pill bg-black",
        size === "signature" ? "size-6" : "size-16",
        className,
      )}
      {...props}
    >
      <LogoAmbientAI type="mark" color="white" className={size === "signature" ? "size-3" : "size-6"} />
    </span>
  ),
);
BotAvatar.displayName = "BotAvatar";
