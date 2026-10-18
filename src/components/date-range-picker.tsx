import * as React from "react";
import { SelectionSurface, type SelectionPresentation } from "./selection-presentation";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { Chip } from "./chip";

/**
 * DateRangePicker · Figma "date-range-picker" (+ day part; presets and "Aplicar" are Chip).
 * Trigger (56/48px) → popover with presets, month grid and "Aplicar". pt-BR via Intl, no date library.
 */
export interface DateRange {
  from: Date;
  to: Date;
}
export interface DateRangePreset {
  label: string;
  range: () => DateRange;
}
export interface DateRangePickerProps {
  presentation?: SelectionPresentation;
  value: DateRange | null;
  onValueChange: (range: DateRange | null) => void;
  presets?: DateRangePreset[];
  label?: React.ReactNode;
  max?: Date;
  className?: string;
}

const day0 = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const same = (a?: Date | null, b?: Date | null) => !!a && !!b && day0(a).getTime() === day0(b).getTime();
const fmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" });
const fmtFull = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
const fmtMonth = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });

export const defaultDatePresets: DateRangePreset[] = [
  { label: "Últimos 7 dias", range: () => ({ from: addDays(day0(new Date()), -6), to: day0(new Date()) }) },
  { label: "Últimos 30 dias", range: () => ({ from: addDays(day0(new Date()), -29), to: day0(new Date()) }) },
  { label: "Últimos 90 dias", range: () => ({ from: addDays(day0(new Date()), -89), to: day0(new Date()) }) },
];

export function DateRangeDay({
  date,
  selected,
  edge,
  inRange,
  today,
  disabled,
  onSelect,
}: {
  date: Date;
  selected?: boolean;
  edge?: boolean;
  inRange?: boolean;
  today?: boolean;
  disabled?: boolean;
  onSelect?: (d: Date) => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect?.(date)}
      aria-label={fmtFull.format(date)}
      aria-pressed={selected || edge}
      className={cn(
        "mx-auto flex size-9 items-center justify-center rounded-8 text-xs tabular-nums transition-colors outline-none",
        "focus-visible:outline-2 focus-visible:outline-text-primary",
        edge ? "bg-surface-ink font-bold text-text-on-ink" : inRange ? "bg-surface-ink/10 text-text-primary" : "text-text-primary hover:bg-surface-muted",
        today && !edge && "font-bold",
        disabled && "text-text-disabled hover:bg-transparent",
      )}
    >
      {date.getDate()}
    </button>
  );
}

export function DateRangePicker({ value, onValueChange, presets = defaultDatePresets, label, max = new Date(), className, presentation = "popover" }: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();
  const activePreset = presets.find((p) => value && same(p.range().from, value.from) && same(p.range().to, value.to));
  const trigger = activePreset ? activePreset.label : value ? `${fmt.format(value.from)} – ${fmt.format(value.to)}` : "Escolha o período";
  return <div className={cn("flex w-full flex-col gap-1 font-sans", className)}>
    {label && <label htmlFor={id} className="text-sm font-medium text-text-primary">{label}</label>}
    <SelectionSurface presentation={presentation} open={open} onOpenChange={setOpen} title={label ?? "Período"}
      className="z-popover flex max-h-[var(--radix-popover-content-available-height)] w-80 max-w-[calc(100vw-16px)] flex-col overflow-y-auto rounded-16 border border-border-default bg-surface-card p-3 font-sans shadow-raised lg:w-88"
      trigger={<button type="button"
          id={id}
          className={cn(
            "flex h-14 w-full items-center gap-2 rounded-16 border border-border-default bg-surface-card px-3 text-left text-base lg:h-12 lg:text-sm",
            "shadow-control hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
          )}
        >
          <CalendarDays className="size-4 text-text-muted" aria-hidden />
          <span className="min-w-0 flex-1 truncate text-text-primary">{trigger}</span>
        </button>}>
      <DateRangePanel value={value} onValueChange={onValueChange} presets={presets} max={max} onApply={() => setOpen(false)} />
    </SelectionSurface>
  </div>;
}

