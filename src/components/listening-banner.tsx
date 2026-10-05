import * as React from "react";
import { cn } from "../lib/cn";
import { Waveform } from "./waveform";

/** ListeningBanner · Figma "listening-banner". Shown above the composer while recording. */
export interface ListeningBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  levels?: number[];
}

export function ListeningBanner({ label = "Ouvindo…", levels, className, ...props }: ListeningBannerProps) {
  return (
    <div role="status" className={cn("flex items-center justify-center gap-3 rounded-16 bg-surface-shell px-4 py-3 font-sans text-sm font-semibold text-text-primary", className)} {...props}>
      <Waveform levels={levels} />
      <span>{label}</span>
    </div>
  );
}
