import * as React from "react";
import { cn } from "../lib/cn";
import { ActivityLogRow, type ActivityLogRowProps } from "./activity-log-row";
import { Skeleton } from "./skeleton";

/**
 * Activity log · Figma "activity-log": entries grouped by day; states loading, unavailable, empty, populated.
 * loading (#66): skeleton lines in the shape of ActivityLogRow (time, disc and author, 2 detail lines); the phrase stays
 * for screen readers. `skeletonRows` sets how many (default 3).
 */
export interface ActivityLogEntry extends Omit<ActivityLogRowProps, "className"> { id: string; day: string }

export interface ActivityLogProps extends React.HTMLAttributes<HTMLDivElement> {
  entries?: ActivityLogEntry[];
  state?: "loading" | "unavailable" | "empty" | "populated";
  /** Custom message for the empty state. */
  emptyMessage?: React.ReactNode;
  /** Skeleton lines while loading (default 3). */
  skeletonRows?: number;
}

const MESSAGES = { loading: "Carregando edições…", unavailable: "O registro de edições não está disponível agora.", empty: "Nenhuma edição registrada." };

export const ActivityLog = React.forwardRef<HTMLDivElement, ActivityLogProps>(({ entries = [], state, emptyMessage, skeletonRows = 3, className, ...props }, ref) => {
  const s = state ?? (entries.length ? "populated" : "empty");
  const days: [string, ActivityLogEntry[]][] = [];
  for (const e of entries) {
    const g = days.find(([d]) => d === e.day);
    if (g) g[1].push(e); else days.push([e.day, [e]]);
  }
  return (
    <div ref={ref} className={cn("flex flex-col gap-4 font-sans", className)} {...props}>
      {s === "loading" ? (
        <div role="status" aria-busy className="flex flex-col">
          <span className="sr-only">{MESSAGES.loading}</span>
          {Array.from({ length: skeletonRows }, (_, i) => (
            <div key={i} aria-hidden className="flex gap-3 p-3">
              <Skeleton shape="text" className="mt-1 w-12 md:w-13" />
              <div className="flex min-w-0 flex-1 flex-col gap-2 md:flex-row md:gap-3">
                <div className="flex items-center gap-2 md:w-45 md:shrink-0">
                  <Skeleton shape="circle" className="size-6" />
                  <Skeleton shape="text" className="w-24" />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton shape="text" className="w-3/5" />
                  <Skeleton shape="text" className="w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : s !== "populated" ? (
        <p role="status" className="py-4 text-sm text-text-muted">{s === "empty" && emptyMessage !== undefined ? emptyMessage : MESSAGES[s]}</p>
      ) : (
        days.map(([day, rows]) => (
          <section key={day} className="flex flex-col gap-1">
            <h4 className="text-xs font-semibold text-text-muted">{day}</h4>
            <ul className="flex flex-col">
              {rows.map(({ id, day: _d, ...r }) => <ActivityLogRow key={id} {...r} />)}
            </ul>
          </section>
        ))
      )}
    </div>
  );
});
ActivityLog.displayName = "ActivityLog";
