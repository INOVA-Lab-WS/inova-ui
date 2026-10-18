import * as React from "react";
import { ArrowLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useMinWidth } from "../lib/hooks";
import { BREAKPOINTS } from "../lib/breakpoints";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { Overlay } from "./overlay";

export interface FilterBarPanelContext { back: () => void; close: () => void }
export interface FilterBarFilter {
  id: string;
  label: string;
  summary?: React.ReactNode;
  active?: boolean;
  /** Full field shown in the caller-configurable desktop grid. */
  field?: React.ReactNode;
  /** Portal-free content such as MultiSelectPanel or DateRangePanel. */
  panel: React.ReactNode | ((context: FilterBarPanelContext) => React.ReactNode);
}
export interface FilterBarProps {
  primary: React.ReactNode;
  filters: FilterBarFilter[];
  title?: string;
  resultsLabel?: string;
  onApply?: () => void;
  className?: string;
  desktopClassName?: string;
}
/** Generic filter composition. Values belong to callers; only same-sheet navigation is internal. */
export function FilterBar({ primary, filters, title = "Filtros", resultsLabel = "Ver resultados", onApply, className, desktopClassName }: FilterBarProps) {
  const tablet = useMinWidth(BREAKPOINTS.tablet);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string | null>(null);
  const trigger = React.useRef<HTMLButtonElement>(null);
  const backRef = React.useRef<HTMLButtonElement>(null);
  const rows = React.useRef<Map<string, HTMLButtonElement>>(new Map());
  const previous = React.useRef<string | null>(null);
  const current = filters.find((filter) => filter.id === selected);
  const count = filters.filter((filter) => filter.active).length;
  const close = () => setOpen(false);
  const back = () => setSelected(null);
  React.useEffect(() => {
    if (tablet) { setOpen(false); setSelected(null); }
  }, [tablet]);
  React.useEffect(() => {
    if (!open) return;
    if (selected) backRef.current?.focus({ preventScroll: true });
    else if (previous.current) rows.current.get(previous.current)?.focus({ preventScroll: true });
    previous.current = selected;
  }, [selected, open]);
  React.useEffect(() => {
    if (selected && !current) setSelected(null);
  }, [selected, current]);
  if (tablet) return <div className={cn("grid grid-cols-2 items-end gap-3 lg:grid-cols-4", desktopClassName, className)}>
    {primary}{filters.map((filter) => <React.Fragment key={filter.id}>{filter.field}</React.Fragment>)}
  </div>;
  return <div className={cn("flex items-end gap-2", className)}>
    <div className="min-w-0 flex-1">{primary}</div>
    <button ref={trigger} type="button" aria-label={count ? `${title}: ${count} ativos` : title} aria-haspopup="dialog" aria-expanded={open}
      onClick={() => { setSelected(null); setOpen(true); }}
      className="relative flex size-14 shrink-0 items-center justify-center rounded-12 border border-border-default bg-surface-card text-text-primary shadow-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary">
      <SlidersHorizontal className="size-5" aria-hidden />
      {count > 0 && <span aria-hidden className="absolute right-1 top-1 flex min-w-4 items-center justify-center rounded-pill bg-surface-action px-1 text-xs text-text-on-action">{count}</span>}
    </button>
    <Overlay open={open} onOpenChange={setOpen} presentation="bottom-sheet" title={current?.label ?? title}
      onExitComplete={() => trigger.current?.focus({ preventScroll: true })}
      footer={<Button onClick={() => { onApply?.(); close(); }}>{resultsLabel}</Button>}>
      {current ? <>
        <button ref={backRef} type="button" onClick={back} className="flex min-h-11 items-center gap-2 rounded-8 text-sm text-text-primary focus-visible:outline-2 focus-visible:outline-text-primary">
          <ArrowLeft className="size-4" aria-hidden />Todos os filtros
        </button>
        <div key={current.id}>{typeof current.panel === "function" ? current.panel({ back, close }) : current.panel}</div>
      </> : filters.map((filter) => <button key={filter.id} type="button" ref={(node) => { if (node) rows.current.set(filter.id, node); else rows.current.delete(filter.id); }}
        onClick={() => setSelected(filter.id)} className="flex min-h-14 items-center gap-3 rounded-12 px-3 py-2 text-left hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-text-primary">
        <span className="flex min-w-0 flex-1 flex-col"><span className="text-sm font-medium text-text-primary">{filter.label}</span><span className="truncate text-xs text-text-muted">{filter.summary ?? "Todos"}</span></span>
        <ChevronRight className="size-4 shrink-0 text-text-muted" aria-hidden />
      </button>)}
    </Overlay>
  </div>;
}
