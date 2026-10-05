import * as React from "react";
import { cn } from "../lib/cn";

/**
 * Waveform · Figma "waveform". 64x20 level meter.
 * `levels` (0..1, any length) draws the live mode; without it, the fallback pulses 5 bars.
 */
export interface WaveformProps extends React.HTMLAttributes<HTMLDivElement> {
  levels?: number[];
}

const FALLBACK = [40, 75, 100, 75, 40];

export function Waveform({ levels, className, ...props }: WaveformProps) {
  return (
    <div aria-hidden className={cn("flex h-5 w-16 items-center justify-center gap-1 text-green-primary", className)} {...props}>
      {levels
        ? levels.map((l, i) => (
            <span key={i} className="w-px rounded-4 bg-current" style={{ height: `${Math.max(10, Math.min(1, l) * 100)}%` }} />
          ))
        : FALLBACK.map((h, i) => (
            <span key={i} className="w-1 animate-pulse rounded-pill bg-current" style={{ height: `${h}%`, animationDelay: `${i * 120}ms` }} />
          ))}
    </div>
  );
}
