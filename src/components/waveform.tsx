import * as React from "react";
import { cn } from "../lib/cn";

/**
 * Waveform · Figma "waveform". 64x20 level meter in green/primary (#68).
 * `levels` (0..1, any length; the Figma draws 24) draws the live mode: bars of ~1.4px spread across the 64px with ~1.3px
 * between them, radius 4, 2px high at rest, clipped to the box. Without `levels`, the fallback pulses 5 bars of 4px
 * (2px apart, 28px wide).
 */
export interface WaveformProps extends React.HTMLAttributes<HTMLDivElement> {
  levels?: number[];
}

const FALLBACK = [40, 75, 100, 75, 40];

export function Waveform({ levels, className, ...props }: WaveformProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex h-5 shrink-0 items-center overflow-hidden text-green-primary",
        levels ? "w-16 justify-between" : "w-7 gap-0.5",
        className,
      )}
      {...props}
    >
      {levels
        ? levels.map((l, i) => (
            <span key={i} className="w-[1.4px] shrink-0 rounded-4 bg-current" style={{ height: `${Math.max(10, Math.min(1, Math.max(0, l)) * 100)}%` }} />
          ))
        : FALLBACK.map((h, i) => (
            <span key={i} className="w-1 shrink-0 animate-pulse rounded-4 bg-current motion-reduce:animate-none" style={{ height: `${h}%`, animationDelay: `${i * 120}ms` }} />
          ))}
    </div>
  );
}
