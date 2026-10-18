import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "../lib/cn";
import { Button } from "./button";
import { SelectionSurface, type SelectionPresentation } from "./selection-presentation";

export interface ComboboxOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  avatar?: React.ReactNode;
}
export interface ComboboxPanelProps {
  options: ComboboxOption[];
  value: string | null;
  onValueChange: (value: string | null) => void;
  allowCreate?: boolean;
  createLabel?: string | ((query: string) => string);
  /** Return a value or an option to select it; void leaves selection unchanged. Rejection is announced inline. */
  onCreate?: (query: string) => string | ComboboxOption | void | Promise<string | ComboboxOption | void>;
  /** Runs only after a still-current creation resolves; use to retain a newly created label. */
  onOptionCreated?: (option: ComboboxOption) => void;
  originalValue?: string | null;
  onCancel?: () => void;
  onSelect?: () => void;
  emptyText?: string;
  searchPlaceholder?: string;
  cancelLabel?: string;
  resetLabel?: string;
  createErrorText?: string;
  className?: string;
}
export interface ComboboxProps extends Omit<ComboboxPanelProps, "value" | "onValueChange" | "onSelect" | "onOptionCreated"> {
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  presentation?: SelectionPresentation;
  label?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  form?: string;
  help?: React.ReactNode;
  error?: React.ReactNode;
}

export function Combobox({ value: controlled, defaultValue = null, onValueChange, presentation = "responsive", label, placeholder = "Selecione", disabled, name, form, help, error, className, onCancel, ...panel }: ComboboxProps) {
  const [own, setOwn] = React.useState<string | null>(defaultValue);
  const [open, setOpen] = React.useState(false);
  const [created, setCreated] = React.useState<ComboboxOption[]>([]);
  const value = controlled === undefined ? own : controlled;
  const id = React.useId();
  const options = [...panel.options, ...created.filter((item) => !panel.options.some((option) => option.value === item.value))];
  const selected = options.find((option) => option.value === value);
  const change = (next: string | null) => {
    if (controlled === undefined) setOwn(next);
    onValueChange?.(next);
  };
  return <div className={cn("flex w-full flex-col gap-1 font-sans", className)}>
    {label && <label htmlFor={id} className="text-sm font-medium text-text-primary">{label}</label>}
    {name && value !== null && <input type="hidden" name={name} value={value} form={form} disabled={disabled} />}
    <SelectionSurface presentation={presentation} open={open} onOpenChange={setOpen} title={label ?? placeholder}
      className="z-popover flex max-h-[var(--radix-popover-content-available-height)] w-[var(--radix-popover-trigger-width)] min-w-64 flex-col overflow-y-auto rounded-12 border border-border-default bg-surface-card p-2 font-sans shadow-raised"
      trigger={<button id={id} type="button" disabled={disabled} aria-haspopup="dialog" aria-expanded={open} aria-invalid={error ? true : undefined}
        aria-describedby={[error ? `${id}-error` : "", help ? `${id}-help` : ""].filter(Boolean).join(" ") || undefined}
        className={cn("flex h-14 w-full items-center gap-2 rounded-12 border border-border-default bg-surface-card px-3 text-left text-base shadow-control lg:h-12 lg:text-sm hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary disabled:bg-surface-disabled disabled:text-text-disabled", error && "border-surface-danger")}>
        {(selected?.avatar ?? selected?.icon) && <Leading>{selected?.avatar ?? selected?.icon}</Leading>}
        <span className={cn("min-w-0 flex-1 truncate", value === null ? "text-text-muted" : "text-text-primary")}>{selected?.label ?? value ?? placeholder}</span>
        <ChevronDown className="size-4 text-text-muted" aria-hidden />
      </button>}>
      <ComboboxPanel {...panel} options={options} value={value} onValueChange={change} onSelect={() => setOpen(false)} onCancel={() => { setOpen(false); onCancel?.(); }}
        onOptionCreated={(option) => setCreated((items) => [...items.filter((item) => item.value !== option.value), option])} />
    </SelectionSurface>
    {error && <p id={`${id}-error`} className="text-xs text-surface-danger">{error}</p>}
    {help && <p id={`${id}-help`} className="text-xs text-text-muted">{help}</p>}
  </div>;
}

