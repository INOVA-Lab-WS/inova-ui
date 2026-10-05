import * as React from "react";
import { cn } from "../lib/cn";
import { ActivityLogRow, type ActivityLogRowProps } from "./activity-log-row";

/** Activity log · Figma "activity-log": entries grouped by day; states loading, unavailable, empty, populated. */
export interface ActivityLogEntry extends Omit<ActivityLogRowProps, "className"> { id: string; day: string }

export interface ActivityLogProps extends React.HTMLAttributes<HTMLDivElement> {
  entries?: ActivityLogEntry[];
  state?: "loading" | "unavailable" | "empty" | "populated";
}

const MESSAGES = { loading: "Carregando edições…", unavailable: "O registro de edições não está disponível agora.", empty: "Nenhuma edição registrada." };

export const ActivityLog = React.forwardRef<HTMLDivElement, ActivityLogProps>(({ entries = [], state, className, ...props }, ref) => {
  const s = state ?? (entries.length ? "populated" : "empty");
  const days: [string, ActivityLogEntry[]][] = [];
  for (const e of entries) {
    const g = days.find(([d]) => d === e.day);
    if (g) g[1].push(e); else days.push([e.day, [e]]);
  }
  return (
    <div ref={ref} className={cn("flex flex-col gap-4 font-sans", className)} {...props}>
      {s !== "populated" ? (
        <p role="status" className="py-4 text-sm text-text-muted">{MESSAGES[s]}</p>
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
