import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "../lib/cn";
import { Button } from "./button";

/**
 * MultiSelect · Figma "multi-select". Trigger with the same height as Input (56/48px), popover with
 * optional search, "Todos" option, checkbox list and "Limpar seleção (n)".
 */
export interface MultiSelectOption {
  value: string;
  label: string;
  /** Supporting line under the label (12, muted), e.g. "dono: fulano". */
  hint?: string;
}
export interface MultiSelectProps {
  options: MultiSelectOption[];
  /** Controlled value. Omit it and use defaultValue to let the component keep its own state. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Form field name: one hidden input per chosen value, read by FormData / server actions. */
  name?: string;
  /** Id(s) of <form>s elsewhere on the page these values belong to: one hidden input per value per form. */
  form?: string | string[];
  label?: React.ReactNode;
  allLabel?: string;
  /** Trigger text when nothing is chosen. */
  placeholder?: string;
  /** Trigger text when every option is chosen; defaults to allLabel. */
  allSelectedLabel?: string;
  searchable?: boolean;
  noResults?: string;
  disabled?: boolean;
  /** Supporting text under the field, linked by aria-describedby. */
  help?: React.ReactNode;
  /** Error under the field: red border, aria-invalid. */
  error?: React.ReactNode;
  className?: string;
}

export function MultiSelect({
  options,
  value: controlled,
  defaultValue = [],
  onValueChange: onChange,
  name,
  form,
  label,
  allLabel = "Todos",
  placeholder = "Todos",
  allSelectedLabel,
  searchable,
  noResults = "Nada encontrado.",
  disabled,
  help,
  error,
  className,
}: MultiSelectProps) {
  const [own, setOwn] = React.useState<string[]>(defaultValue);
  const value = controlled ?? own;
  const onValueChange = (v: string[]) => {
    if (controlled === undefined) setOwn(v);
    onChange?.(v);
  };
  const [query, setQuery] = React.useState("");
  const id = React.useId();
  const filtered = query ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())) : options;
  const all = value.length === options.length && options.length > 0;
  const toggle = (v: string) => onValueChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  const triggerText =
    value.length === 0 ? placeholder : all ? (allSelectedLabel ?? allLabel) : value.length === 1 ? options.find((o) => o.value === value[0])?.label : `${value.length} selecionados`;
  return (
    <div className={cn("flex w-full flex-col gap-1 font-sans", className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      {name &&
        (Array.isArray(form) ? form : [form]).flatMap((f) =>
          value.map((v) => <input key={`${f ?? ""}:${v}`} type="hidden" name={name} value={v} form={f} />),
        )}
      <Popover.Root>
        <Popover.Trigger
          id={id}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={[error ? `${id}-error` : "", help ? `${id}-help` : ""].filter(Boolean).join(" ") || undefined}
          className={cn(
            "flex h-14 w-full items-center gap-2 rounded-12 border border-border-default bg-surface-card px-3 text-left text-base lg:h-12 lg:text-sm",
            "shadow-control hover:border-border-strong",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
            "disabled:bg-surface-disabled disabled:text-text-disabled",
            error && "border-surface-danger",
          )}
        >
          <span className={cn("min-w-0 flex-1 truncate", value.length === 0 || all ? "text-text-muted" : "text-text-primary")}>{triggerText}</span>
          {value.length > 0 && !all && (
            <span
              role="button"
              aria-label="Limpar seleção"
              onClick={(e) => {
                e.preventDefault();
                onValueChange([]);
              }}
              className="inline-flex text-text-muted"
            >
              <X className="size-4" aria-hidden />
            </span>
          )}
          <ChevronDown className="size-4 text-text-muted" aria-hidden />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={4}
            className="z-popover flex w-[var(--radix-popover-trigger-width)] flex-col gap-1 rounded-12 border border-border-default bg-surface-card p-2 font-sans shadow-raised"
          >
            {searchable && (
              <div className="mb-1 flex h-10 items-center gap-2 rounded-8 border border-border-default px-3">
                <Search className="size-4 text-text-muted" aria-hidden />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Pesquisar"
                  aria-label="Pesquisar opções"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-text-muted"
                />
              </div>
            )}
            <div
              role="listbox"
              aria-multiselectable="true"
              aria-label={typeof label === "string" ? label : undefined}
              className="flex flex-col gap-1"
              onKeyDown={(e) => {
                const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role="option"]'));
                const i = items.indexOf(document.activeElement as HTMLElement);
                const go = (n: number) => {
                  e.preventDefault();
                  items[(n + items.length) % items.length]?.focus();
                };
                if (e.key === "ArrowDown") go(i + 1);
                else if (e.key === "ArrowUp") go(i - 1);
                else if (e.key === "Home") go(0);
                else if (e.key === "End") go(items.length - 1);
                else if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  (document.activeElement as HTMLElement)?.click();
                }
              }}
            >
              {!query && (
                <Option selected={all} strong onSelect={() => onValueChange(all ? [] : options.map((o) => o.value))} tabIndex={0}>
                  {allLabel}
                </Option>
              )}
              {filtered.length === 0 && <p className="px-2 py-2 text-sm text-text-muted">{noResults}</p>}
              {filtered.map((o, i) => (
                <Option key={o.value} selected={value.includes(o.value)} onSelect={() => toggle(o.value)} tabIndex={query && i === 0 ? 0 : -1}>
                  {o.hint ? (
                    <span className="flex flex-col">
                      <span>{o.label}</span>
                      <span className="text-xs text-text-muted">{o.hint}</span>
                    </span>
                  ) : (
                    o.label
                  )}
                </Option>
              ))}
            </div>
            {value.length > 0 && !all && (
              <Button variant="ghost" size="desktop" onClick={() => onValueChange([])}>
                Limpar seleção ({value.length})
              </Button>
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {error && (
        <p id={`${id}-error`} className="text-xs text-surface-danger">
          {error}
        </p>
      )}
      {help && (
        <p id={`${id}-help`} className="text-xs text-text-muted">
          {help}
        </p>
      )}
    </div>
  );
}

/** One option of the list: role="option" with aria-selected; the box is drawn like the Checkbox (Figma), decorative. */
function Option({
  selected,
  strong,
  onSelect,
  tabIndex,
  children,
}: {
  selected: boolean;
  strong?: boolean;
  onSelect: () => void;
  tabIndex: number;
  children: React.ReactNode;
}) {
  return (
    <div
      role="option"
      aria-selected={selected}
      tabIndex={tabIndex}
      onClick={onSelect}
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-8 px-2 py-2 text-sm text-text-primary outline-none hover:bg-surface-control",
        "focus-visible:outline-2 focus-visible:outline-text-primary",
        strong && "font-semibold",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "inline-flex size-5 shrink-0 items-center justify-center rounded-4 border",
          selected ? "border-surface-action bg-surface-action text-text-on-action" : "border-border-strong bg-surface-card",
        )}
      >
        {selected && <Check className="size-3" />}
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </div>
  );
}
