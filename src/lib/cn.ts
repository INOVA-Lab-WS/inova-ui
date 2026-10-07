import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge with the theme's names, so classes that do not conflict are kept (text-text-muted with
 * text-chart-axis: a colour and a size) and the ones that do are resolved (rounded-8 then rounded-pill).
 * Exported as inovaMergeConfig so an app can build its own cn with the same rules.
 */
export const inovaMergeConfig = {
  extend: {
    theme: {
      text: ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "chart-axis"],
      radius: ["0", "4", "8", "12", "16", "24", "pill"],
      shadow: ["control", "raised", "overlay", "action-glow"],
      breakpoint: ["tablet", "desktop", "wide"],
      tracking: ["tight", "normal", "wide"],
      ease: ["enter", "exit", "standard"],
    },
    classGroups: {
      z: [{ z: ["base", "raised", "header", "overlay", "popover", "toast", "splash"] }],
    },
  },
} as const;

const twMerge = extendTailwindMerge(inovaMergeConfig as Parameters<typeof extendTailwindMerge>[0]);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
