import * as React from "react";

interface MenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}
const MenuContext = React.createContext<MenuContextValue | null>(null);
export interface MenuProviderProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}
/** Shares the mobile menu state with Header. No router integration is required. */
export function MenuProvider({ children, open, defaultOpen = false, onOpenChange }: MenuProviderProps) {
  const [own, setOwn] = React.useState(defaultOpen);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const setOpen = React.useCallback((next: boolean) => {
    if (open === undefined) setOwn(next);
    onOpenChange?.(next);
  }, [open, onOpenChange]);
  return <MenuContext.Provider value={{ open: open ?? own, setOpen, triggerRef }}>{children}</MenuContext.Provider>;
}
export function useMenu() { return React.useContext(MenuContext); }
