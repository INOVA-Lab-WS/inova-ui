import * as React from "react";
import { BREAKPOINTS, type Breakpoint } from "./breakpoints";

/**
 * Media query in code. Safe for server-rendered pages: the server and the first client render use `initial`
 * (default false), then it follows the browser, without a hydration warning.
 */
export function useMediaQuery(query: string, initial = false) {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );
  return React.useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => initial,
  );
}

/** At least this width, with the theme's breakpoints (tablet 768, desktop 1024, wide 1440). */
export function useMinWidth(px: number) {
  return useMediaQuery(`(min-width: ${px}px)`);
}

/** "mobile" | "tablet" | "desktop" | "wide", from the same tokens as the CSS. "mobile" on the server. */
export function useBreakpoint(): Breakpoint {
  const tablet = useMinWidth(BREAKPOINTS.tablet);
  const desktop = useMinWidth(BREAKPOINTS.desktop);
  const wide = useMinWidth(BREAKPOINTS.wide);
  return wide ? "wide" : desktop ? "desktop" : tablet ? "tablet" : "mobile";
}

/** True on a touch screen (coarse pointer). */
export function usePointerCoarse() {
  return useMediaQuery("(pointer: coarse)");
}

/**
 * Measures the on-screen keyboard and writes --inova-kb-inset and --inova-visual-viewport-height on <html>
 * (only when they change), from visualViewport resize and scroll. Mount it once (KeyboardInsetProvider does).
 * Works with the default interactive-widget (resizes-visual) on iOS Safari, as an installed app, and Chrome Android.
 */
export function useKeyboardInset() {
  React.useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const root = document.documentElement;
    let lastInset = -1;
    let lastHeight = -1;
    const update = () => {
      const inset = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
      const height = Math.round(vv.height);
      if (inset !== lastInset) {
        lastInset = inset;
        root.style.setProperty("--inova-kb-inset", `${inset}px`);
      }
      if (height !== lastHeight) {
        lastHeight = height;
        root.style.setProperty("--inova-visual-viewport-height", `${height}px`);
      }
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);
}

/** Mount once near the root: keeps --inova-kb-inset and --inova-visual-viewport-height up to date. */
export function KeyboardInsetProvider({ children }: { children?: React.ReactNode }) {
  useKeyboardInset();
  return <>{children}</>;
}
