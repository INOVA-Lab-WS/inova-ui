import * as React from "react";
import * as Primitive from "@radix-ui/react-dropdown-menu";
import { LogOut } from "lucide-react";
import { cn } from "../lib/cn";
import { useMinWidth } from "../lib/hooks";
import { BREAKPOINTS } from "../lib/breakpoints";
import { Avatar } from "./avatar";
import { ActionMenuItem, ActionMenuSeparator, ActionMenuSheetContext } from "./action-menu";
import { Overlay } from "./overlay";

/**
 * ProfileMenu · Figma "profile-menu". The person's menu: the avatar opens a panel with a large avatar, name and email,
 * the app's own actions (children, usually ActionMenuItem, e.g. "Trocar foto") and "Sair" last, after a divider.
 * Esc and clicking outside close it and return focus to the avatar. The photo is only one the person uploaded.
 * presentation (#70): "popover" (default, the dropdown), "bottom-sheet" (the Overlay bottom sheet: handle, large avatar,
 * name and email, the actions and "Sair", 40px items), or "responsive": bottom sheet below 1024px, dropdown from 1024px.
 * The same ActionMenuItem children work in both.
 */
export type ProfileMenuPresentation = "popover" | "bottom-sheet" | "responsive";

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
  /** "popover" (default), "bottom-sheet", or "responsive" (bottom sheet below 1024px). */
  presentation?: ProfileMenuPresentation;
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
  presentation: requested = "popover",
  className,
}: ProfileMenuProps) {
  const desktop = useMinWidth(BREAKPOINTS.desktop);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const presentation = requested === "responsive" ? (desktop ? "popover" : "bottom-sheet") : requested;
  const trigger = "rounded-pill outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary";
  if (presentation === "bottom-sheet") {
    return (
      <>
        <button type="button" aria-label={triggerLabel ?? `Menu de ${name}`} aria-haspopup="dialog" aria-expanded={sheetOpen} onClick={() => setSheetOpen(true)} className={cn("cursor-pointer", trigger)}>
          <Avatar name={name} src={avatarSrc} size="medium" aria-hidden />
        </button>
        <Overlay open={sheetOpen} onOpenChange={setSheetOpen} presentation="bottom-sheet" title={name} hideTitle hideClose className={className}>
          <ActionMenuSheetContext.Provider value={{ close: () => setSheetOpen(false) }}>
            <div className="-mx-1 -mt-2 flex flex-col">
              <div className="flex items-center gap-3 p-3">
                <Avatar name={name} src={avatarSrc} size="large" aria-hidden />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-sm font-semibold break-words text-text-primary">{name}</span>
                  {email && <span className="text-xs break-all text-text-muted">{email}</span>}
                </span>
              </div>
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
            </div>
          </ActionMenuSheetContext.Provider>
        </Overlay>
      </>
    );
  }
  return (
    <Primitive.Root>
      <Primitive.Trigger
        aria-label={triggerLabel ?? `Menu de ${name}`}
        className={trigger}
      >
        <Avatar name={name} src={avatarSrc} size="medium" aria-hidden />
      </Primitive.Trigger>
      <Primitive.Portal>
        <Primitive.Content
          align={align}
          sideOffset={8}
          className={cn(
            "z-popover flex w-64 max-w-[calc(100vw-2rem)] flex-col rounded-12 border border-border-default bg-surface-card p-1 font-sans shadow-raised",
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
