import * as React from "react";
import { cn } from "../lib/cn";
import { InputCard, type InputCardProps } from "./input-card";
import { ListeningBanner } from "./listening-banner";

/**
 * Composer · Figma "composer". InputCard plus what stacks above it:
 * the listening banner while recording, or the mention results while typing "@".
 */
export interface ComposerProps extends InputCardProps {
  recording?: boolean;
  levels?: number[];
  /** Usually a list of <MentionResult />. */
  mentions?: React.ReactNode;
  wrapperClassName?: string;
}

export const Composer = React.forwardRef<HTMLTextAreaElement, ComposerProps>(
  ({ recording, levels, mentions, wrapperClassName, ...props }, ref) => (
    <div className={cn("flex flex-col gap-2", wrapperClassName)}>
      {recording && <ListeningBanner levels={levels} />}
      {!recording && mentions && (
        <div role="listbox" className="flex max-h-64 flex-col overflow-y-auto rounded-16 bg-surface-card">
          {mentions}
        </div>
      )}
      <InputCard ref={ref} {...props} />
    </div>
  ),
);
Composer.displayName = "Composer";
