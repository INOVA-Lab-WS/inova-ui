import * as React from "react";
import { Avatar } from "./avatar";
import { LogoAmbientAI } from "./logos";

/**
 * @deprecated The library replaced "bot-avatar" with "avatar" (variant=icon) holding the brand mark.
 * Use <Avatar size="small" name="AmbientAI" icon={<LogoAmbientAI type="mark" color="white" />} />. Kept as a thin wrapper so apps keep working.
 */
export interface BotAvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "signature" | "welcome";
  label?: string;
}

export const BotAvatar = React.forwardRef<HTMLSpanElement, BotAvatarProps>(({ size = "signature", label = "AmbientAI", ...props }, ref) => (
  <Avatar
    ref={ref}
    name={label}
    size={size === "signature" ? "small" : "large"}
    icon={<LogoAmbientAI type="mark" color="white" className={size === "signature" ? "h-3" : "h-7"} />}
    {...props}
  />
));
BotAvatar.displayName = "BotAvatar";
