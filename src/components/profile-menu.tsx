import * as React from "react";
import * as Primitive from "@radix-ui/react-dropdown-menu";
import { LogOut } from "lucide-react";
import { cn } from "../lib/cn";
import { Avatar } from "./avatar";
import { ActionMenuItem, ActionMenuSeparator } from "./action-menu";

/**
 * ProfileMenu · Figma "profile-menu". The person's menu: the avatar opens a panel with a large avatar, name and email,
 * the app's own actions (children, usually ActionMenuItem, e.g. "Trocar foto") and "Sair" last, after a divider.
 * Esc and clicking outside close it and return focus to the avatar. The photo is only one the person uploaded.
 */
export interface ProfileMenuProps {
  name: string;
  email?: string;
  /** Photo the person uploaded to the app; without it, the initial. */
  avatarSrc?: string;
  /** App actions, as ActionMenuItem. */
  children?: React.ReactNode;
  onSignOut?: () => void;
  signOutLabel?: string;
  /** Replace the default "Sair" item, e.g. with a form submit button rendered through ActionMenuItem asChild. */
  signOut?: React.ReactNode;
  triggerLabel?: string;
  align?: "start" | "center" | "end";
  className?: string;
}

export function ProfileMenu({
  name,
  email,
  avatarSrc,
  children,
  onSignOut,
  signOutLabel = "Sair",
  signOut,
  triggerLabel,
  align = "end",
  className,
}: ProfileMenuProps) {
  return (
    <Primitive.Root>
      <Primitive.Trigger
        aria-label={triggerLabel ?? `Menu de ${name}`}
        className="rounded-pill outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
      >
        <Avatar name={name} src={avatarSrc} size="medium" aria-hidden />
      </Primitive.Trigger>
      <Primitive.Portal>
        <Primitive.Content
          align={align}
          sideOffset={8}
          className={cn(
            "z-50 flex w-64 max-w-[calc(100vw-2rem)] flex-col rounded-12 border border-border-default bg-surface-card p-1 font-sans shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)]",
            className,
          )}
        >
          <Primitive.Label className="flex items-center gap-3 p-3">
            <Avatar name={name} src={avatarSrc} size="large" aria-hidden />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-sm font-semibold break-words text-text-primary">{name}</span>
              {email && <span className="text-xs break-all text-text-muted">{email}</span>}
            </span>
          </Primitive.Label>
          {children && (
            <>
              <ActionMenuSeparator />
              {children}
            </>
          )}
          <ActionMenuSeparator />
          {signOut ?? (
            <ActionMenuItem icon={<LogOut aria-hidden />} onSelect={onSignOut}>
              {signOutLabel}
            </ActionMenuItem>
          )}
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  );
}