export interface DateRangePanelProps extends Omit<DateRangePickerProps, "presentation" | "label"> {
  /** Called after a preset or a complete custom range is committed. */
  onApply?: () => void;
}
/** Controlled value with a local custom-range draft; cancellation never commits it. */
export function DateRangePanel({ value, onValueChange, presets = defaultDatePresets, max = new Date(), className, onApply }: DateRangePanelProps) {
  const [draft, setDraft] = React.useState<{ from: Date | null; to: Date | null }>({ from: value?.from ?? null, to: value?.to ?? null });
  const [month, setMonth] = React.useState(() => {
    const b = value?.to ?? new Date();
    return new Date(b.getFullYear(), b.getMonth(), 1);
  });
  const activePreset = presets.find((p) => value && same(p.range().from, value.from) && same(p.range().to, value.to));
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const lead = first.getDay();
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const pick = (d: Date) => {
    if (!draft.from || draft.to) setDraft({ from: d, to: null });
    else if (d < draft.from) setDraft({ from: d, to: draft.from });
    else setDraft({ from: draft.from, to: d });
  };
  const summary = draft.from && draft.to ? `${fmtFull.format(draft.from)} – ${fmtFull.format(draft.to)}` : draft.from ? `${fmtFull.format(draft.from)} – …` : "Escolha a data inicial";
  React.useEffect(() => {
    setDraft({ from: value?.from ?? null, to: value?.to ?? null });
    const base = value?.to ?? new Date();
    setMonth(new Date(base.getFullYear(), base.getMonth(), 1));
  }, [value?.from?.getTime(), value?.to?.getTime()]);
  return <div className={cn("flex min-h-0 flex-col gap-3", className)}>
    <div className="flex flex-wrap gap-2">
      {presets.map((p) => (
        <Chip
          key={p.label}
          size="small"
          appearance={activePreset?.label === p.label ? "action" : "filled"}
          onClick={() => {
            onValueChange(p.range());
            onApply?.();
          }}
        >
          {p.label}
        </Chip>
      ))}
    </div>
    <div className="flex items-center justify-between">
      <Button variant="ghost" size="desktop" iconOnly aria-label="Mês anterior" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>
        <ChevronLeft aria-hidden />
      </Button>
      <span className="text-sm font-semibold capitalize">{fmtMonth.format(month)}</span>
      <Button
        variant="ghost"
        size="desktop"
        iconOnly
        aria-label="Próximo mês"
        disabled={new Date(month.getFullYear(), month.getMonth() + 1, 1) > max}
        onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
      >
        <ChevronRight aria-hidden />
      </Button>
    </div>
    <div className="grid grid-cols-7 gap-y-1 text-center">
      {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
        <span key={i} className="text-xs font-semibold text-text-muted">
          {d}
        </span>
      ))}
      {Array.from({ length: lead }).map((_, i) => (
        <span key={`e${i}`} />
      ))}
      {Array.from({ length: days }).map((_, i) => {
        const d = new Date(month.getFullYear(), month.getMonth(), i + 1);
        const edge = same(d, draft.from) || same(d, draft.to);
        const inRange = !!draft.from && !!draft.to && d > draft.from && d < draft.to;
        const band = !!draft.from && !!draft.to && !same(draft.from, draft.to) && (inRange || edge);
        return (
          <div key={i} className={cn("flex h-9 items-center", band && "bg-surface-ink/10", band && same(d, draft.from) && "rounded-l-8", band && same(d, draft.to) && "rounded-r-8")}>
            <DateRangeDay date={d} edge={edge} today={same(d, new Date())} disabled={d > max} onSelect={pick} />
          </div>
        );
      })}
    </div>
    <div className="flex items-center justify-between gap-2 border-t border-border-default pt-3">
      <span className="text-xs text-text-muted">{summary}</span>
      <Chip
        size="small"
        appearance="action"
        disabled={!draft.from || !draft.to}
        onClick={() => {
          if (draft.from && draft.to) onValueChange({ from: draft.from, to: draft.to });
          onApply?.();
        }}
      >
        Aplicar
      </Chip>
    </div>
  </div>;
}
