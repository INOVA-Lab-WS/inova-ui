import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDown, Search, X } from "lucide-react";
import { cn } from "../lib/cn";
import { Checkbox } from "./checkbox";
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
          className={cn(
            "flex h-14 w-full items-center gap-2 rounded-12 border border-border-default bg-surface-card px-3 text-left text-base lg:h-12 lg:text-sm",
            "shadow-[0_1px_2px_rgb(0_0_0/0.05)] hover:border-border-strong",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary",
            "disabled:bg-surface-disabled disabled:text-text-disabled",
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
            className="z-50 flex w-[var(--radix-popover-trigger-width)] flex-col gap-1 rounded-12 border border-border-default bg-surface-card p-2 font-sans shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)]"
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
            {!query && (
              <Checkbox
                label={allLabel}
                checked={all}
                onChange={() => onValueChange(all ? [] : options.map((o) => o.value))}
                className="rounded-8 px-2 py-2 text-sm font-semibold hover:bg-surface-control"
              />
            )}
            {filtered.length === 0 && <p className="px-2 py-2 text-sm text-text-muted">{noResults}</p>}
            {filtered.map((o) => (
              <Checkbox
                key={o.value}
                label={
                  o.hint ? (
                    <span className="flex flex-col">
                      <span>{o.label}</span>
                      <span className="text-xs text-text-muted">{o.hint}</span>
                    </span>
                  ) : (
                    o.label
                  )
                }
                checked={value.includes(o.value)}
                onChange={() => toggle(o.value)}
                className="rounded-8 px-2 py-2 text-sm hover:bg-surface-control"
              />
            ))}
            {value.length > 0 && !all && (
              <Button variant="ghost" size="desktop" onClick={() => onValueChange([])}>
                Limpar seleção ({value.length})
              </Button>
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