/** Search stays focused; active descendant and option ids provide keyboard list navigation. Caller order is preserved. */
export function ComboboxPanel({ options, value, onValueChange, allowCreate, createLabel, onCreate, onOptionCreated, originalValue, onCancel, onSelect, emptyText = "Nada encontrado.", searchPlaceholder = "Pesquisar", cancelLabel = "Cancelar", resetLabel = "Voltar ao original", createErrorText = "Não foi possível criar. Tente novamente.", className }: ComboboxPanelProps) {
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const mounted = React.useRef(true);
  const request = React.useRef(0);
  const busy = React.useRef(false);
  const id = React.useId();
  const trimmed = query.trim();
  const normalized = trimmed.toLocaleLowerCase();
  const filtered = options.filter((option) => option.label.toLocaleLowerCase().includes(normalized)).slice(0, 50);
  const create = !!allowCreate && !!trimmed && !options.some((option) => option.label.toLocaleLowerCase() === normalized);
  const count = filtered.length + (create ? 1 : 0);
  const cursor = count ? Math.min(active, count - 1) : -1;
  React.useEffect(() => { mounted.current = true; return () => { mounted.current = false; request.current++; }; }, []);
  React.useEffect(() => { inputRef.current?.focus({ preventScroll: true }); }, []);
  React.useEffect(() => { request.current++; busy.current = false; setPending(false); setError(false); }, [value]);
  React.useEffect(() => { if (cursor >= 0) document.getElementById(`${id}-option-${cursor}`)?.scrollIntoView({ block: "nearest" }); }, [cursor, id]);
  const invalidate = () => { request.current++; busy.current = false; setPending(false); setError(false); };
  const choose = async (index: number) => {
    if (busy.current) return;
    const option = filtered[index];
    if (option) { onValueChange(option.value); onSelect?.(); return; }
    if (!create || index !== filtered.length) return;
    const token = ++request.current;
    busy.current = true; setPending(true); setError(false);
    try {
      const result = onCreate ? await onCreate(trimmed) : trimmed;
      if (!mounted.current || token !== request.current) return;
      if (result !== undefined) {
        const option = typeof result === "string" ? { value: result, label: trimmed } : result;
        onOptionCreated?.(option);
        onValueChange(option.value);
        onSelect?.();
      }
    } catch {
      if (mounted.current && token === request.current) setError(true);
    } finally {
      if (mounted.current && token === request.current) { busy.current = false; setPending(false); }
    }
  };
  return <div className={cn("flex min-h-0 flex-col gap-2", className)} aria-busy={pending}>
    <div className="flex h-12 shrink-0 items-center gap-2 rounded-8 border border-border-default px-3">
      <Search className="size-4 shrink-0 text-text-muted" aria-hidden />
      <input ref={inputRef} role="combobox" aria-label={searchPlaceholder} aria-autocomplete="list" aria-expanded="true" aria-controls={`${id}-list`} aria-activedescendant={cursor >= 0 ? `${id}-option-${cursor}` : undefined}
        value={query} placeholder={searchPlaceholder} onChange={(event) => { invalidate(); setQuery(event.target.value); setActive(0); }}
        onKeyDown={(event) => {
          if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
            event.preventDefault();
            if (event.key === "Home") setActive(0);
            else if (event.key === "End") setActive(Math.max(0, count - 1));
            else if (count) setActive((Math.max(0, cursor) + (event.key === "ArrowDown" ? 1 : -1) + count) % count);
          } else if (event.key === "Enter") { event.preventDefault(); if (cursor >= 0 && !event.nativeEvent.isComposing) void choose(cursor); }
          else if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); invalidate(); onCancel?.(); }
        }} className="min-w-0 flex-1 bg-transparent text-base text-text-primary outline-none placeholder:text-text-muted lg:text-sm" />
    </div>
    <div id={`${id}-list`} role="listbox" aria-label={searchPlaceholder} className="flex max-h-64 min-h-0 flex-col gap-1 overflow-y-auto overscroll-contain">
      {filtered.map((option, index) => <div key={option.value} id={`${id}-option-${index}`} role="option" aria-selected={value === option.value} aria-disabled={pending || undefined}
        onMouseDown={(event) => event.preventDefault()} onMouseMove={() => setActive(index)} onClick={() => void choose(index)}
        className={cn("flex min-h-11 cursor-pointer items-center gap-2 rounded-8 px-3 py-2 text-sm text-text-primary", cursor === index && "bg-surface-muted")}>
        {(option.avatar ?? option.icon) && <Leading>{option.avatar ?? option.icon}</Leading>}<span className="min-w-0 flex-1">{option.label}</span>{value === option.value && <Check className="size-4 shrink-0" aria-hidden />}
      </div>)}
      {create && <div id={`${id}-option-${filtered.length}`} role="option" aria-selected="false" aria-disabled={pending || undefined} onMouseDown={(event) => event.preventDefault()} onMouseMove={() => setActive(filtered.length)} onClick={() => void choose(filtered.length)}
        className={cn("min-h-11 cursor-pointer rounded-8 px-3 py-2 text-sm text-text-primary", cursor === filtered.length && "bg-surface-muted")}>
        {pending ? "Criando…" : typeof createLabel === "function" ? createLabel(trimmed) : createLabel ?? `Usar “${trimmed}” como novo`}
      </div>}
      {!count && <p className="px-3 py-2 text-sm text-text-muted" role="status">{emptyText}</p>}
    </div>
    {error && <p role="alert" className="text-xs text-surface-danger">{createErrorText}</p>}
    <div className="flex flex-wrap justify-end gap-2 border-t border-border-default pt-2">
      {originalValue !== undefined && <Button variant="ghost" onClick={() => { invalidate(); onValueChange(originalValue); onSelect?.(); }}>{resetLabel}</Button>}
      <Button variant="ghost" onClick={() => { invalidate(); onCancel?.(); }}>{cancelLabel}</Button>
    </div>
  </div>;
}
function Leading({ children }: { children: React.ReactNode }) {
  return <span aria-hidden className="inline-flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-pill [&>svg]:size-4 [&>img]:size-6 [&>img]:object-cover">{children}</span>;
}
